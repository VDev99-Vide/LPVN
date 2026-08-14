import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'
import { AuthProvider } from '@/contexts/AuthContext'

afterEach(cleanup)

function renderDashboardPage() {
  return render(
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  )
}

describe('DashboardPage', () => {
  it('renders heading and KPI cards', () => {
    renderDashboardPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tổng quan (Dashboard) · Phòng Supply Chain')
    expect(screen.getByText('Đơn chờ duyệt (Supply Chain)')).toBeInTheDocument()
    expect(screen.getByText('Nhân sự nghỉ trong tháng')).toBeInTheDocument()
    expect(screen.getByText('Tổng số ngày nghỉ (Tháng 8)')).toBeInTheDocument()
    expect(screen.getByText('Nhân sự phòng Supply Chain')).toBeInTheDocument()
  })

  it('renders Top Rank Nghỉ Phép table for supervisor and admin', () => {
    renderDashboardPage()
    expect(screen.getByText('Top Rank Nghỉ Phép Nhân Sự (Supply Chain)')).toBeInTheDocument()
    expect(screen.getByText('LPVN-0231')).toBeInTheDocument()
    expect(screen.getByText('Phạm Thị D')).toBeInTheDocument()
  })

  it('renders pending approvals table with status badges', () => {
    renderDashboardPage()
    expect(screen.getByText('Hoạt Động Gần Đây')).toBeInTheDocument()
    expect(screen.getByText('LV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })
})
