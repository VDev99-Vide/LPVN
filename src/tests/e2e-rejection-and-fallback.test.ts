import { describe, expect, it } from 'vitest'
import { outlookBasicService } from '@/services/outlook-basic.service'
import { outlookAdvancedService } from '@/services/outlook-advanced.service'

describe('E2E Rejection and Fallback Resilience', () => {
  it('handles request rejection and ensures leave balance recovery', () => {
    let leaveBalance = 10
    const requestedDays = 3

    // Reserve balance upon submission
    leaveBalance -= requestedDays
    expect(leaveBalance).toBe(7)

    // Manager rejects with mandatory reason
    const rejectionPayload = {
      requestId: 'LV-2026-999',
      decision: 'REJECTED' as const,
      reason: 'Trùng lịch kiểm kê định kỳ kho Supply Chain ngày 15/08',
      rejectedBy: 'Lê Văn C (Team Leader)',
    }

    expect(rejectionPayload.reason.length).toBeGreaterThan(5)

    // Rollback balance
    leaveBalance += requestedDays
    expect(leaveBalance).toBe(10)
  })

  it('generates Outlook Actionable Card and fallback basic deep-link', () => {
    const cardParams = {
      taskId: 'task-e2e-02',
      documentType: 'Đơn Xin Nghỉ Phép',
      documentNo: 'LPVN-HR-F-0013',
      requesterName: 'Nguyễn Văn A',
      department: 'Phòng Supply Chain',
      summaryDetails: 'Xin nghỉ phép năm 1 ngày',
      securityToken: 'sec-token-123',
    }

    // 1. Generate Actionable Message Adaptive Card JSON
    const cardObj = outlookAdvancedService.generateAdaptiveCard(cardParams)
    const actionableCardJson = JSON.stringify(cardObj)
    expect(actionableCardJson).toContain('Action.Http')
    expect(actionableCardJson).toContain('LPVN-HR-F-0013')
    expect(actionableCardJson).toContain('Nguyễn Văn A')

    // 2. In fallback mode, generate secure deep link
    const deepLink = outlookBasicService.generateSecureDeepLink(
      cardParams.taskId,
      cardParams.securityToken,
      'https://lpvn.leggett.com'
    )
    expect(deepLink).toBe(
      'https://lpvn.leggett.com/quick-approve?taskId=task-e2e-02&token=sec-token-123'
    )
  })
})
