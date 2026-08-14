import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatePassPreviewModal } from './GatePassPreviewModal'
import type { GatePassWithRelations } from '@/services/gate-pass.service'

describe('GatePassPreviewModal', () => {
  it('renders ISO document modal when open', () => {
    const mockPass: GatePassWithRelations = {
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
    }

    render(
      <GatePassPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        gatePass={mockPass}
      />
    )

    expect(screen.getByText(/Xem Trước Biểu Mẫu ISO/i)).toBeInTheDocument()
    expect(screen.getByText(/GIẤY PHÉP RA CỔNG/i)).toBeInTheDocument()
  })
})
