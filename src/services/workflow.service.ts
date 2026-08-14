import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type ApprovalTaskRow = Database['public']['Tables']['approval_tasks']['Row']
export type ApprovalTaskInsert = Database['public']['Tables']['approval_tasks']['Insert']
export type WorkflowTransitionRow = Database['public']['Tables']['workflow_transitions']['Row']

export interface ApprovalTaskWithRelations extends ApprovalTaskRow {
  requester?: {
    id: string
    full_name: string
    employee_code: string
    department_id: string | null
  } | null
  approver?: {
    id: string
    full_name: string
    employee_code: string
  } | null
  transitions?: WorkflowTransitionRow[]
}

export const workflowService = {
  generateSecurityToken(): string {
    return 'sec_' + crypto.randomUUID().replace(/-/g, '') + '_' + Date.now().toString(36)
  },

  async getPendingTasks(params?: {
    approverId?: string
    requesterId?: string
    documentType?: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  }): Promise<{ data: ApprovalTaskWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('approval_tasks')
        .select('*, requester:profiles!requester_id(id, full_name, employee_code, department_id), approver:profiles!approver_id(id, full_name, employee_code), transitions:workflow_transitions(*)')
        .order('created_at', { ascending: false })

      if (params?.approverId) {
        query = query.eq('approver_id', params.approverId)
      }
      if (params?.requesterId) {
        query = query.eq('requester_id', params.requesterId)
      }
      if (params?.documentType) {
        query = query.eq('document_type', params.documentType)
      }
      if (params?.status) {
        query = query.eq('status', params.status)
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as ApprovalTaskWithRelations[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async createApprovalTask(input: {
    document_type: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
    document_id: string
    document_no: string
    requester_id: string
    approver_id: string
    step_order?: number
  }): Promise<{ data: ApprovalTaskRow | null; error: Error | null }> {
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration

      const payload: ApprovalTaskInsert = {
        document_type: input.document_type,
        document_id: input.document_id,
        document_no: input.document_no,
        requester_id: input.requester_id,
        approver_id: input.approver_id,
        step_order: input.step_order || 1,
        status: 'PENDING',
        security_token: this.generateSecurityToken(),
        token_expires_at: expiresAt.toISOString(),
      }

      const { data, error } = await (supabase.from('approval_tasks') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }

      // Write initial transition log
      await (supabase.from('workflow_transitions') as any).insert({
        task_id: data.id,
        from_status: 'DRAFT',
        to_status: 'PENDING',
        actor_id: input.requester_id,
        reason: 'Khởi tạo luồng phê duyệt',
      })

      return { data: data as ApprovalTaskRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async processDecision(
    taskId: string,
    approverId: string,
    decision: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<{ error: Error | null }> {
    try {
      // 1. Get task details
      const { data: rawTask, error: fetchErr } = await supabase
        .from('approval_tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (fetchErr || !rawTask) {
        return { error: new Error(fetchErr?.message || 'Task not found') }
      }

      const task = rawTask as unknown as ApprovalTaskRow
      const prevStatus = task.status

      // 2. Update task
      const { error: updateErr } = await (supabase.from('approval_tasks') as any)
        .update({
          status: decision,
          decision_notes: reason || (decision === 'APPROVED' ? 'Đã duyệt' : 'Từ chối duyệt'),
          decided_at: new Date().toISOString(),
          security_token: null, // Invalidate token to prevent replay
        })
        .eq('id', taskId)

      if (updateErr) return { error: new Error(updateErr.message) }

      // 3. Write transition audit log
      await (supabase.from('workflow_transitions') as any).insert({
        task_id: taskId,
        from_status: prevStatus,
        to_status: decision,
        actor_id: approverId,
        reason: reason || (decision === 'APPROVED' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'),
      })

      // 4. Update source document status
      if (task.document_type === 'GATE_PASS') {
        await (supabase.from('gate_passes') as any)
          .update({
            status: decision,
            approver_id: approverId,
            approved_at: new Date().toISOString(),
            manager_notes: reason || null,
          })
          .eq('id', task.document_id)
      } else if (task.document_type === 'ATTENDANCE_CONFIRMATION') {
        await (supabase.from('attendance_confirmations') as any)
          .update({
            status: decision,
            approver_id: approverId,
            approved_at: new Date().toISOString(),
            notes: reason || null,
          })
          .eq('id', task.document_id)
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async verifyAndExecuteTokenApproval(
    token: string,
    decision: 'APPROVED' | 'REJECTED',
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { data: rawTask, error } = await supabase
        .from('approval_tasks')
        .select('*')
        .eq('security_token', token)
        .single()

      if (error || !rawTask) {
        return { success: false, message: 'Mã phê duyệt không hợp lệ hoặc đã được sử dụng.' }
      }

      const task = rawTask as unknown as ApprovalTaskRow

      if (task.token_expires_at && new Date(task.token_expires_at) < new Date()) {
        return { success: false, message: 'Mã phê duyệt đã hết hạn hiệu lực.' }
      }

      if (task.status !== 'PENDING') {
        return { success: false, message: `Đơn này đã được xử lý ở trạng thái ${task.status}.` }
      }

      const res = await this.processDecision(task.id, task.approver_id, decision, notes)
      if (res.error) {
        return { success: false, message: res.error.message }
      }

      return {
        success: true,
        message: decision === 'APPROVED' ? 'Phê duyệt đơn thành công!' : 'Đã từ chối đơn.',
      }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    }
  },
}
