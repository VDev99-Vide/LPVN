import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppShell } from './AppShell'

afterEach(cleanup)

describe('AppShell', () => {
  it('renders sidebar navigation items', () => {
    render(
      <AuthProvider>
        <AppShell>content</AppShell>
      </AuthProvider>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Tạo đơn mới')).toBeInTheDocument()
    expect(screen.getByText('Đơn của tôi')).toBeInTheDocument()
    expect(screen.getByText('Duyệt đơn')).toBeInTheDocument()
    expect(screen.getByText('Thư viện chữ ký')).toBeInTheDocument()
    expect(screen.getByText('Nhân sự & Tạo User')).toBeInTheDocument()
    expect(screen.getByText('Quản lý Phép năm')).toBeInTheDocument()
    expect(screen.getByText('Biểu Mẫu ISO')).toBeInTheDocument()
    expect(screen.getByText('Pipeline Tự Động')).toBeInTheDocument()
    expect(screen.getByText('An Ninh & RLS')).toBeInTheDocument()
    expect(screen.getByText('Kiểm Thử & QA')).toBeInTheDocument()
  })

  it('renders topbar with theme toggle and user', () => {
    render(
      <AuthProvider>
        <AppShell>content</AppShell>
      </AuthProvider>
    )
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thông báo/i })).toBeInTheDocument()
    expect(screen.getAllByText('LPVN Admin').length).toBeGreaterThan(0)
  })

  it('renders children in the content area', () => {
    render(
      <AuthProvider>
        <AppShell>
          <p>dashboard content</p>
        </AppShell>
      </AuthProvider>
    )
    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
