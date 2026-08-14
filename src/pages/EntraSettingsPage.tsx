import { EntraTenantAssessmentCard } from '@/components/business/EntraTenantAssessmentCard'
import { EntraGroupRoleMappingTable } from '@/components/business/EntraGroupRoleMappingTable'
import { KeyRound } from 'lucide-react'

export function EntraSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Tích Hợp Microsoft Entra ID (Azure AD SSO)
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Cấu hình Single Sign-On OIDC, đánh giá mức độ sẵn sàng của Tenant và đồng bộ nhóm bảo mật
        </p>
      </div>

      {/* Tenant Capability Assessment Card */}
      <EntraTenantAssessmentCard />

      {/* Group to Role Mapping Table */}
      <EntraGroupRoleMappingTable />
    </div>
  )
}
