import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeaveManagementPage } from './LeaveManagementPage'
import { leaveService } from '@/services/leave.service'

vi.mock('@/services/leave.service', () => ({
  leaveService: {
    getLeaveBalances: vi.fn(),
    getAllLeaveBalances: vi.fn(),
    updateEntitlement: vi.fn(),
  },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}))

const mockPersonalBalances = [
  {
    id: 'bal-1',
    employee_id: 'emp-1',
    year: 2026,
    leave_type_id: 'lt-1',
    total_days: 12,
    used_days: 2,
    pending_days: 1,
    remaining_days: 9,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    leave_type: {
      id: 'lt-1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      default_days: 12,
      is_paid: true,
      requires_approval: true,
      requires_attachment: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
]

const mockCompanyBalances = [
  {
    id: 'bal-1',
    employee_id: 'emp-1',
    year: 2026,
    leave_type_id: 'lt-1',
    total_days: 12,
    used_days: 2,
    pending_days: 1,
    remaining_days: 9,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    leave_type: {
      id: 'lt-1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      default_days: 12,
      is_paid: true,
      requires_approval: true,
      requires_attachment: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    employee: {
      id: 'emp-1',
      full_name: 'Nguyen Van A',
      employee_code: 'LPVN-0001',
      department_id: 'dept-1',
    },
  },
]

describe('LeaveManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(leaveService.getLeaveBalances).mockResolvedValue({
      data: mockPersonalBalances,
      error: null,
    })
    vi.mocked(leaveService.getAllLeaveBalances).mockResolvedValue({
      data: mockCompanyBalances,
      error: null,
    })
    vi.mocked(leaveService.updateEntitlement).mockResolvedValue({
      error: null,
    })
  })

  afterEach(cleanup)

  it('renders page title "Quản lý Nghỉ phép & Phép năm" and tabs', async () => {
    render(<LeaveManagementPage />)

    expect(
      screen.getByRole('heading', { name: 'Quản lý Nghỉ phép & Phép năm' })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Số Dư Phép Cá Nhân' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Quỹ Phép Công Ty (HR)' })).toBeInTheDocument()
  })

  it('renders personal leave balance cards in Tab 1 by default', async () => {
    render(<LeaveManagementPage />)

    await waitFor(() => {
      expect(screen.getByText('Tổng phép năm')).toBeInTheDocument()
      expect(screen.getByText('12 ngày')).toBeInTheDocument()
    })
  })

  it('switches tabs to "Quỹ Phép Công Ty (HR)" and renders company balances table', async () => {
    const user = userEvent.setup()
    render(<LeaveManagementPage />)

    const hrTab = screen.getByRole('tab', { name: 'Quỹ Phép Công Ty (HR)' })
    await user.click(hrTab)

    await waitFor(() => {
      expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
      expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    })
  })

  it('filters company balances when typing in search input', async () => {
    const user = userEvent.setup()
    render(<LeaveManagementPage />)

    const hrTab = screen.getByRole('tab', { name: 'Quỹ Phép Công Ty (HR)' })
    await user.click(hrTab)

    const searchInput = await screen.findByPlaceholderText('Tìm kiếm theo tên, mã NV...')
    fireEvent.change(searchInput, { target: { value: 'Nguyen' } })

    await waitFor(() => {
      expect(leaveService.getAllLeaveBalances).toHaveBeenCalledWith(2026, 'Nguyen')
    })
  })

  it('opens LeaveEntitlementModal on "Điều Chỉnh" click and submits entitlement update', async () => {
    const user = userEvent.setup()
    render(<LeaveManagementPage />)

    const hrTab = screen.getByRole('tab', { name: 'Quỹ Phép Công Ty (HR)' })
    await user.click(hrTab)

    const adjustBtn = await screen.findByRole('button', { name: 'Điều Chỉnh' })
    await user.click(adjustBtn)

    await waitFor(() => {
      expect(screen.getByText('Điều Chỉnh Quỹ Phép Năm')).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: 'Lưu Thay Đổi' })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(leaveService.updateEntitlement).toHaveBeenCalledWith({
        employee_id: 'emp-1',
        year: 2026,
        base_days: 12,
        seniority_days: 0,
        bonus_days: 0,
      })
    })
  })
})
