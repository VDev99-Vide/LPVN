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
          entra_object_id?: string | null
          azure_tenant_id?: string | null
          sso_provider?: string
          sso_metadata?: Record<string, any> | null
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
          entra_object_id?: string | null
          azure_tenant_id?: string | null
          sso_provider?: string
          sso_metadata?: Record<string, any> | null
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
          entra_object_id?: string | null
          azure_tenant_id?: string | null
          sso_provider?: string
          sso_metadata?: Record<string, any> | null
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
      gate_passes: {
        Row: {
          id: string
          document_no: string
          employee_id: string
          reason_type: 'BUSINESS' | 'PERSONAL_OR_RESIGNED'
          reason_details: string | null
          pass_date: string
          from_time: string
          to_time: string
          accompanied_items: string | null
          status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
          approver_id: string | null
          approved_at: string | null
          manager_notes: string | null
          security_out_time: string | null
          security_in_time: string | null
          security_guard_id: string | null
          security_guard_name: string | null
          security_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_no?: string
          employee_id: string
          reason_type: 'BUSINESS' | 'PERSONAL_OR_RESIGNED'
          reason_details?: string | null
          pass_date?: string
          from_time: string
          to_time: string
          accompanied_items?: string | null
          status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
          approver_id?: string | null
          approved_at?: string | null
          manager_notes?: string | null
          security_out_time?: string | null
          security_in_time?: string | null
          security_guard_id?: string | null
          security_guard_name?: string | null
          security_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_no?: string
          employee_id?: string
          reason_type?: 'BUSINESS' | 'PERSONAL_OR_RESIGNED'
          reason_details?: string | null
          pass_date?: string
          from_time?: string
          to_time?: string
          accompanied_items?: string | null
          status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
          approver_id?: string | null
          approved_at?: string | null
          manager_notes?: string | null
          security_out_time?: string | null
          security_in_time?: string | null
          security_guard_id?: string | null
          security_guard_name?: string | null
          security_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance_confirmations: {
        Row: {
          id: string
          document_no: string
          employee_id: string
          reason: string
          confirmation_date: string
          from_time: string
          to_time: string
          status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'HR_RECORDED' | 'CANCELLED'
          checker_id: string | null
          checked_at: string | null
          approver_id: string | null
          approved_at: string | null
          hr_admin_id: string | null
          hr_recorded_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_no?: string
          employee_id: string
          reason: string
          confirmation_date?: string
          from_time: string
          to_time: string
          status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'HR_RECORDED' | 'CANCELLED'
          checker_id?: string | null
          checked_at?: string | null
          approver_id?: string | null
          approved_at?: string | null
          hr_admin_id?: string | null
          hr_recorded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_no?: string
          employee_id?: string
          reason?: string
          confirmation_date?: string
          from_time?: string
          to_time?: string
          status?: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'HR_RECORDED' | 'CANCELLED'
          checker_id?: string | null
          checked_at?: string | null
          approver_id?: string | null
          approved_at?: string | null
          hr_admin_id?: string | null
          hr_recorded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      approval_tasks: {
        Row: {
          id: string
          document_type: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          document_id: string
          document_no: string
          requester_id: string
          approver_id: string
          step_order: number
          status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          decision_notes: string | null
          decided_at: string | null
          security_token: string | null
          token_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_type: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          document_id: string
          document_no: string
          requester_id: string
          approver_id: string
          step_order?: number
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          decision_notes?: string | null
          decided_at?: string | null
          security_token?: string | null
          token_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_type?: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          document_id?: string
          document_no?: string
          requester_id?: string
          approver_id?: string
          step_order?: number
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          decision_notes?: string | null
          decided_at?: string | null
          security_token?: string | null
          token_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflow_transitions: {
        Row: {
          id: string
          task_id: string
          from_status: string
          to_status: string
          actor_id: string | null
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          from_status: string
          to_status: string
          actor_id?: string | null
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          from_status?: string
          to_status?: string
          actor_id?: string | null
          reason?: string | null
          created_at?: string
        }
      }
      digital_signatures: {
        Row: {
          id: string
          user_id: string
          signature_type: 'ELECTRONIC_IMAGE' | 'CANVAS_DRAWN' | 'DIGITAL_CERTIFICATE'
          signature_url: string
          title: string | null
          is_default: boolean
          is_active: boolean
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          signature_type?: 'ELECTRONIC_IMAGE' | 'CANVAS_DRAWN' | 'DIGITAL_CERTIFICATE'
          signature_url: string
          title?: string | null
          is_default?: boolean
          is_active?: boolean
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          signature_type?: 'ELECTRONIC_IMAGE' | 'CANVAS_DRAWN' | 'DIGITAL_CERTIFICATE'
          signature_url?: string
          title?: string | null
          is_default?: boolean
          is_active?: boolean
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      signature_audit_logs: {
        Row: {
          id: string
          signature_id: string | null
          action: string
          performed_by: string | null
          document_id: string | null
          document_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          signature_id?: string | null
          action: string
          performed_by?: string | null
          document_id?: string | null
          document_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          signature_id?: string | null
          action?: string
          performed_by?: string | null
          document_id?: string | null
          document_type?: string | null
          created_at?: string
        }
      }
      document_templates: {
        Row: {
          id: string
          template_code: string
          title: string
          title_en: string
          current_version: string
          field_mappings: Record<string, any> | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_code: string
          title: string
          title_en: string
          current_version?: string
          field_mappings?: Record<string, any> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_code?: string
          title?: string
          title_en?: string
          current_version?: string
          field_mappings?: Record<string, any> | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      generated_documents: {
        Row: {
          id: string
          template_id: string | null
          document_no: string
          source_entity_type: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          source_entity_id: string
          rendered_data_snapshot: Record<string, any>
          document_hash: string
          file_url: string | null
          generated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          template_id?: string | null
          document_no: string
          source_entity_type: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          source_entity_id: string
          rendered_data_snapshot: Record<string, any>
          document_hash: string
          file_url?: string | null
          generated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string | null
          document_no?: string
          source_entity_type?: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
          source_entity_id?: string
          rendered_data_snapshot?: Record<string, any>
          document_hash?: string
          file_url?: string | null
          generated_by?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          event_type: 'REQUEST_SUBMITTED' | 'REQUEST_ASSIGNED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'DOCUMENT_GENERATED' | 'SYSTEM_ALERT'
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          read_at: string | null
          metadata: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          event_type: 'REQUEST_SUBMITTED' | 'REQUEST_ASSIGNED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'DOCUMENT_GENERATED' | 'SYSTEM_ALERT'
          title: string
          message: string
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          event_type?: 'REQUEST_SUBMITTED' | 'REQUEST_ASSIGNED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'DOCUMENT_GENERATED' | 'SYSTEM_ALERT'
          title?: string
          message?: string
          action_url?: string | null
          is_read?: boolean
          read_at?: string | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
      notification_queue: {
        Row: {
          id: string
          event_type: string
          channel: 'EMAIL' | 'IN_APP' | 'WEBHOOK'
          recipient_email: string
          subject: string
          body_html: string
          status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING'
          retry_count: number
          max_retries: number
          last_error: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          channel?: 'EMAIL' | 'IN_APP' | 'WEBHOOK'
          recipient_email: string
          subject: string
          body_html: string
          status?: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING'
          retry_count?: number
          max_retries?: number
          last_error?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          channel?: 'EMAIL' | 'IN_APP' | 'WEBHOOK'
          recipient_email?: string
          subject?: string
          body_html?: string
          status?: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING'
          retry_count?: number
          max_retries?: number
          last_error?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

