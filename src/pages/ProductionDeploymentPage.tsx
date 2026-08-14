import { ProductionDeploymentHub } from '@/components/business/ProductionDeploymentHub'

export function ProductionDeploymentPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Trung Tâm Triển Khai Production (Go-Live &amp; Release)</span>
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
            Cloudflare Pages
          </span>
        </h1>
        <p className="text-xs text-white/60 mt-0.5">
          Quản lý phát hành hệ thống chính thức, nghiệm thu UAT cho toàn bộ các luồng Supply Chain, hạ tầng Cloudflare Pages, Supabase RLS và cấu hình tên miền.
        </p>
      </div>

      {/* Production Deployment Hub */}
      <ProductionDeploymentHub />
    </div>
  )
}
