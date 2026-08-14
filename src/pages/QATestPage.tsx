import { QASuiteDashboard } from '@/components/business/QASuiteDashboard'

export function QATestPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
          Trung Tâm Kiểm Thử &amp; Chất Lượng (QA &amp; E2E Testing)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Giám sát và thực thi bộ kiểm thử tích hợp tự động, kịch bản Happy Path, xử lý từ chối, và độ bền bỉ Fallback hệ thống.
        </p>
      </div>

      {/* Visual QA Dashboard */}
      <QASuiteDashboard />
    </div>
  )
}
