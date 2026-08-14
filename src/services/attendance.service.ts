import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type AttendanceConfirmationRow =
  Database['public']['Tables']['attendance_confirmations']['Row']
export type AttendanceConfirmationInsert =
  Database['public']['Tables']['attendance_confirmations']['Insert']

export interface AttendanceWithRelations extends AttendanceConfirmationRow {
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
  checker?: {
    id: string
    full_name: string
  } | null
}

export interface CreateAttendanceInput {
  employee_id: string
  reason: string
  confirmation_date: string
  from_time: string
  to_time: string
  checker_id?: string
}

export const attendanceService = {
  async getAttendanceConfirmations(params?: {
    employee_id?: string
    status?: string
    confirmation_date?: string
    search?: string
  }): Promise<{ data: AttendanceWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('attendance_confirmations')
        .select('*, employee:profiles!employee_id(id, full_name, employee_code, department_id), approver:profiles!approver_id(id, full_name, employee_code), checker:profiles!checker_id(id, full_name)')
        .order('created_at', { ascending: false })

      if (params?.employee_id) {
        query = query.eq('employee_id', params.employee_id)
      }
      if (params?.status) {
        query = query.eq('status', params.status)
      }
      if (params?.confirmation_date) {
        query = query.eq('confirmation_date', params.confirmation_date)
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }

      let filtered = (data as unknown as AttendanceWithRelations[]) || []
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.employee?.full_name?.toLowerCase().includes(s) ||
            p.employee?.employee_code?.toLowerCase().includes(s) ||
            p.reason?.toLowerCase().includes(s) ||
            p.document_no?.toLowerCase().includes(s)
        )
      }

      return { data: filtered, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async createAttendanceConfirmation(
    input: CreateAttendanceInput
  ): Promise<{ data: AttendanceConfirmationRow | null; error: Error | null }> {
    try {
      const payload: AttendanceConfirmationInsert = {
        employee_id: input.employee_id,
        reason: input.reason,
        confirmation_date: input.confirmation_date,
        from_time: input.from_time,
        to_time: input.to_time,
        checker_id: input.checker_id || null,
        status: 'PENDING_APPROVAL',
        document_no: 'LPVN-HR-F-0008',
      }

      const { data, error } = await (supabase.from('attendance_confirmations') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as AttendanceConfirmationRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async approveAttendanceConfirmation(
    id: string,
    approver_id: string,
    notes?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('attendance_confirmations') as any)
        .update({
          status: 'APPROVED',
          approver_id,
          approved_at: new Date().toISOString(),
          notes: notes || 'Đã duyệt ngày công',
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async rejectAttendanceConfirmation(
    id: string,
    approver_id: string,
    notes: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('attendance_confirmations') as any)
        .update({
          status: 'REJECTED',
          approver_id,
          approved_at: new Date().toISOString(),
          notes: notes || 'Từ chối duyệt',
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async recordAttendanceByHR(
    id: string,
    hr_admin_id: string,
    notes?: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('attendance_confirmations') as any)
        .update({
          status: 'HR_RECORDED',
          hr_admin_id,
          hr_recorded_at: new Date().toISOString(),
          notes: notes || 'HR đã ghi nhận chấm công',
        })
        .eq('id', id)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },
}
