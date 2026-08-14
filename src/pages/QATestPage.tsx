import { QASuiteDashboard } from '@/components/business/QASuiteDashboard'

export function QATestPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Trung Tâm Kiểm Thử &amp; Chất Lượng (QA &amp; E2E Testing)</span>
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full">
            E2E Suite
          </span>
        </h1>
        <p className="text-xs text-white/60 mt-0.5">
          Giám sát và thực thi bộ kiểm thử tích hợp tự động, kịch bản Happy Path, xử lý từ chối, và độ bền bỉ Fallback hệ thống.
        </p>
      </div>

      {/* Visual QA Dashboard */}
      <QASuiteDashboard />
    </div>
  )
}
