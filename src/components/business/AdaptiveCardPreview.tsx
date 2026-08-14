import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  outlookAdvancedService,
  type ActionableCardParams,
} from '@/services/outlook-advanced.service'
import { CheckCircle2, XCircle, ExternalLink, Code, Monitor, Sparkles } from 'lucide-react'

export interface AdaptiveCardPreviewProps {
  cardParams?: Partial<ActionableCardParams>
}

export function AdaptiveCardPreview({
  cardParams = {
    taskId: 'task-demo-001',
    documentType: 'Đơn Xin Nghỉ Phép',
    documentNo: 'LPVN-HR-F-0013',
    requesterName: 'Trần Văn An (LPVN-0001)',
    department: 'Phòng Kỹ Thuật & Sản Xuất',
    summaryDetails: 'Nghỉ phép năm 2 ngày từ 20/08/2026 đến 21/08/2026. Lý do: Giải quyết việc gia đình.',
    securityToken: 'sec-tok-123456',
    originatorId: 'lpvn-flow-originator-001',
  },
}: AdaptiveCardPreviewProps) {
  const [comment, setComment] = useState('')
  const [viewMode, setViewMode] = useState<'VISUAL' | 'JSON'>('VISUAL')
  const [submittedDecision, setSubmittedDecision] = useState<'APPROVED' | 'REJECTED' | null>(null)

  const fullParams: ActionableCardParams = {
    taskId: cardParams.taskId || 'task-demo-001',
    documentType: cardParams.documentType || 'Đơn Xin Nghỉ Phép',
    documentNo: cardParams.documentNo || 'LPVN-HR-F-0013',
    requesterName: cardParams.requesterName || 'Trần Văn An',
    department: cardParams.department || 'Nhà máy LPVN',
    summaryDetails: cardParams.summaryDetails || 'Chi tiết yêu cầu phê duyệt',
    securityToken: cardParams.securityToken || 'sec-tok-123',
    originatorId: cardParams.originatorId || 'lpvn-flow-originator-001',
  }

  const payload = outlookAdvancedService.generateAdaptiveCard(fullParams)

  const handleAction = (decision: 'APPROVED' | 'REJECTED') => {
    setSubmittedDecision(decision)
  }

  const handleReset = () => {
    setSubmittedDecision(null)
    setComment('')
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">
              Trình Mô Phỏng Actionable Message Adaptive Card (Outlook v1.4)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Trải nghiệm phê duyệt trực tiếp 1-click ngay trong khung thư Outlook mà không cần mở trình duyệt
          </CardDescription>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={viewMode === 'VISUAL' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('VISUAL')}
            className="h-7 text-xs gap-1"
          >
            <Monitor className="h-3.5 w-3.5" />
            Mô Phỏng Giao Diện
          </Button>
          <Button
            variant={viewMode === 'JSON' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('JSON')}
            className="h-7 text-xs gap-1"
          >
            <Code className="h-3.5 w-3.5" />
            Payload JSON
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {viewMode === 'VISUAL' ? (
          <div className="max-w-xl mx-auto border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            {/* Outlook Email Bar Simulation */}
            <div className="bg-neutral-100 dark:bg-neutral-800/80 px-4 py-2.5 border-b flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Microsoft Outlook</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                  Actionable Message Active
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">Schema v1.4</span>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-4 text-xs">
              {submittedDecision ? (
                <div className="py-4 space-y-3 text-center">
                  <div className={`inline-flex p-3 rounded-full ${submittedDecision === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'}`}>
                    {submittedDecision === 'APPROVED' ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-foreground">
                      {submittedDecision === 'APPROVED' ? '✅ ĐÃ PHÊ DUYỆT THÀNH CÔNG' : '❌ ĐÃ TỪ CHỐI YÊU CẦU'}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">
                      {submittedDecision === 'APPROVED'
                        ? 'Thao tác HTTP Action đã được gửi đến LPVN Backend. Trạng thái đơn đã cập nhật và chữ ký số đã được áp dụng.'
                        : 'Yêu cầu đã bị từ chối thành công.'}
                    </p>
                    {comment && (
                      <div className="p-2 rounded bg-muted/40 border text-[11px] text-muted-foreground max-w-sm mx-auto mt-2">
                        <strong>Ghi chú:</strong> {comment}
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs h-7">
                      Thử lại mô phỏng
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-teal-800 dark:text-teal-400 tracking-tight">
                      LPVN HR FLOW — YÊU CẦU PHÊ DUYỆT TRỰC TIẾP
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Yêu cầu cần Quản lý xem xét và xác nhận quyết định ngay trong email.
                    </div>
                  </div>

                  {/* FactSet Table */}
                  <div className="divide-y rounded-lg border bg-neutral-50 dark:bg-neutral-800/40 p-1">
                    <div className="p-2 grid grid-cols-3">
                      <span className="font-medium text-muted-foreground">Loại Biểu Mẫu:</span>
                      <span className="col-span-2 font-semibold text-foreground">{fullParams.documentType} ({fullParams.documentNo})</span>
                    </div>
                    <div className="p-2 grid grid-cols-3">
                      <span className="font-medium text-muted-foreground">Người Yêu Cầu:</span>
                      <span className="col-span-2 font-medium text-foreground">{fullParams.requesterName}</span>
                    </div>
                    <div className="p-2 grid grid-cols-3">
                      <span className="font-medium text-muted-foreground">Phòng Ban:</span>
                      <span className="col-span-2 text-foreground">{fullParams.department}</span>
                    </div>
                    <div className="p-2 grid grid-cols-3">
                      <span className="font-medium text-muted-foreground">Nội Dung Tóm Tắt:</span>
                      <span className="col-span-2 text-foreground leading-relaxed">{fullParams.summaryDetails}</span>
                    </div>
                  </div>

                  {/* In-Email Input */}
                  <div className="space-y-1.5 pt-1">
                    <Textarea
                      placeholder="Nhập ghi chú hoặc lý do phê duyệt / từ chối (tùy chọn)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-xs min-h-[60px] bg-background"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction('APPROVED')}
                        className="text-xs h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Chấp Nhận Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction('REJECTED')}
                        className="text-xs h-8 gap-1 font-semibold"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Từ Chối
                      </Button>
                    </div>

                    <a href={`/quick-approve?taskId=${fullParams.taskId}&token=${fullParams.securityToken}`}>
                      <Button size="sm" variant="ghost" className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Xem Chi Tiết Trên Web
                      </Button>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg overflow-x-auto text-xs font-mono max-h-96">
            {JSON.stringify(payload, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
