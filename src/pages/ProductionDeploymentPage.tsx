import { ProductionDeploymentHub } from '@/components/business/ProductionDeploymentHub'

export function ProductionDeploymentPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
          Trung Tâm Triển Khai Production (Go-Live &amp; Release)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý phát hành hệ thống chính thức, nghiệm thu UAT cho toàn bộ các luồng Supply Chain, hạ tầng Cloudflare Pages, Supabase RLS và cấu hình tên miền.
        </p>
      </div>

      {/* Production Deployment Hub */}
      <ProductionDeploymentHub />
    </div>
  )
}
