import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatePassFormDrawer } from './GatePassFormDrawer'

describe('GatePassFormDrawer', () => {
  it('renders form inputs and labels', () => {
    render(
      <GatePassFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        currentUserName="Nguyen Van A"
        currentUserCode="LPVN-0001"
      />
    )

    expect(screen.getByText(/Đăng Ký Giấy Phép Ra Cổng/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByLabelText(/Từ \(giờ\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Đến \(giờ\)/i)).toBeInTheDocument()
  })
})
