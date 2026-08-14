import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Rocket, CheckCircle2, Globe, Zap } from 'lucide-react'

const PROD_MILESTONES = [
  { id: 'M-01', title: 'Cơ Sở Dữ Liệu & RLS', target: 'Supabase PostgreSQL (Singapore)', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-02', title: 'Bảo Vệ An Ninh & IDOR', target: 'OWASP 8 Controls + HMAC-256', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-03', title: 'Quy Trình Supply Chain', target: '3 Biểu Mẫu ISO + Ký Số Canvas', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-04', title: 'Email & Actionable Cards', target: 'Outlook In-Email Approval & Fallback', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-05', title: 'Đăng Nhập Tập Trung', target: 'Microsoft 365 Entra ID SSO', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-06', title: 'Lưu Trữ Bất Biến', target: 'Cloudflare R2 Storage (PDF Snapshot)', status: 'SẴN SÀNG', progress: '100%' },
  { id: 'M-07', title: 'Tên Miền & CDN Edge', target: 'https://lpvn.leggett.com (Cloudflare)', status: 'SẴN SÀNG', progress: '100%' },
]

export function ProductionDeploymentHub() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)

  const handleSimulateDeploy = () => {
    setIsDeploying(true)
    setTimeout(() => {
      setIsDeploying(false)
      setDeployed(true)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-2xl p-5 shadow-xs border border-border border-l-6 border-l-[#27AE60] space-y-1">
          <div className="text-3xl font-extrabold text-[#27AE60]">
            100%
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Mức Độ Sẵn Sàng Go-Live (Readiness)
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-xs border border-border border-l-6 border-l-[#3CC4BD] space-y-1">
          <div className="text-3xl font-extrabold text-[#1E8C86] dark:text-[#3CC4BD]">
            Cloudflare
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Hạ Tầng Edge CDN &amp; Pages
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-xs border border-border border-l-6 border-l-[#FFD23F] space-y-1">
          <div className="text-3xl font-extrabold text-[#8A6300] dark:text-amber-300">
            PostgreSQL
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Cơ Sở Dữ Liệu Supabase RLS
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-xs border border-border border-l-6 border-l-[#5DADE2] space-y-1">
          <div className="text-3xl font-extrabold text-[#5DADE2]">
            TLS 1.3
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Bảo Mật Kênh Truyền Dẫn SSL
          </div>
        </div>
      </div>

      {/* Deployment Trigger Banner */}
      <Card className="rounded-2xl border shadow-xs bg-[#E8F6F5]/50 dark:bg-muted/30">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2BA8A2] text-white shadow-xs">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Trung Tâm Triển Khai Production (Cloudflare &amp; Supabase Release)
              </h3>
              <p className="text-xs text-muted-foreground">
                {deployed
                  ? '✓ Hệ thống đã được kiểm định nghiệm thu UAT 100% và sẵn sàng phát hành phiên bản chính thức.'
                  : 'Toàn bộ 14 phases phát triển đã hoàn tất và kiểm thử hồi quy 100% thành công.'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSimulateDeploy}
            disabled={isDeploying}
            className="text-xs h-10 px-5 font-bold rounded-full btn-gold gap-2 shrink-0"
          >
            <Zap className="h-4 w-4" />
            <span>{isDeploying ? 'Đang Kiểm Tra Bản Build...' : 'Xác Nhận Nghiệm Thu (UAT Sign-off)'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Production Milestones */}
      <Card className="rounded-2xl shadow-xs border">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8F6F5] text-[#1E8C86] dark:bg-teal-950/60 dark:text-teal-300">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Danh Mục Hạng Mục Triển Khai (Go-Live Checklist)
              </CardTitle>
              <CardDescription className="text-xs">
                Toàn bộ các tiêu chuẩn triển khai vận hành thực tế tại nhà máy Leggett &amp; Platt
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-dashed">
                <TableHead className="text-xs uppercase font-bold w-20">Mã</TableHead>
                <TableHead className="text-xs uppercase font-bold">Hạng Mục Triển Khai</TableHead>
                <TableHead className="text-xs uppercase font-bold">Môi Trường / Đích Đến</TableHead>
                <TableHead className="text-xs uppercase font-bold text-center">Trạng Thái</TableHead>
                <TableHead className="text-xs uppercase font-bold text-right">Mức Độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROD_MILESTONES.map((m) => (
                <TableRow key={m.id} className="hover:bg-[#E8F6F5]/40 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground">{m.id}</TableCell>
                  <TableCell className="text-xs font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{m.title}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{m.target}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      ✓ {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold text-emerald-600">
                    {m.progress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
