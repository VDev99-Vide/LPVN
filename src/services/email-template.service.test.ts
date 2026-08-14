import { describe, expect, it } from 'vitest'
import { emailTemplateService } from './email-template.service'

describe('EmailTemplateService', () => {
  it('renders approval request email with correct subject and table layout', () => {
    const result = emailTemplateService.renderApprovalRequestEmail({
      approverName: 'Nguyen Van Manager',
      requesterName: 'Tran Van An',
      documentType: 'Đơn Xin Nghỉ Phép',
      documentNo: 'LPVN-HR-F-0013',
      summaryDetails: 'Nghỉ 2 ngày từ 20/08/2026',
      approvalUrl: 'https://lpvn.app/approvals/task-123',
    })

    expect(result.subject).toContain('Yêu cầu phê duyệt Đơn Xin Nghỉ Phép')
    expect(result.html).toContain('Nguyen Van Manager')
    expect(result.html).toContain('LPVN-HR-F-0013')
    expect(result.html).toContain('https://lpvn.app/approvals/task-123')
  })

  it('renders decision result email with approved status', () => {
    const result = emailTemplateService.renderDecisionResultEmail({
      employeeName: 'Tran Van An',
      documentType: 'Giấy Phép Ra Cổng',
      documentNo: 'LPVN-HR-F-0014',
      isApproved: true,
      notes: 'Đồng ý cho ra cổng',
      documentUrl: 'https://lpvn.app/gate-pass',
    })

    expect(result.subject).toContain('ĐÃ ĐƯỢC PHÊ DUYỆT')
    expect(result.html).toContain('Đồng ý cho ra cổng')
  })
})
