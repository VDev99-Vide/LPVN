import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type DepartmentRow = Database['public']['Tables']['departments']['Row']
export type PositionRow = Database['public']['Tables']['positions']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface EmployeeWithRelations extends ProfileRow {
  department?: DepartmentRow | null
  position?: PositionRow | null
  manager?: {
    id: string
    full_name: string
    employee_code: string
  } | null
}

export interface EmployeeFilterParams {
  search?: string
  departmentId?: string
  status?: string
}

export const employeeService = {
  async getEmployees(params?: EmployeeFilterParams): Promise<{ data: EmployeeWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          department:departments(*),
          position:positions(*)
        `)

      if (params?.search) {
        const s = params.search
        query = query.or(`full_name.ilike.%${s}%,employee_code.ilike.%${s}%,email.ilike.%${s}%`)
      }

      if (params?.departmentId && params.departmentId !== 'ALL') {
        query = query.eq('department_id', params.departmentId)
      }

      if (params?.status && params.status !== 'ALL') {
        query = query.eq('status', params.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }

      return { data: (data as unknown as EmployeeWithRelations[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getEmployeeById(id: string): Promise<{ data: EmployeeWithRelations | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          department:departments(*),
          position:positions(*)
        `)
        .eq('id', id)
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as unknown as EmployeeWithRelations, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async createEmployee(payload: {
    employee_code: string
    full_name: string
    email: string
    department_id?: string | null
    position_id?: string | null
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    avatar_url?: string | null
    join_date?: string
  }): Promise<{ data: ProfileRow | null; error: Error | null }> {
    try {
      const id = crypto.randomUUID()
      const insertData: ProfileInsert = {
        id,
        employee_code: payload.employee_code,
        full_name: payload.full_name,
        email: payload.email,
        department_id: payload.department_id || null,
        position_id: payload.position_id || null,
        status: payload.status || 'ACTIVE',
        avatar_url: payload.avatar_url || null,
        join_date: payload.join_date || new Date().toISOString().split('T')[0],
      }
      const { data, error } = await (supabase.from('profiles') as any)
        .insert(insertData)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as ProfileRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async updateEmployee(
    id: string,
    payload: Partial<ProfileRow>
  ): Promise<{ data: ProfileRow | null; error: Error | null }> {
    try {
      const updateData: ProfileUpdate = payload
      const { data, error } = await (supabase.from('profiles') as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as ProfileRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async getOrgChartData(): Promise<{ departments: DepartmentRow[]; employees: EmployeeWithRelations[] }> {
    const { data: departments } = await supabase.from('departments').select('*')
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*, department:departments(*), position:positions(*)')

    return {
      departments: (departments as DepartmentRow[]) || [],
      employees: (profiles as unknown as EmployeeWithRelations[]) || [],
    }
  },
}
