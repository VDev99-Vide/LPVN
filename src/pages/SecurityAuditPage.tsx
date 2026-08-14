import { SecurityScanTrigger } from '@/components/business/SecurityScanTrigger'
import { SecurityAuditDashboard } from '@/components/business/SecurityAuditDashboard'
import { TamperProofAuditViewer } from '@/components/business/TamperProofAuditViewer'

export function SecurityAuditPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Trung Tâm Kiểm Soát An Ninh (Security &amp; RLS Hardening)</span>
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">
            OWASP Matrix
          </span>
        </h1>
        <p className="text-xs text-white/60 mt-0.5">
          Kiểm định toàn diện 8 lớp bảo mật OWASP, kiểm tra RLS ma trận, chống IDOR, ranh giới phòng Supply Chain và tính toàn vẹn chữ ký số.
        </p>
      </div>

      {/* Live Scanner Banner */}
      <SecurityScanTrigger />

      {/* Security Overview & Matrix */}
      <SecurityAuditDashboard />

      {/* Immutable Audit Logs Viewer */}
      <TamperProofAuditViewer />
    </div>
  )
}
