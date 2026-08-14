import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttendanceFormDrawer } from './AttendanceFormDrawer'

describe('AttendanceFormDrawer', () => {
  it('renders attendance form with inputs and presets', () => {
    render(
      <AttendanceFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        currentUserName="Nguyen Van A"
        currentUserCode="LPVN-0001"
      />
    )

    expect(screen.getByText(/Đăng Ký Xác Nhận Ngày Công/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByLabelText(/Ngày cần xác nhận/i)).toBeInTheDocument()
    expect(screen.getByText(/\+ Quên quẹt thẻ lúc vào ca/i)).toBeInTheDocument()
  })
})
