import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { AttendancePage } from './AttendancePage'

describe('AttendancePage', () => {
  it('renders attendance page heading and tabs', () => {
    render(
      <AuthProvider>
        <AttendancePage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Xác Nhận Ngày Công/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Phiếu Của Tôi/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /HR Chấm Công/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Đăng Ký Xác Nhận Công/i })
    ).toBeInTheDocument()
  })
})
