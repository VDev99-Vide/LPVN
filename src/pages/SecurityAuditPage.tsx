import { SecurityScanTrigger } from '@/components/business/SecurityScanTrigger'
import { SecurityAuditDashboard } from '@/components/business/SecurityAuditDashboard'
import { TamperProofAuditViewer } from '@/components/business/TamperProofAuditViewer'

export function SecurityAuditPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
          Trung Tâm Kiểm Soát An Ninh (Security &amp; RLS Hardening)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
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
