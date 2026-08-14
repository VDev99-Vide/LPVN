import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, CheckCircle2, Zap, Lock } from 'lucide-react'

export function OutlookCompatibilityBadge() {
  return (
    <Card className="border shadow-xs bg-muted/20">
      <CardContent className="p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-foreground">Microsoft 365 Outlook Basic Mode</span>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 text-[10px]">
            Sẵn sàng hoạt động
          </Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 pt-1">
          <div className="flex items-start gap-2 p-2 rounded bg-card border">
            <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Zero Admin Dependency</div>
              <div className="text-[11px] text-muted-foreground">Không cần quyền Quản trị viên Microsoft 365 Tenant.</div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-card border">
            <Lock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Anti-Replay Token</div>
              <div className="text-[11px] text-muted-foreground">Token bảo mật 1 lần, tự hủy sau khi duyệt thành công.</div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-card border">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Tương Thích Đa Nền Tảng</div>
              <div className="text-[11px] text-muted-foreground">Hỗ trợ 100% Outlook Desktop, Web OWA và Di động.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
