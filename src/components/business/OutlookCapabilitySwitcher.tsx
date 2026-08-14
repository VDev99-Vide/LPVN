import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OutlookApprovalMode } from '@/services/outlook-advanced.service'
import { Zap, Link2, CheckCircle2, ArrowRightLeft } from 'lucide-react'

export interface OutlookCapabilitySwitcherProps {
  currentMode: OutlookApprovalMode
  onToggleMode: (newMode: OutlookApprovalMode) => void
}

export function OutlookCapabilitySwitcher({
  currentMode,
  onToggleMode,
}: OutlookCapabilitySwitcherProps) {
  const isAdvanced = currentMode === 'ADVANCED_ACTIONABLE'

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">
              Cơ Chế Phê Duyệt Outlook Tự Động (Capability Switcher)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Hệ thống tự động phát hiện và chuyển đổi giữa 2 chế độ phê duyệt tùy theo cấu hình Tenant của doanh nghiệp
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleMode(isAdvanced ? 'BASIC_DEEP_LINK' : 'ADVANCED_ACTIONABLE')}
          className="text-xs h-8 gap-1.5"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          Chuyển Sang {isAdvanced ? 'Basic Mode' : 'Advanced Mode'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-1 text-xs">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Mode 1: Basic Mode */}
          <div
            onClick={() => onToggleMode('BASIC_DEEP_LINK')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
              !isAdvanced
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Link2 className="h-4 w-4 text-amber-600" />
                <span>1. Outlook Basic Mode (Mặc định)</span>
              </div>
              {!isAdvanced && (
                <Badge className="text-[10px] bg-primary text-primary-foreground">
                  Đang hoạt động
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Vận hành 100% không phụ thuộc quyền Admin Microsoft 365. Email chứa nút bấm mở web với mã token bảo mật tự hủy sau khi duyệt.
            </p>
          </div>

          {/* Mode 2: Advanced Mode */}
          <div
            onClick={() => onToggleMode('ADVANCED_ACTIONABLE')}
            className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
              isAdvanced
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>2. Outlook Advanced Mode (Nâng cấp)</span>
              </div>
              {isAdvanced && (
                <Badge className="text-[10px] bg-emerald-600 text-white">
                  Đang hoạt động
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Trải nghiệm 1-click in-email Actionable Messages Adaptive Cards. Quản lý duyệt ngay trong email, không cần mở trình duyệt web.
            </p>
          </div>
        </div>

        <div className="p-2.5 bg-muted/40 rounded border flex items-center gap-2 text-[11px]">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Cơ chế tự động thích ứng (Adaptive Fallback):</strong> Nếu Outlook client không hỗ trợ Adaptive Card, hệ thống tự động hiển thị nút bấm Deep Link về web.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
