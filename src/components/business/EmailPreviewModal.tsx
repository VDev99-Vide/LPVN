import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { emailTemplateService } from '@/services/email-template.service'
import { Mail, Monitor, Code } from 'lucide-react'

export interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailPreviewModal({ isOpen, onClose }: EmailPreviewModalProps) {
  const [templateType, setTemplateType] = useState<'APPROVAL' | 'DECISION' | 'DOCUMENT'>('APPROVAL')
  const [viewMode, setViewMode] = useState<'PREVIEW' | 'HTML'>('PREVIEW')

  const getEmailContent = () => {
    switch (templateType) {
      case 'APPROVAL':
        return emailTemplateService.renderApprovalRequestEmail({
          approverName: 'Nguyễn Quản Lý',
          requesterName: 'Trần Văn An',
          documentType: 'Đơn Xin Nghỉ Phép',
          documentNo: 'LPVN-HR-F-0013',
          summaryDetails: 'Nghỉ phép năm 2 ngày từ 20/08/2026 đến 21/08/2026',
          approvalUrl: 'https://lpvn.leggett.com/approvals/task-001',
        })
      case 'DECISION':
        return emailTemplateService.renderDecisionResultEmail({
          employeeName: 'Trần Văn An',
          documentType: 'Giấy Phép Ra Cổng',
          documentNo: 'LPVN-HR-F-0014',
          isApproved: true,
          notes: 'Đã duyệt cho phép ra cổng công vụ kiểm định mẫu.',
          documentUrl: 'https://lpvn.leggett.com/gate-pass',
        })
      case 'DOCUMENT':
        return emailTemplateService.renderDocumentReadyEmail({
          employeeName: 'Trần Văn An',
          documentType: 'Phiếu Xác Nhận Ngày Công',
          documentNo: 'LPVN-HR-F-0008',
          documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          downloadUrl: 'https://lpvn.leggett.com/documents',
        })
    }
  }

  const { subject, html } = getEmailContent()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <DialogTitle>Xem Trước Mẫu Email Microsoft Outlook</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Định dạng HTML responsive, bảng table-based và nút bấm bulletproof chuẩn hóa cho Outlook Desktop & Mobile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {/* Template Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={templateType === 'APPROVAL' ? 'default' : 'outline'}
                onClick={() => setTemplateType('APPROVAL')}
                className="h-7 text-xs"
              >
                1. Thông Báo Duyệt Đơn
              </Button>
              <Button
                size="sm"
                variant={templateType === 'DECISION' ? 'default' : 'outline'}
                onClick={() => setTemplateType('DECISION')}
                className="h-7 text-xs"
              >
                2. Kết Quả Xử Lý
              </Button>
              <Button
                size="sm"
                variant={templateType === 'DOCUMENT' ? 'default' : 'outline'}
                onClick={() => setTemplateType('DOCUMENT')}
                className="h-7 text-xs"
              >
                3. Xuất Bản ISO
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'PREVIEW' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('PREVIEW')}
                className="h-7 text-xs gap-1"
              >
                <Monitor className="h-3.5 w-3.5" />
                Giao diện
              </Button>
              <Button
                variant={viewMode === 'HTML' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('HTML')}
                className="h-7 text-xs gap-1"
              >
                <Code className="h-3.5 w-3.5" />
                Mã HTML
              </Button>
            </div>
          </div>

          {/* Email Subject Line */}
          <div className="p-2.5 bg-muted/40 rounded border flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Tiêu đề email:</span>
            <span className="font-medium text-foreground">{subject}</span>
            <Badge variant="outline" className="text-[10px] ml-auto">
              Outlook-Ready
            </Badge>
          </div>

          {/* Body Preview */}
          {viewMode === 'PREVIEW' ? (
            <div className="border rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 p-3">
              <div
                className="bg-white text-neutral-900 rounded shadow-xs p-2 max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          ) : (
            <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-md overflow-x-auto text-[11px] font-mono max-h-72">
              {html}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
