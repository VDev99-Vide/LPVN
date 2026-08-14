import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationsPage } from './NotificationsPage'

describe('NotificationsPage', () => {
  it('renders notifications page heading and both tabs', () => {
    render(
      <AuthProvider>
        <NotificationsPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Trung Tâm Thông Báo & Hàng Đợi Email/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Hộp Thư Thông Báo/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Hàng Đợi Email/i })).toBeInTheDocument()
  })
})
