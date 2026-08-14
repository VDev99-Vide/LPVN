import { describe, expect, it } from 'vitest'
import type { Database } from './database.types'

describe('Database Types Phase 04', () => {
  it('includes leave tables in Database interface', () => {
    type LeaveTypeRow = Database['public']['Tables']['leave_types']['Row']
    type LeaveEntitlementRow = Database['public']['Tables']['leave_entitlements']['Row']
    type LeaveBalanceRow = Database['public']['Tables']['leave_balances']['Row']

    const mockLeaveType: LeaveTypeRow = {
      id: 'lt-1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      is_paid: true,
      requires_attachment: false,
      created_at: '2026-08-13T00:00:00Z',
    }

    const mockEntitlement: LeaveEntitlementRow = {
      id: 'le-1',
      employee_id: 'emp-1',
      year: 2026,
      base_days: 12,
      seniority_days: 1,
      bonus_days: 0,
      total_days: 13,
      created_at: '2026-08-13T00:00:00Z',
      updated_at: '2026-08-13T00:00:00Z',
    }

    const mockBalance: LeaveBalanceRow = {
      id: 'lb-1',
      employee_id: 'emp-1',
      year: 2026,
      leave_type_id: 'lt-1',
      total_days: 13,
      used_days: 2,
      pending_days: 1,
      remaining_days: 10,
      created_at: '2026-08-13T00:00:00Z',
      updated_at: '2026-08-13T00:00:00Z',
    }

    expect(mockLeaveType.code).toBe('ANNUAL')
    expect(mockEntitlement.total_days).toBe(13)
    expect(mockBalance.remaining_days).toBe(10)
  })

  it('includes gate_passes table in Database interface', () => {
    type GatePassRow = Database['public']['Tables']['gate_passes']['Row']
    const mockGatePass: GatePassRow = {
      id: 'gp-1',
      document_no: 'LPVN-HR-F-0014',
      employee_id: 'emp-1',
      reason_type: 'BUSINESS',
      reason_details: 'Gặp khách hàng tại VSIP 1',
      pass_date: '2026-08-14',
      from_time: '13:30',
      to_time: '16:30',
      accompanied_items: 'Laptop + Hồ sơ',
      status: 'APPROVED',
      approver_id: 'mgr-1',
      approved_at: '2026-08-14T01:00:00Z',
      manager_notes: 'Đã duyệt',
      security_out_time: null,
      security_in_time: null,
      security_guard_id: null,
      security_guard_name: null,
      security_notes: null,
      created_at: '2026-08-14T00:00:00Z',
      updated_at: '2026-08-14T00:00:00Z',
    }

    expect(mockGatePass.document_no).toBe('LPVN-HR-F-0014')
    expect(mockGatePass.status).toBe('APPROVED')
  })

  it('includes attendance_confirmations table in Database interface', () => {
    type AttendanceRow = Database['public']['Tables']['attendance_confirmations']['Row']
    const mockAttendance: AttendanceRow = {
      id: 'att-1',
      document_no: 'LPVN-HR-F-0008',
      employee_id: 'emp-1',
      reason: 'Quên quẹt thẻ lúc vào ca',
      confirmation_date: '2026-08-14',
      from_time: '08:00',
      to_time: '17:00',
      status: 'PENDING_APPROVAL',
      checker_id: null,
      checked_at: null,
      approver_id: null,
      approved_at: null,
      hr_admin_id: null,
      hr_recorded_at: null,
      notes: null,
      created_at: '2026-08-14T00:00:00Z',
      updated_at: '2026-08-14T00:00:00Z',
    }

    expect(mockAttendance.document_no).toBe('LPVN-HR-F-0008')
    expect(mockAttendance.status).toBe('PENDING_APPROVAL')
  })

  it('includes approval_tasks and workflow_transitions tables in Database interface', () => {
    type ApprovalTaskRow = Database['public']['Tables']['approval_tasks']['Row']
    type WorkflowTransitionRow = Database['public']['Tables']['workflow_transitions']['Row']

    const mockTask: ApprovalTaskRow = {
      id: 'task-1',
      document_type: 'LEAVE',
      document_id: 'leave-1',
      document_no: 'LPVN-HR-F-0013',
      requester_id: 'emp-1',
      approver_id: 'mgr-1',
      step_order: 1,
      status: 'PENDING',
      decision_notes: null,
      decided_at: null,
      security_token: 'token-abc-123',
      token_expires_at: '2026-08-20T00:00:00Z',
      created_at: '2026-08-14T00:00:00Z',
      updated_at: '2026-08-14T00:00:00Z',
    }

    const mockTransition: WorkflowTransitionRow = {
      id: 'trans-1',
      task_id: 'task-1',
      from_status: 'PENDING',
      to_status: 'APPROVED',
      actor_id: 'mgr-1',
      reason: 'Đồng ý duyệt',
      created_at: '2026-08-14T01:00:00Z',
    }

    expect(mockTask.document_type).toBe('LEAVE')
    expect(mockTask.status).toBe('PENDING')
    expect(mockTransition.to_status).toBe('APPROVED')
  })

  it('includes digital_signatures and signature_audit_logs tables in Database interface', () => {
    type DigitalSignatureRow = Database['public']['Tables']['digital_signatures']['Row']
    type SignatureAuditLogRow = Database['public']['Tables']['signature_audit_logs']['Row']

    const mockSig: DigitalSignatureRow = {
      id: 'sig-1',
      user_id: 'user-1',
      signature_type: 'CANVAS_DRAWN',
      signature_url: 'data:image/png;base64,mockpngdata',
      title: 'Chữ ký chính thức',
      is_default: true,
      is_active: true,
      metadata: { width: 300, height: 150 },
      created_at: '2026-08-14T00:00:00Z',
      updated_at: '2026-08-14T00:00:00Z',
    }

    const mockLog: SignatureAuditLogRow = {
      id: 'log-1',
      signature_id: 'sig-1',
      action: 'CREATED',
      performed_by: 'user-1',
      document_id: null,
      document_type: null,
      created_at: '2026-08-14T00:00:00Z',
    }

    expect(mockSig.signature_type).toBe('CANVAS_DRAWN')
    expect(mockSig.is_default).toBe(true)
    expect(mockLog.action).toBe('CREATED')
  })

  it('includes document_templates and generated_documents tables in Database interface', () => {
    type DocumentTemplateRow = Database['public']['Tables']['document_templates']['Row']
    type GeneratedDocumentRow = Database['public']['Tables']['generated_documents']['Row']

    const mockTemplate: DocumentTemplateRow = {
      id: 'dt-1',
      template_code: 'LPVN-HR-F-0013',
      title: 'Đơn Xin Nghỉ Phép',
      title_en: 'Leave Application',
      current_version: '1.0',
      field_mappings: {},
      is_active: true,
      created_at: '2026-08-14T00:00:00Z',
      updated_at: '2026-08-14T00:00:00Z',
    }

    const mockGenDoc: GeneratedDocumentRow = {
      id: 'gd-1',
      template_id: 'dt-1',
      document_no: 'LPVN-HR-F-0013',
      source_entity_type: 'LEAVE',
      source_entity_id: 'leave-1',
      rendered_data_snapshot: { full_name: 'Nguyen Van A' },
      document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      file_url: null,
      generated_by: 'user-1',
      created_at: '2026-08-14T00:00:00Z',
    }

    expect(mockTemplate.template_code).toBe('LPVN-HR-F-0013')
    expect(mockGenDoc.document_hash).toHaveLength(64)
  })

  it('includes notifications and notification_queue tables in Database interface', () => {
    type NotificationRow = Database['public']['Tables']['notifications']['Row']
    type NotificationQueueRow = Database['public']['Tables']['notification_queue']['Row']

    const mockNotif: NotificationRow = {
      id: 'notif-1',
      recipient_id: 'user-1',
      event_type: 'REQUEST_APPROVED',
      title: 'Đơn nghỉ phép đã được duyệt',
      message: 'Quản lý đã phê duyệt đơn nghỉ phép của bạn.',
      action_url: '/leave',
      is_read: false,
      read_at: null,
      metadata: { leave_days: 2 },
      created_at: '2026-08-14T00:00:00Z',
    }

    const mockQueue: NotificationQueueRow = {
      id: 'q-1',
      event_type: 'REQUEST_ASSIGNED',
      channel: 'EMAIL',
      recipient_email: 'manager@lpvn.com',
      subject: '[LPVN Flow] Yêu cầu phê duyệt đơn nghỉ phép',
      body_html: '<html><body>Please review</body></html>',
      status: 'PENDING',
      retry_count: 0,
      max_retries: 3,
      last_error: null,
      sent_at: null,
      created_at: '2026-08-14T00:00:00Z',
    }

    expect(mockNotif.event_type).toBe('REQUEST_APPROVED')
    expect(mockQueue.channel).toBe('EMAIL')
    expect(mockQueue.status).toBe('PENDING')
  })
})
