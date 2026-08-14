import { describe, expect, it } from 'vitest'
import { outlookAdvancedService } from './outlook-advanced.service'

describe('OutlookAdvancedService', () => {
  it('detects ADVANCED_ACTIONABLE mode when originatorId is present', () => {
    const mode = outlookAdvancedService.detectOutlookCapability({
      isActionableEnabled: true,
      originatorId: 'valid-originator-id',
    })
    expect(mode).toBe('ADVANCED_ACTIONABLE')
  })

  it('falls back to BASIC_DEEP_LINK mode when originatorId is missing', () => {
    const mode = outlookAdvancedService.detectOutlookCapability({
      isActionableEnabled: false,
    })
    expect(mode).toBe('BASIC_DEEP_LINK')
  })

  it('generates Microsoft Actionable Message Adaptive Card JSON format', () => {
    const card = outlookAdvancedService.generateAdaptiveCard({
      taskId: 'task-999',
      documentType: 'Đơn Xin Nghỉ Phép',
      documentNo: 'LPVN-HR-F-0013',
      requesterName: 'Trần Văn An',
      department: 'Phòng Kỹ Thuật',
      summaryDetails: 'Nghỉ 2 ngày từ 20/08/2026',
      securityToken: 'sec-tok-999',
      originatorId: 'my-originator',
    })

    expect(card.type).toBe('AdaptiveCard')
    expect(card.version).toBe('1.4')
    expect(card.originator).toBe('my-originator')
    expect(card.actions).toHaveLength(3)
    expect(card.actions[0].title).toContain('Chấp Nhận Duyệt')
    expect(card.actions[1].title).toContain('Từ Chối')
    expect(card.actions[2].title).toContain('Xem Chi Tiết')
  })

  it('generates refreshed response card on successful decision', () => {
    const refreshed = outlookAdvancedService.generateRefreshedCard(
      'SUCCESS',
      'Đơn đã được phê duyệt thành công.',
      'APPROVED'
    )

    expect(refreshed.type).toBe('AdaptiveCard')
    expect(refreshed.body[0].items[0].text).toContain('ĐÃ PHÊ DUYỆT THÀNH CÔNG')
  })
})
