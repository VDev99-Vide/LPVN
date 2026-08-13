import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { LeaveBalanceCards } from './LeaveBalanceCards'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

afterEach(cleanup)

describe('LeaveBalanceCards', () => {
  it('renders total days, used days, pending days, and remaining days stat cards correctly', () => {
    const mockBalances: LeaveBalanceWithRelations[] = [
      {
        id: 'b1',
        employee_id: 'e1',
        year: 2026,
        leave_type_id: 'lt1',
        total_days: 14,
        used_days: 3,
        pending_days: 1,
        remaining_days: 10,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
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

    render(<LeaveBalanceCards balances={mockBalances} />)

    expect(screen.getByText('Tổng phép năm')).toBeInTheDocument()
    expect(screen.getByText('14 ngày')).toBeInTheDocument()

    expect(screen.getByText('Đã sử dụng')).toBeInTheDocument()
    expect(screen.getByText('3 ngày')).toBeInTheDocument()

    expect(screen.getByText('Đang chờ duyệt')).toBeInTheDocument()
    expect(screen.getByText('1 ngày')).toBeInTheDocument()

    expect(screen.getByText('Khả dụng còn lại')).toBeInTheDocument()
    expect(screen.getByText('10 ngày')).toBeInTheDocument()
  })

  it('renders default fallback values when balances array is empty', () => {
    render(<LeaveBalanceCards balances={[]} />)

    expect(screen.getByText('Tổng phép năm')).toBeInTheDocument()
    expect(screen.getAllByText('12 ngày')).toHaveLength(2)

    expect(screen.getByText('Đã sử dụng')).toBeInTheDocument()
    expect(screen.getAllByText('0 ngày')).toHaveLength(2)

    expect(screen.getByText('Đang chờ duyệt')).toBeInTheDocument()

    expect(screen.getByText('Khả dụng còn lại')).toBeInTheDocument()
  })
})
