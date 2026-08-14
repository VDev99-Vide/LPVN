import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { GatePassPage } from './GatePassPage'

describe('GatePassPage', () => {
  it('renders gate pass page heading and tabs', () => {
    render(
      <AuthProvider>
        <GatePassPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Quản lý Giấy phép Ra cổng/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Đơn Của Tôi/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Trạm Bảo Vệ/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng Ký Ra Cổng/i })).toBeInTheDocument()
  })
})
