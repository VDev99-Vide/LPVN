import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttendanceTable } from './AttendanceTable'
import type { AttendanceWithRelations } from '@/services/attendance.service'

describe('AttendanceTable', () => {
  it('renders attendance rows and action buttons', () => {
    const mockAtts: AttendanceWithRelations[] = [
      {
        id: 'att-1',
        document_no: 'LPVN-HR-F-0008',
        employee_id: 'emp-1',
        reason: 'Quên quẹt thẻ',
        confirmation_date: '2026-08-14',
        from_time: '08:00',
        to_time: '17:00',
        status: 'PENDING_APPROVAL',
        checker_id: null,
        checked_at: null,
        approver_id: null,
        approved_at: null,
        hr_admin_id: null,
        hr_recorded_at: null,
        notes: null,
        created_at: '2026-08-14T00:00:00Z',
        updated_at: '2026-08-14T00:00:00Z',
        employee: {
          id: 'emp-1',
          full_name: 'Nguyen Van A',
          employee_code: 'LPVN-0001',
          department_id: null,
        },
      },
    ]

    render(
      <AttendanceTable
        attendances={mockAtts}
        onViewISO={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        showApprovalActions={true}
      />
    )

    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('Quên quẹt thẻ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mẫu ISO/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Duyệt/i })).toBeInTheDocument()
  })
})
