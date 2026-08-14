import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { AdminUserCreatorModal } from './AdminUserCreatorModal'

afterEach(cleanup)

describe('AdminUserCreatorModal', () => {
  it('renders modal with required user fields', () => {
    const handleClose = vi.fn()
    const handleCreated = vi.fn()

    render(
      <AdminUserCreatorModal
        isOpen={true}
        onClose={handleClose}
        onUserCreated={handleCreated}
      />
    )

    expect(
      screen.getByText('Thêm Nhân Viên & Tạo Tài Khoản Trực Tiếp')
    ).toBeInTheDocument()
    expect(screen.getByText('Mã Nhân Viên')).toBeInTheDocument()
    expect(screen.getByText('Mật Khẩu Khởi Tạo')).toBeInTheDocument()
    expect(
      screen.getByText('Phòng Supply Chain (Ưu tiên áp dụng)')
    ).toBeInTheDocument()
  })

  it('submits new user data on form submission', async () => {
    const handleClose = vi.fn()
    const handleCreated = vi.fn()

    render(
      <AdminUserCreatorModal
        isOpen={true}
        onClose={handleClose}
        onUserCreated={handleCreated}
      />
    )

    const nameInput = screen.getByPlaceholderText('VD: Hoàng Văn E')
    fireEvent.change(nameInput, { target: { value: 'Hoàng Văn E' } })

    const submitBtn = screen.getByRole('button', { name: /Tạo Tài Khoản Người Dùng/i })
    fireEvent.click(submitBtn)

    expect(screen.getByText(/Đang tạo.../i)).toBeInTheDocument()
  })
})
