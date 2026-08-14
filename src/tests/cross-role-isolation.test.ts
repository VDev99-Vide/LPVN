import { describe, expect, it } from 'vitest'
import { securityHardeningService } from '@/services/security-hardening.service'

describe('Cross-Role & Department Isolation', () => {
  it('strictly isolates Supply Chain from other departments for team leader approvals', () => {
    const supplyChainTL = {
      id: 'tl-sc-01',
      role: 'TEAM_LEADER' as const,
      dept: 'Phòng Supply Chain',
    }

    const accountingEmployeeRequest = {
      ownerId: 'emp-acc-01',
      ownerDept: 'Phòng Kế Toán',
    }

    const result = securityHardeningService.checkIDORAccess({
      userId: supplyChainTL.id,
      userRole: supplyChainTL.role,
      userDept: supplyChainTL.dept,
      resourceOwnerId: accountingEmployeeRequest.ownerId,
      resourceDept: accountingEmployeeRequest.ownerDept,
      action: 'APPROVE',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Department boundary mismatch')
  })

  it('prevents employee from self-approving their own request', () => {
    const employee = {
      id: 'emp-sc-01',
      role: 'EMPLOYEE' as const,
      dept: 'Phòng Supply Chain',
    }

    const result = securityHardeningService.checkIDORAccess({
      userId: employee.id,
      userRole: employee.role,
      userDept: employee.dept,
      resourceOwnerId: employee.id,
      resourceDept: employee.dept,
      action: 'APPROVE',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toMatch(/Self-approval is strictly forbidden/i)
  })

  it('allows Admin to administer across all department boundaries', () => {
    const admin = {
      id: 'admin-01',
      role: 'ADMIN' as const,
      dept: 'Ban Giám Đốc',
    }

    const result = securityHardeningService.checkIDORAccess({
      userId: admin.id,
      userRole: admin.role,
      userDept: admin.dept,
      resourceOwnerId: 'emp-hr-05',
      resourceDept: 'Phòng Nhân Sự',
      action: 'APPROVE',
    })

    expect(result.allowed).toBe(true)
  })
})
