import { describe, expect, it, vi, beforeEach } from 'vitest'
import { leaveService } from './leave.service'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  }
})

describe('LeaveService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports leaveService object with required methods', () => {
    expect(leaveService).toBeDefined()
    expect(typeof leaveService.getLeaveTypes).toBe('function')
    expect(typeof leaveService.getLeaveBalances).toBe('function')
    expect(typeof leaveService.getAllLeaveBalances).toBe('function')
    expect(typeof leaveService.updateEntitlement).toBe('function')
  })

  describe('getLeaveTypes', () => {
    it('queries active leave types ordered by code', async () => {
      const mockLeaveTypes = [
        { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        { id: 'lt-2', code: 'SICK', name: 'Nghỉ ốm đau', is_paid: true, requires_attachment: true, created_at: '' },
      ]
      const mockOrder = vi.fn().mockResolvedValue({ data: mockLeaveTypes, error: null })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const res = await leaveService.getLeaveTypes()

      expect(supabase.from).toHaveBeenCalledWith('leave_types')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockOrder).toHaveBeenCalledWith('code')
      expect(res).toEqual({ data: mockLeaveTypes, error: null })
    })

    it('handles database query errors gracefully', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const res = await leaveService.getLeaveTypes()

      expect(res.data).toEqual([])
      expect(res.error).toBeInstanceOf(Error)
      expect(res.error?.message).toBe('Database error')
    })
  })

  describe('getLeaveBalances', () => {
    it('queries leave balances with joined leave_type for specific employee and year', async () => {
      const mockBalances = [
        {
          id: 'lb-1',
          employee_id: 'emp-1',
          year: 2026,
          leave_type_id: 'lt-1',
          total_days: 14,
          used_days: 2,
          pending_days: 1,
          remaining_days: 11,
          created_at: '',
          updated_at: '',
          leave_type: { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        },
      ]

      const mockEqYear = vi.fn().mockResolvedValue({ data: mockBalances, error: null })
      const mockEqEmp = vi.fn().mockReturnValue({ eq: mockEqYear })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqEmp })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const res = await leaveService.getLeaveBalances('emp-1', 2026)

      expect(supabase.from).toHaveBeenCalledWith('leave_balances')
      expect(mockSelect).toHaveBeenCalledWith('*, leave_type:leave_types(*)')
      expect(mockEqEmp).toHaveBeenCalledWith('employee_id', 'emp-1')
      expect(mockEqYear).toHaveBeenCalledWith('year', 2026)
      expect(res).toEqual({ data: mockBalances, error: null })
    })

    it('uses current year as default if year is not passed', async () => {
      const currentYear = new Date().getFullYear()
      const mockEqYear = vi.fn().mockResolvedValue({ data: [], error: null })
      const mockEqEmp = vi.fn().mockReturnValue({ eq: mockEqYear })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqEmp })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      await leaveService.getLeaveBalances('emp-1')

      expect(mockEqYear).toHaveBeenCalledWith('year', currentYear)
    })
  })

  describe('getAllLeaveBalances', () => {
    it('queries all leave balances for HR view with joined employee and leave_type', async () => {
      const mockBalances = [
        {
          id: 'lb-1',
          employee_id: 'emp-1',
          year: 2026,
          leave_type_id: 'lt-1',
          total_days: 12,
          used_days: 0,
          pending_days: 0,
          remaining_days: 12,
          created_at: '',
          updated_at: '',
          employee: { id: 'emp-1', full_name: 'Nguyen Van A', employee_code: 'LPVN-0001', department_id: 'd-1' },
          leave_type: { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        },
        {
          id: 'lb-2',
          employee_id: 'emp-2',
          year: 2026,
          leave_type_id: 'lt-1',
          total_days: 14,
          used_days: 3,
          pending_days: 0,
          remaining_days: 11,
          created_at: '',
          updated_at: '',
          employee: { id: 'emp-2', full_name: 'Tran Thi B', employee_code: 'LPVN-0002', department_id: 'd-2' },
          leave_type: { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        },
      ]

      const mockEqYear = vi.fn().mockResolvedValue({ data: mockBalances, error: null })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqYear })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const res = await leaveService.getAllLeaveBalances(2026)

      expect(supabase.from).toHaveBeenCalledWith('leave_balances')
      expect(mockSelect).toHaveBeenCalledWith(
        '*, leave_type:leave_types(*), employee:profiles(id, full_name, employee_code, department_id)'
      )
      expect(mockEqYear).toHaveBeenCalledWith('year', 2026)
      expect(res.data?.length).toBe(2)
    })

    it('filters leave balances when search string is provided', async () => {
      const mockBalances = [
        {
          id: 'lb-1',
          employee_id: 'emp-1',
          year: 2026,
          leave_type_id: 'lt-1',
          total_days: 12,
          used_days: 0,
          pending_days: 0,
          remaining_days: 12,
          created_at: '',
          updated_at: '',
          employee: { id: 'emp-1', full_name: 'Nguyen Van A', employee_code: 'LPVN-0001', department_id: 'd-1' },
          leave_type: { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        },
        {
          id: 'lb-2',
          employee_id: 'emp-2',
          year: 2026,
          leave_type_id: 'lt-1',
          total_days: 14,
          used_days: 3,
          pending_days: 0,
          remaining_days: 11,
          created_at: '',
          updated_at: '',
          employee: { id: 'emp-2', full_name: 'Tran Thi B', employee_code: 'LPVN-0002', department_id: 'd-2' },
          leave_type: { id: 'lt-1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
        },
      ]

      const mockEqYear = vi.fn().mockResolvedValue({ data: mockBalances, error: null })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqYear })
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const res = await leaveService.getAllLeaveBalances(2026, '0002')

      expect(res.data?.length).toBe(1)
      expect(res.data?.[0].employee?.employee_code).toBe('LPVN-0002')
    })
  })

  describe('updateEntitlement', () => {
    it('upserts leave_entitlements with total_days calculation', async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      vi.mocked(supabase.from).mockReturnValue({ upsert: mockUpsert } as any)

      const payload = {
        employee_id: 'emp-1',
        year: 2026,
        base_days: 12,
        seniority_days: 2,
        bonus_days: 1,
      }

      const res = await leaveService.updateEntitlement(payload)

      expect(supabase.from).toHaveBeenCalledWith('leave_entitlements')
      expect(mockUpsert).toHaveBeenCalledWith({
        employee_id: 'emp-1',
        year: 2026,
        base_days: 12,
        seniority_days: 2,
        bonus_days: 1,
        total_days: 15,
      })
      expect(res).toEqual({ error: null })
    })

    it('returns error if upsert fails', async () => {
      const mockUpsert = vi.fn().mockResolvedValue({ error: { message: 'Upsert failed' } })
      vi.mocked(supabase.from).mockReturnValue({ upsert: mockUpsert } as any)

      const payload = {
        employee_id: 'emp-1',
        year: 2026,
        base_days: 12,
        seniority_days: 0,
        bonus_days: 0,
      }

      const res = await leaveService.updateEntitlement(payload)

      expect(res.error).toBeInstanceOf(Error)
      expect(res.error?.message).toBe('Upsert failed')
    })
  })
})
