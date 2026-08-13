export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string
          code: string
          name: string
          parent_id: string | null
          department_head_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          parent_id?: string | null
          department_head_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          parent_id?: string | null
          department_head_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          code: string
          title: string
          level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          level?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          employee_code: string
          full_name: string
          email: string
          avatar_url: string | null
          department_id: string | null
          position_id: string | null
          status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_code: string
          full_name: string
          email: string
          avatar_url?: string | null
          department_id?: string | null
          position_id?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_code?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          department_id?: string | null
          position_id?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      manager_assignments: {
        Row: {
          id: string
          employee_id: string
          manager_id: string
          is_primary: boolean
          effective_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          manager_id: string
          is_primary?: boolean
          effective_date?: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          manager_id?: string
          is_primary?: boolean
          effective_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          code: string
          name: string
          module: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          module: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          module?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          role_id: string
          permission_id: string
        }
        Insert: {
          role_id: string
          permission_id: string
        }
        Update: {
          role_id?: string
          permission_id?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role_id: string
          assigned_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          assigned_at?: string
        }
        Update: {
          user_id?: string
          role_id?: string
          assigned_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: string
          old_data: Json | null
          new_data: Json | null
          actor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
          created_at?: string
        }
      }
      leave_types: {
        Row: {
          id: string
          code: string
          name: string
          is_paid: boolean
          requires_attachment: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          is_paid?: boolean
          requires_attachment?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          is_paid?: boolean
          requires_attachment?: boolean
          created_at?: string
        }
      }
      leave_entitlements: {
        Row: {
          id: string
          employee_id: string
          year: number
          base_days: number
          seniority_days: number
          bonus_days: number
          total_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          year?: number
          base_days?: number
          seniority_days?: number
          bonus_days?: number
          total_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          year?: number
          base_days?: number
          seniority_days?: number
          bonus_days?: number
          total_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      leave_balances: {
        Row: {
          id: string
          employee_id: string
          year: number
          leave_type_id: string
          total_days: number
          used_days: number
          pending_days: number
          remaining_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          year?: number
          leave_type_id: string
          total_days?: number
          used_days?: number
          pending_days?: number
          remaining_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          year?: number
          leave_type_id?: string
          total_days?: number
          used_days?: number
          pending_days?: number
          remaining_days?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

