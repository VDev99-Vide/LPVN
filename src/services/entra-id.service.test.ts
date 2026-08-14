import { describe, expect, it } from 'vitest'
import { entraIdService } from './entra-id.service'

describe('EntraIdService', () => {
  it('assesses tenant capability correctly with score and checks', () => {
    const assessment = entraIdService.assessTenantCapability({
      tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
      clientId: '9f8e7d6c-5b4a-3f2e-1d0c-ba9876543210',
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      domain: 'leggett.com',
      adminConsentGranted: true,
    })

    expect(assessment.isReady).toBe(true)
    expect(assessment.score).toBe(100)
    expect(assessment.checks).toHaveLength(5)
  })

  it('maps Azure AD Security Groups to LPVN Flow Roles hierarchy', () => {
    expect(entraIdService.mapEntraGroupsToRole(['LPVN_IT_Admins'])).toBe('ADMIN')
    expect(entraIdService.mapEntraGroupsToRole(['LPVN_HR_Managers'])).toBe('HR_MANAGER')
    expect(entraIdService.mapEntraGroupsToRole(['LPVN_Department_Heads'])).toBe('MANAGER')
    expect(entraIdService.mapEntraGroupsToRole(['LPVN_Security_Guards'])).toBe('SECURITY')
    expect(entraIdService.mapEntraGroupsToRole(['Unknown_Group'])).toBe('EMPLOYEE')
  })

  it('builds valid Microsoft 365 OAuth2 authorize URL', () => {
    const authUrl = entraIdService.buildSSOAuthUrl(
      {
        tenantId: 'my-tenant',
        clientId: 'my-client',
      },
      '/approvals'
    )

    expect(authUrl).toContain('https://login.microsoftonline.com/my-tenant/oauth2/v2.0/authorize')
    expect(authUrl).toContain('client_id=my-client')
    expect(authUrl).toContain('response_type=code')
  })
})
