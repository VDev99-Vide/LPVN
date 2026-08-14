import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttendancePreviewModal } from './AttendancePreviewModal'
import type { AttendanceWithRelations } from '@/services/attendance.service'

describe('AttendancePreviewModal', () => {
  it('renders ISO document modal for attendance confirmation', () => {
    const mockAtt: AttendanceWithRelations = {
      id: 'att-1',
      document_no: 'LPVN-HR-F-0008',
      employee_id: 'emp-1',
      reason: 'Quên quẹt thẻ lúc vào ca',
      confirmation_date: '2026-08-14',
      from_time: '08:00',
      to_time: '17:00',
      status: 'APPROVED',
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
    }

    render(
      <AttendancePreviewModal
        isOpen={true}
        onClose={vi.fn()}
        attendance={mockAtt}
      />
    )

    expect(screen.getByText(/Xem Trước Phiếu Xác Nhận Ngày Công/i)).toBeInTheDocument()
    expect(screen.getByText(/PHIẾU YÊU CẦU XÁC NHẬN NGÀY CÔNG/i)).toBeInTheDocument()
  })
})
