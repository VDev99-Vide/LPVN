import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  outlookBasicService,
  type DeepLinkValidationResult,
} from '@/services/outlook-basic.service'
import { useAuth } from '@/hooks/useAuth'
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  FileCheck,
  XCircle,
  Loader2,
} from 'lucide-react'

export interface OutlookApprovalGateProps {
  taskId: string
  token: string
  onSuccess?: () => void
}

export function OutlookApprovalGate({
  taskId,
  token,
  onSuccess,
}: OutlookApprovalGateProps) {
  const { user } = useAuth()
  const [validation, setValidation] = useState<DeepLinkValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedDecision, setCompletedDecision] = useState<'APPROVED' | 'REJECTED' | null>(null)

  useEffect(() => {
    let isMounted = true
    const validate = async () => {
      setIsValidating(true)
      const res = await outlookBasicService.validateDeepLinkToken(
        taskId,
        token,
        user?.id
      )
      if (isMounted) {
        setValidation(res)
        setIsValidating(false)
      }
    }
    validate()
    return () => {
      isMounted = false
    }
  }, [taskId, token, user?.id])

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!user?.id) return
    setIsSubmitting(true)
    try {
      const res = await outlookBasicService.processQuickDecision({
        taskId,
        token,
        decision,
        notes,
        actorId: user.id,
      })

      if (res.success) {
        setCompletedDecision(decision)
        onSuccess?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isValidating) {
    return (
      <Card className="max-w-xl mx-auto border shadow-sm p-8 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <div className="text-sm font-semibold text-foreground">
          Đang thẩm định mã token bảo mật từ Email Outlook...
        </div>
        <div className="text-xs text-muted-foreground">
          Hệ thống đang kiểm tra danh tính và thời hạn hiệu lực của yêu cầu.
        </div>
      </Card>
    )
  }

  if (completedDecision) {
    return (
      <Card className="max-w-xl mx-auto border shadow-sm">
        <CardContent className="p-8 text-center space-y-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-foreground">
              {completedDecision === 'APPROVED' ? 'Đã Phê Duyệt Thành Công!' : 'Đã Từ Chối Yêu Cầu!'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quyết định của bạn đã được ghi nhận vào hệ thống, chữ ký số đã được tự động gắn vào biểu mẫu ISO và thông báo đã được gửi đến nhân viên.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <a href="/approvals">
              <Button size="sm" variant="outline" className="text-xs">
                Về Trung Tâm Duyệt
              </Button>
            </a>
            <a href="/documents">
              <Button size="sm" className="text-xs gap-1.5 bg-primary">
                <FileCheck className="h-3.5 w-3.5" />
                Xem Bản In Biểu Mẫu ISO
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!validation?.isValid) {
    return (
      <Card className="max-w-xl mx-auto border-destructive/30 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="p-2 bg-destructive/10 text-destructive rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-base font-bold text-destructive">
            Không Thể Xử Lý Phê Duyệt
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {validation?.message || 'Yêu cầu không hợp lệ.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-4 flex justify-center">
          <a href="/approvals">
            <Button size="sm" variant="outline" className="text-xs">
              Mở Hộp Thư Trung Tâm Duyệt LPVN
            </Button>
          </a>
        </CardFooter>
      </Card>
    )
  }

  const task = validation.task

  return (
    <Card className="max-w-2xl mx-auto border shadow-sm">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Xác Thực Phê Duyệt Nhanh (Outlook Gate)</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
            Token Hợp Lệ
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Bạn đang xem xét yêu cầu phê duyệt thông qua liên kết an toàn từ Microsoft 365 Outlook
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Request Summary Card */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-muted/40 rounded-lg border">
          <div>
            <span className="text-muted-foreground">Mã Biểu Mẫu:</span>{' '}
            <span className="font-mono font-bold text-foreground">{task?.document_no}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Loại Đơn:</span>{' '}
            <Badge variant="outline" className="text-[10px] ml-1">
              {task?.document_type}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Người Gửi:</span>{' '}
            <span className="font-semibold text-foreground">{task?.requester?.full_name}</span>{' '}
            <span className="font-mono text-muted-foreground">({task?.requester?.employee_code})</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phòng Ban:</span>{' '}
            <span className="font-medium text-foreground">{task?.requester?.department_id || 'Nhà máy LPVN'}</span>
          </div>
        </div>

        {/* Security & Signer info */}
        <div className="p-3 rounded-lg border bg-card flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <div>
              <div className="font-semibold text-foreground">Người Duyệt: {user?.user_metadata?.full_name || 'Quản lý'}</div>
              <div className="text-[11px] text-muted-foreground">Chữ ký điện tử mặc định sẽ tự động đóng dấu khi bạn xác nhận.</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="h-3 w-3" /> 72h Expiry
          </div>
        </div>

        {/* Manager Decision Notes */}
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="quick_notes" className="text-xs font-semibold">
            Ý kiến hoặc lý do phê duyệt / từ chối (Tùy chọn)
          </Label>
          <Textarea
            id="quick_notes"
            placeholder="Nhập ghi chú cho nhân viên (VD: Đồng ý duyệt, chuyển giao công việc đầy đủ...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-xs min-h-[70px]"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t flex items-center justify-between bg-muted/10">
        <a href="/approvals" className="text-xs text-muted-foreground hover:underline">
          Hủy & Về danh sách
        </a>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleDecision('REJECTED')}
            disabled={isSubmitting}
            className="text-xs gap-1"
          >
            <XCircle className="h-3.5 w-3.5" />
            Từ Chối
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleDecision('APPROVED')}
            disabled={isSubmitting}
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Đồng Ý Duyệt Đơn
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
