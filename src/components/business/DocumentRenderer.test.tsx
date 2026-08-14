import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentRenderer } from './DocumentRenderer'

describe('DocumentRenderer', () => {
  it('renders Leave ISO document when given LEAVE type', () => {
    const mockData = {
      full_name: 'Nguyen Van A',
      employee_code: 'LPVN-0001',
      department: 'Phòng Kỹ Thuật',
      leave_type: 'Nghỉ phép năm',
      reason: 'Việc gia đình',
      from_date: '2026-08-14',
      to_date: '2026-08-15',
      total_days: 2,
    }

    render(<DocumentRenderer documentType="LEAVE" data={mockData} />)

    expect(screen.getByText(/ĐƠN XIN NGHỈ PHÉP/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
  })
})
