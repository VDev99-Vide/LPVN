import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type LeaveTypeRow = Database['public']['Tables']['leave_types']['Row']
export type LeaveEntitlementRow = Database['public']['Tables']['leave_entitlements']['Row']
export type LeaveBalanceRow = Database['public']['Tables']['leave_balances']['Row']

export interface LeaveBalanceWithRelations extends LeaveBalanceRow {
  leave_type?: LeaveTypeRow | null
  employee?: {
    id: string
    full_name: string
    employee_code: string
    department_id: string | null
  } | null
}

export interface UpdateEntitlementPayload {
  employee_id: string
  year: number
  base_days: number
  seniority_days: number
  bonus_days: number
}

export const leaveService = {
  async getLeaveTypes(): Promise<{ data: LeaveTypeRow[]; error: Error | null }> {
    try {
      const { data, error } = await supabase.from('leave_types').select('*').order('code')
      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as LeaveTypeRow[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getLeaveBalances(
    employeeId: string,
    year: number = new Date().getFullYear()
  ): Promise<{ data: LeaveBalanceWithRelations[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*, leave_type:leave_types(*)')
        .eq('employee_id', employeeId)
        .eq('year', year)

      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as LeaveBalanceWithRelations[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getAllLeaveBalances(
    year: number = new Date().getFullYear(),
    search?: string
  ): Promise<{ data: LeaveBalanceWithRelations[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*, leave_type:leave_types(*), employee:profiles(id, full_name, employee_code, department_id)')
        .eq('year', year)

      if (error) return { data: [], error: new Error(error.message) }

      let filtered = (data as unknown as LeaveBalanceWithRelations[]) || []
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(
          (b) =>
            b.employee?.full_name?.toLowerCase().includes(s) ||
            b.employee?.employee_code?.toLowerCase().includes(s)
        )
      }
      return { data: filtered, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async updateEntitlement(payload: UpdateEntitlementPayload): Promise<{ error: Error | null }> {
    try {
      const total_days = payload.base_days + payload.seniority_days + payload.bonus_days
      const { error } = await (supabase.from('leave_entitlements') as any).upsert({
        employee_id: payload.employee_id,
        year: payload.year,
        base_days: payload.base_days,
        seniority_days: payload.seniority_days,
        bonus_days: payload.bonus_days,
        total_days,
      })

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },
}
