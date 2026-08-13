import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { LeaveEntitlementModal } from './LeaveEntitlementModal'

afterEach(cleanup)

describe('LeaveEntitlementModal', () => {
  it('renders modal title "Điều Chỉnh Quỹ Phép Năm" and input fields when open', () => {
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByText('Điều Chỉnh Quỹ Phép Năm')).toBeInTheDocument()
    expect(screen.getByLabelText('Phép Gốc Quy Định')).toBeInTheDocument()
    expect(screen.getByLabelText('Phép Thâm Niên')).toBeInTheDocument()
    expect(screen.getByLabelText('Phép Thưởng Cộng Thêm')).toBeInTheDocument()
  })

  it('does not render modal content when open state is false', () => {
    render(
      <LeaveEntitlementModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.queryByText('Điều Chỉnh Quỹ Phép Năm')).not.toBeInTheDocument()
  })

  it('pre-fills form fields when initialData is provided', () => {
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialData={{
          base_days: 14,
          seniority_days: 2,
          bonus_days: 1,
        }}
      />
    )

    expect(screen.getByLabelText('Phép Gốc Quy Định')).toHaveValue(14)
    expect(screen.getByLabelText('Phép Thâm Niên')).toHaveValue(2)
    expect(screen.getByLabelText('Phép Thưởng Cộng Thêm')).toHaveValue(1)
  })

  it('handles form submission with updated values', () => {
    const handleSubmit = vi.fn()
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
        initialData={{
          base_days: 12,
          seniority_days: 0,
          bonus_days: 0,
        }}
      />
    )

    fireEvent.change(screen.getByLabelText('Phép Gốc Quy Định'), {
      target: { value: '15' },
    })
    fireEvent.change(screen.getByLabelText('Phép Thâm Niên'), {
      target: { value: '3' },
    })
    fireEvent.change(screen.getByLabelText('Phép Thưởng Cộng Thêm'), {
      target: { value: '2' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Lưu Thay Đổi' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith({
      base_days: 15,
      seniority_days: 3,
      bonus_days: 2,
    })
  })

  it('disables inputs and buttons when isSubmitting is true', () => {
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={true}
      />
    )

    const submitBtn = screen.getByRole('button', { name: 'Đang lưu...' })
    const cancelBtn = screen.getByRole('button', { name: 'Hủy' })

    expect(submitBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
    expect(screen.getByLabelText('Phép Gốc Quy Định')).toBeDisabled()
    expect(screen.getByLabelText('Phép Thâm Niên')).toBeDisabled()
    expect(screen.getByLabelText('Phép Thưởng Cộng Thêm')).toBeDisabled()
  })

  it('calls onClose when Hủy button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
