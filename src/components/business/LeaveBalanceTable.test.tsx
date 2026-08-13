import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { LeaveBalanceTable } from './LeaveBalanceTable'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

afterEach(cleanup)

const mockBalances: LeaveBalanceWithRelations[] = [
  {
    id: 'b1',
    employee_id: 'e1',
    year: 2026,
    leave_type_id: 'lt1',
    total_days: 14,
    used_days: 4,
    pending_days: 1,
    remaining_days: 9,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    employee: {
      id: 'e1',
      full_name: 'Nguyen Van A',
      employee_code: 'LPVN-0001',
      department_id: 'd1',
    },
    leave_type: {
      id: 'lt1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      is_paid: true,
      requires_attachment: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  {
    id: 'b2',
    employee_id: 'e2',
    year: 2026,
    leave_type_id: 'lt1',
    total_days: 12,
    used_days: 2,
    pending_days: 0,
    remaining_days: 10,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    employee: {
      id: 'e2',
      full_name: 'Tran Thi B',
      employee_code: 'LPVN-0002',
      department_id: 'd2',
    },
    leave_type: {
      id: 'lt1',
      code: 'ANNUAL',
      name: 'Nghỉ phép năm',
      is_paid: true,
      requires_attachment: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
]

describe('LeaveBalanceTable', () => {
  it('renders table headers correctly', () => {
    render(<LeaveBalanceTable balances={[]} onAdjustEntitlement={vi.fn()} />)

    expect(screen.getByText('Mã NV')).toBeInTheDocument()
    expect(screen.getByText('Họ và Tên')).toBeInTheDocument()
    expect(screen.getByText('Loại Phép')).toBeInTheDocument()
    expect(screen.getByText('Tổng Quỹ')).toBeInTheDocument()
    expect(screen.getByText('Đã Dùng')).toBeInTheDocument()
    expect(screen.getByText('Chờ Duyệt')).toBeInTheDocument()
    expect(screen.getByText('Còn Lại')).toBeInTheDocument()
    expect(screen.getByText('Thao Tác')).toBeInTheDocument()
  })

  it('renders table rows with employee code, name, leave type, total, used, remaining, and action button', () => {
    render(<LeaveBalanceTable balances={mockBalances} onAdjustEntitlement={vi.fn()} />)

    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getAllByText('Nghỉ phép năm').length).toBeGreaterThan(0)
    expect(screen.getByText('14')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()

    expect(screen.getByText('LPVN-0002')).toBeInTheDocument()
    expect(screen.getByText('Tran Thi B')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()

    const adjustButtons = screen.getAllByRole('button', { name: 'Điều Chỉnh' })
    expect(adjustButtons).toHaveLength(2)
  })

  it('triggers onAdjustEntitlement callback when action button is clicked', () => {
    const handleAdjust = vi.fn()
    render(<LeaveBalanceTable balances={mockBalances} onAdjustEntitlement={handleAdjust} />)

    const adjustButtons = screen.getAllByRole('button', { name: 'Điều Chỉnh' })
    fireEvent.click(adjustButtons[0])

    expect(handleAdjust).toHaveBeenCalledTimes(1)
    expect(handleAdjust).toHaveBeenCalledWith(mockBalances[0])
  })

  it('renders loading message when loading prop is true', () => {
    render(<LeaveBalanceTable balances={[]} onAdjustEntitlement={vi.fn()} loading={true} />)

    expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument()
  })

  it('renders empty message when balances list is empty', () => {
    render(<LeaveBalanceTable balances={[]} onAdjustEntitlement={vi.fn()} />)

    expect(screen.getByText('Không tìm thấy dữ liệu phép nào.')).toBeInTheDocument()
  })
})
