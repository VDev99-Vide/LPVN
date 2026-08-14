import { afterEach, describe, expect, it, vi } from 'vitest'
import { approvalDocumentPipelineService } from '@/services/approval-document-pipeline.service'
import { securityHardeningService } from '@/services/security-hardening.service'
import { signatureService } from '@/services/signature.service'
import { documentService } from '@/services/document.service'
import { notificationService } from '@/services/notification.service'
import { supabase } from '@/lib/supabase'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('E2E Happy Path Workflow', () => {
  it('executes full employee request to manager approval and ISO document generation', async () => {
    // Mock external service calls
    vi.spyOn(signatureService, 'getDefaultSignature').mockResolvedValue({
      data: {
        id: 'sig-01',
        user_id: 'tl-sc-002',
        signature_url: 'https://storage.lpvn.leggett.com/signatures/tl-sc-002.png',
        signature_type: 'CANVAS_DRAWN',
        title: 'Chữ ký chính',
        is_default: true,
        is_active: true,
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    })

    vi.spyOn(documentService, 'computeSHA256').mockResolvedValue(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    )

    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'doc-auto-001', document_no: 'LPVN-HR-F-0013' },
            error: null,
          }),
        }),
      }),
    } as any)

    vi.spyOn(notificationService, 'sendInAppNotification').mockResolvedValue({
      data: { id: 'notif-01' } as any,
      error: null,
    })

    vi.spyOn(notificationService, 'enqueueEmail').mockResolvedValue({
      data: { id: 'email-01' } as any,
      error: null,
    })

    // 1. Employee creates a leave request
    const employee = {
      id: 'emp-sc-001',
      name: 'Nguyễn Văn A',
      code: 'LPVN-0231',
      dept: 'Phòng Supply Chain',
      role: 'EMPLOYEE' as const,
      leaveBalance: 10,
    }

    const leaveRequest = {
      requestId: 'LV-2026-0814',
      employeeId: employee.id,
      employeeName: employee.name,
      employeeCode: employee.code,
      department: employee.dept,
      formCode: 'LPVN-HR-F-0013' as const,
      documentTitle: 'Đơn Xin Nghỉ Phép (Supply Chain)',
      leaveType: 'ANNUAL_LEAVE',
      days: 2,
      startDate: '2026-08-15',
      endDate: '2026-08-16',
      reason: 'Giải quyết công việc gia đình',
      medicalAttachmentUrl: undefined,
    }

    expect(employee.leaveBalance - leaveRequest.days).toBe(8)

    // 2. Security Check: Employee can access their own request
    const accessCheck = securityHardeningService.checkIDORAccess({
      userId: employee.id,
      userRole: employee.role,
      userDept: employee.dept,
      resourceOwnerId: leaveRequest.employeeId,
      resourceDept: leaveRequest.department,
      action: 'READ',
    })
    expect(accessCheck.allowed).toBe(true)

    // 3. Team Leader Approves Request
    const approver = {
      id: 'tl-sc-002',
      name: 'Lê Văn C',
      role: 'TEAM_LEADER' as const,
      dept: 'Phòng Supply Chain',
    }

    const approverAccess = securityHardeningService.checkIDORAccess({
      userId: approver.id,
      userRole: approver.role,
      userDept: approver.dept,
      resourceOwnerId: leaveRequest.employeeId,
      resourceDept: leaveRequest.department,
      action: 'APPROVE',
    })
    expect(approverAccess.allowed).toBe(true)

    // 4. Trigger End-to-End Approval Pipeline
    const pipelineResult = await approvalDocumentPipelineService.runPipeline({
      taskId: 'task-e2e-01',
      sourceEntityType: 'LEAVE',
      sourceEntityId: leaveRequest.requestId,
      approverId: approver.id,
      requesterId: employee.id,
      employeeName: employee.name,
      employeeEmail: 'nhanvien.a@leggett.com',
      documentData: {
        document_no: 'LPVN-HR-F-0013',
        full_name: employee.name,
        employee_code: employee.code,
        department: employee.dept,
        leave_type: leaveRequest.leaveType,
        days: leaveRequest.days,
        reason: leaveRequest.reason,
      },
    })

    // 5. Assertions on generated ISO document
    expect(pipelineResult.success).toBe(true)
    expect(pipelineResult.documentNo).toBe('LPVN-HR-F-0013')
    expect(pipelineResult.steps.length).toBeGreaterThan(0)
    expect(pipelineResult.steps.every((s) => s.status === 'COMPLETED')).toBe(true)
  })
})
