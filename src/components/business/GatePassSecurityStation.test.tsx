import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatePassSecurityStation } from './GatePassSecurityStation'
import type { GatePassWithRelations } from '@/services/gate-pass.service'

describe('GatePassSecurityStation', () => {
  it('renders security station with active passes and action buttons', () => {
    const mockPasses: GatePassWithRelations[] = [
      {
        id: 'gp-1',
        document_no: 'LPVN-HR-F-0014',
        employee_id: 'emp-1',
        reason_type: 'BUSINESS',
        reason_details: 'Gặp khách hàng',
        pass_date: '2026-08-14',
        from_time: '13:30',
        to_time: '16:30',
        accompanied_items: 'Laptop',
        status: 'APPROVED',
        approver_id: null,
        approved_at: null,
        manager_notes: null,
        security_out_time: null,
        security_in_time: null,
        security_guard_id: null,
        security_guard_name: null,
        security_notes: null,
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
      <GatePassSecurityStation
        gatePasses={mockPasses}
        onCheckOut={vi.fn()}
        onCheckIn={vi.fn()}
        onViewISO={vi.fn()}
        currentGuardName="Nguyen Van Bao Ve"
      />
    )

    expect(screen.getByText(/Trạm Kiểm Soát Cổng Bảo Vệ/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van Bao Ve')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xác Nhận Ra/i })).toBeInTheDocument()
  })
})
