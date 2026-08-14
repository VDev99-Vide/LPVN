import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Rocket, CheckCircle2, Globe, Zap, Server, Shield, CheckCheck } from 'lucide-react'

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
      {/* Overview Metric Glass Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-medium">Sẵn Sàng Go-Live</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            100%
          </div>
          <div className="text-[11px] font-semibold text-emerald-300">
            UAT Sign-off Completed
          </div>
        </div>

        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-medium">Hạ Tầng CDN &amp; Edge</span>
            <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            Cloudflare
          </div>
          <div className="text-[11px] font-semibold text-teal-300">
            Pages Edge Network
          </div>
        </div>

        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-medium">Cơ Sở Dữ Liệu</span>
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            PostgreSQL
          </div>
          <div className="text-[11px] font-semibold text-amber-300">
            Supabase Singapore
          </div>
        </div>

        <div className="glass-card p-5 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-medium">Mã Hóa &amp; Kênh Truyền</span>
            <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-sky-400">
            TLS 1.3
          </div>
          <div className="text-[11px] font-semibold text-sky-300">
            SSL End-to-End
          </div>
        </div>
      </div>

      {/* Deployment Trigger Banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#0066fe]/20 text-sky-300 border border-sky-400/30">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Trung Tâm Triển Khai Production (Cloudflare &amp; Supabase Release)
            </h3>
            <p className="text-xs text-white/60">
              {deployed
                ? '✓ Hệ thống đã được kiểm định nghiệm thu UAT 100% và sẵn sàng phát hành phiên bản chính thức.'
                : 'Toàn bộ 14 phases phát triển đã hoàn tất và kiểm thử hồi quy 100% thành công.'}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSimulateDeploy}
          disabled={isDeploying}
          className="text-xs h-10 px-5 font-bold rounded-2xl bg-[#0066fe] hover:bg-[#0056d6] text-white gap-2 shrink-0 shadow-[0_4px_16px_rgba(0,102,254,0.4)] cursor-pointer"
        >
          <Zap className="h-4 w-4" />
          <span>{isDeploying ? 'Đang Kiểm Tra Bản Build...' : 'Xác Nhận Nghiệm Thu (UAT Sign-off)'}</span>
        </Button>
      </div>

      {/* Production Milestones Table */}
      <div className="glass-card">
        <div className="card-header-glass pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="card-title-glass text-base font-bold">
                Danh Mục Hạng Mục Triển Khai (Go-Live Checklist)
              </div>
              <div className="card-subtitle-glass text-xs">
                Toàn bộ các tiêu chuẩn triển khai vận hành thực tế tại nhà máy Leggett &amp; Platt
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-xs uppercase font-bold text-white/70 w-20">Mã</TableHead>
                <TableHead className="text-xs uppercase font-bold text-white/70">Hạng Mục Triển Khai</TableHead>
                <TableHead className="text-xs uppercase font-bold text-white/70">Môi Trường / Đích Đến</TableHead>
                <TableHead className="text-xs uppercase font-bold text-center text-white/70">Trạng Thái</TableHead>
                <TableHead className="text-xs uppercase font-bold text-right text-white/70">Mức Độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROD_MILESTONES.map((m) => (
                <TableRow key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-white/50">{m.id}</TableCell>
                  <TableCell className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{m.title}</span>
                  </TableCell>
                  <TableCell className="text-xs text-white/70 font-mono">{m.target}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      ✓ {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold text-emerald-400">
                    {m.progress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
