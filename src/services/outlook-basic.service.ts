import { supabase } from '@/lib/supabase'
import { workflowService } from './workflow.service'
import type { ApprovalTaskWithRelations } from './workflow.service'

export interface DeepLinkValidationResult {
  isValid: boolean
  status: 'VALID' | 'EXPIRED' | 'INVALID_TOKEN' | 'UNAUTHORIZED' | 'ALREADY_PROCESSED'
  message: string
  task?: ApprovalTaskWithRelations | null
}

export const outlookBasicService = {
  generateSecureDeepLink(
    taskId: string,
    token: string,
    baseUrl: string = typeof window !== 'undefined' ? window.location.origin : 'https://lpvn.leggett.com'
  ): string {
    return `${baseUrl}/quick-approve?taskId=${encodeURIComponent(taskId)}&token=${encodeURIComponent(token)}`
  },

  async validateDeepLinkToken(
    taskId: string,
    token: string,
    currentUserId?: string
  ): Promise<DeepLinkValidationResult> {
    try {
      const { data: task, error } = await supabase
        .from('approval_tasks')
        .select('*, requester:profiles!requester_id(id, full_name, employee_code, department), approver:profiles!approver_id(id, full_name, employee_code)')
        .eq('id', taskId)
        .maybeSingle()

      if (error || !task) {
        return {
          isValid: false,
          status: 'INVALID_TOKEN',
          message: 'Không tìm thấy yêu cầu phê duyệt trên hệ thống.',
        }
      }

      const taskData = task as unknown as ApprovalTaskWithRelations

      if (taskData.status !== 'PENDING') {
        return {
          isValid: false,
          status: 'ALREADY_PROCESSED',
          message: `Yêu cầu này đã được xử lý (Trạng thái: ${taskData.status}).`,
          task: taskData,
        }
      }

      if (taskData.token_expires_at) {
        const expiresAt = new Date(taskData.token_expires_at).getTime()
        if (Date.now() > expiresAt) {
          return {
            isValid: false,
            status: 'EXPIRED',
            message: 'Mã token phê duyệt từ email đã hết hạn (quá thời hạn an toàn).',
            task: taskData,
          }
        }
      }

      if (taskData.security_token && taskData.security_token !== token) {
        return {
          isValid: false,
          status: 'INVALID_TOKEN',
          message: 'Mã xác thực bảo mật không hợp lệ hoặc đã được sử dụng trước đó.',
          task: taskData,
        }
      }

      if (currentUserId && taskData.approver_id && taskData.approver_id !== currentUserId) {
        return {
          isValid: false,
          status: 'UNAUTHORIZED',
          message: 'Tài khoản đăng nhập hiện tại không trùng khớp với Quản lý được chỉ định duyệt đơn này.',
          task: taskData,
        }
      }

      return {
        isValid: true,
        status: 'VALID',
        message: 'Mã token hợp lệ. Sẵn sàng xử lý phê duyệt.',
        task: taskData,
      }
    } catch (err) {
      return {
        isValid: false,
        status: 'INVALID_TOKEN',
        message: (err as Error).message,
      }
    }
  },

  async processQuickDecision(params: {
    taskId: string
    token: string
    decision: 'APPROVED' | 'REJECTED'
    notes?: string
    actorId: string
  }): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await workflowService.processDecision(
        params.taskId,
        params.actorId,
        params.decision,
        params.notes
      )

      if (error) return { success: false, error }

      // Nullify security token for anti-replay protection
      await (supabase.from('approval_tasks') as any)
        .update({ security_token: null })
        .eq('id', params.taskId)

      return { success: true, error: null }
    } catch (err) {
      return { success: false, error: err as Error }
    }
  },
}
