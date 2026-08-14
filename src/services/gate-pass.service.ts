import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type GatePassRow = Database['public']['Tables']['gate_passes']['Row']
export type GatePassInsert = Database['public']['Tables']['gate_passes']['Insert']

export interface GatePassWithRelations extends GatePassRow {
  employee?: {
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
}

export interface CreateGatePassInput {
  employee_id: string
  reason_type: 'BUSINESS' | 'PERSONAL_OR_RESIGNED'
  reason_details?: string
  pass_date?: string
  from_time: string
  to_time: string
  accompanied_items?: string
}

export const gatePassService = {
  async getGatePasses(params?: {
    employee_id?: string
    status?: string
    pass_date?: string
    search?: string
  }): Promise<{ data: GatePassWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('gate_passes')
        .select('*, employee:profiles!employee_id(id, full_name, employee_code, department_id), approver:profiles!approver_id(id, full_name, employee_code)')
        .order('created_at', { ascending: false })

      if (params?.employee_id) {
        query = query.eq('employee_id', params.employee_id)
      }
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.pass_date) {
        query = query.eq('pass_date', params.pass_date)
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }

      let filtered = (data as unknown as GatePassWithRelations[]) || []
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.employee?.full_name?.toLowerCase().includes(s) ||
            p.employee?.employee_code?.toLowerCase().includes(s) ||
            p.document_no?.toLowerCase().includes(s) ||
            p.reason_details?.toLowerCase().includes(s)
        )
      }

      return { data: filtered, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async createGatePass(
    input: CreateGatePassInput
  ): Promise<{ data: GatePassRow | null; error: Error | null }> {
    try {
      const payload: GatePassInsert = {
        employee_id: input.employee_id,
        reason_type: input.reason_type,
        reason_details: input.reason_details || null,
        pass_date: input.pass_date || new Date().toISOString().split('T')[0],
        from_time: input.from_time,
        to_time: input.to_time,
        accompanied_items: input.accompanied_items || null,
        status: 'PENDING_APPROVAL',
        document_no: 'LPVN-HR-F-0014',
      }

      const { data, error } = await (supabase.from('gate_passes') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as GatePassRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async approveGatePass(
    id: string,
    approver_id: string,
    manager_notes?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('gate_passes') as any)
        .update({
          status: 'APPROVED',
          approver_id,
          approved_at: new Date().toISOString(),
          manager_notes: manager_notes || 'Đã duyệt',
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async rejectGatePass(
    id: string,
    approver_id: string,
    manager_notes: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('gate_passes') as any)
        .update({
          status: 'REJECTED',
          approver_id,
          approved_at: new Date().toISOString(),
          manager_notes: manager_notes || 'Từ chối duyệt',
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async recordSecurityOut(
    id: string,
    guard_id: string,
    guard_name: string,
    security_notes?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('gate_passes') as any)
        .update({
          status: 'IN_TRANSIT',
          security_out_time: new Date().toISOString(),
          security_guard_id: guard_id,
          security_guard_name: guard_name,
          security_notes: security_notes || null,
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async recordSecurityIn(
    id: string,
    guard_id: string,
    guard_name: string,
    security_notes?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('gate_passes') as any)
        .update({
          status: 'COMPLETED',
          security_in_time: new Date().toISOString(),
          security_guard_id: guard_id,
          security_guard_name: guard_name,
          security_notes: security_notes || null,
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },
}
