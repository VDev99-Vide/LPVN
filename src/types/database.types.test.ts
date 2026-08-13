import { describe, expect, it } from 'vitest'
import type { Database } from './database.types'

describe('Database Types Phase 04', () => {
  it('includes leave tables in Database interface', () => {
    type LeaveTypeRow = Database['public']['Tables']['leave_types']['Row']
    type LeaveEntitlementRow = Database['public']['Tables']['leave_entitlements']['Row']
    type LeaveBalanceRow = Database['public']['Tables']['leave_balances']['Row']

    const mockLeaveType: LeaveTypeRow = {
      id: 'lt-1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      is_paid: true,
      requires_attachment: false,
      created_at: '2026-08-13T00:00:00Z',
    }

    const mockEntitlement: LeaveEntitlementRow = {
      id: 'le-1',
      employee_id: 'emp-1',
      year: 2026,
      base_days: 12,
      seniority_days: 1,
      bonus_days: 0,
      total_days: 13,
      created_at: '2026-08-13T00:00:00Z',
      updated_at: '2026-08-13T00:00:00Z',
    }

    const mockBalance: LeaveBalanceRow = {
      id: 'lb-1',
      employee_id: 'emp-1',
      year: 2026,
      leave_type_id: 'lt-1',
      total_days: 13,
      used_days: 2,
      pending_days: 1,
      remaining_days: 10,
      created_at: '2026-08-13T00:00:00Z',
      updated_at: '2026-08-13T00:00:00Z',
    }

    expect(mockLeaveType.code).toBe('ANNUAL')
    expect(mockEntitlement.total_days).toBe(13)
    expect(mockBalance.remaining_days).toBe(10)
  })
})
