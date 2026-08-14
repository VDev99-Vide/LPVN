import { supabase } from '@/lib/supabase'

export interface EntraTenantConfig {
  tenantId: string
  clientId: string
  redirectUri: string
  scopes: string[]
  adminConsentGranted: boolean
  domain: string
}

export interface TenantAssessmentCheck {
  name: string
  passed: boolean
  details: string
}

export interface TenantAssessment {
  isReady: boolean
  score: number
  checks: TenantAssessmentCheck[]
}

export interface EntraUserProfile {
  id: string
  mail: string
  displayName: string
  jobTitle?: string
  department?: string
  groups: string[]
}

export interface RoleMappingRule {
  azureGroup: string
  lpvnRole: 'ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE' | 'SECURITY'
  description: string
}

export const DEFAULT_GROUP_MAPPINGS: RoleMappingRule[] = [
  {
    azureGroup: 'LPVN_IT_Admins',
    lpvnRole: 'ADMIN',
    description: 'Quản trị viên hệ thống & Thiết lập bảo mật',
  },
  {
    azureGroup: 'LPVN_HR_Managers',
    lpvnRole: 'HR_MANAGER',
    description: 'Trưởng phòng / Chuyên viên nhân sự',
  },
  {
    azureGroup: 'LPVN_Department_Heads',
    lpvnRole: 'MANAGER',
    description: 'Trưởng bộ phận & Quản lý duyệt đơn',
  },
  {
    azureGroup: 'LPVN_Security_Guards',
    lpvnRole: 'SECURITY',
    description: 'Nhân viên an ninh & Trạm kiểm soát cổng',
  },
  {
    azureGroup: 'LPVN_All_Employees',
    lpvnRole: 'EMPLOYEE',
    description: 'Toàn bộ nhân viên công ty',
  },
]

export const entraIdService = {
  assessTenantCapability(config: Partial<EntraTenantConfig>): TenantAssessment {
    const checks: TenantAssessmentCheck[] = [
      {
        name: 'Tenant ID Configuration',
        passed: Boolean(config.tenantId && config.tenantId.length >= 10),
        details: config.tenantId ? `Tenant: ${config.tenantId}` : 'Chưa nhập Microsoft 365 Tenant ID',
      },
      {
        name: 'Client App ID (App Registration)',
        passed: Boolean(config.clientId && config.clientId.length >= 10),
        details: config.clientId ? `Client: ${config.clientId}` : 'Chưa đăng ký App trong Entra Admin Center',
      },
      {
        name: 'OIDC Scopes (User.Read & GroupMember)',
        passed: Boolean(
          config.scopes &&
            config.scopes.includes('openid') &&
            config.scopes.includes('profile') &&
            config.scopes.includes('User.Read')
        ),
        details: 'Yêu cầu scopes: openid, profile, email, User.Read',
      },
      {
        name: 'Company Domain Match',
        passed: Boolean(config.domain?.endsWith('leggett.com') || config.domain?.includes('lpvn')),
        details: config.domain ? `Domain: ${config.domain}` : 'Tên miền doanh nghiệp Leggett & Platt',
      },
      {
        name: 'Admin Consent Status',
        passed: Boolean(config.adminConsentGranted),
        details: config.adminConsentGranted
          ? 'Đã được phê duyệt bởi Tenant Admin'
          : 'Chưa cấp Admin Consent cho quyền đọc Groups',
      },
    ]

    const passedCount = checks.filter((c) => c.passed).length
    const score = Math.round((passedCount / checks.length) * 100)
    const isReady = score >= 80

    return { isReady, score, checks }
  },

  mapEntraGroupsToRole(
    groups: string[],
    customMappings: RoleMappingRule[] = DEFAULT_GROUP_MAPPINGS
  ): 'ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE' | 'SECURITY' {
    for (const rule of customMappings) {
      if (groups.includes(rule.azureGroup)) {
        return rule.lpvnRole
      }
    }
    return 'EMPLOYEE'
  },

  buildSSOAuthUrl(config: Partial<EntraTenantConfig>, redirectPath: string = '/'): string {
    const tenantId = config.tenantId || 'common'
    const clientId = config.clientId || 'lpvn-app-client-id'
    const redirectUri =
      config.redirectUri ||
      (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'https://lpvn.leggett.com/auth/callback')
    const scopes = (config.scopes || ['openid', 'profile', 'email', 'User.Read']).join(' ')

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: scopes,
      state: encodeURIComponent(JSON.stringify({ redirectPath })),
    })

    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  },

  async syncEntraProfile(
    entraUser: EntraUserProfile
  ): Promise<{ profileId: string | null; role: string; error: Error | null }> {
    try {
      const assignedRole = this.mapEntraGroupsToRole(entraUser.groups)

      // Search existing profile by email or entra_object_id
      const { data: existingUser, error: findErr } = await supabase
        .from('profiles')
        .select('id, role:user_roles(role)')
        .or(`email.eq.${entraUser.mail},entra_object_id.eq.${entraUser.id}`)
        .maybeSingle()

      if (findErr) {
        return { profileId: null, role: assignedRole, error: new Error(findErr.message) }
      }

      if (existingUser) {
        const userObj = existingUser as { id: string }
        // Update Entra metadata
        await (supabase.from('profiles') as any)
          .update({
            entra_object_id: entraUser.id,
            sso_provider: 'AZURE_AD',
            sso_metadata: {
              upn: entraUser.mail,
              groups: entraUser.groups,
              last_sso_at: new Date().toISOString(),
            },
          })
          .eq('id', userObj.id)

        return { profileId: userObj.id, role: assignedRole, error: null }
      }

      return { profileId: null, role: assignedRole, error: null }
    } catch (err) {
      return { profileId: null, role: 'EMPLOYEE', error: err as Error }
    }
  },
}
