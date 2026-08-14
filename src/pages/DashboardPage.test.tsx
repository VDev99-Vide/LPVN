import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

afterEach(cleanup)

describe('DashboardPage', () => {
  it('renders heading and KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tổng quan (Dashboard)')
    expect(screen.getByText('Đơn của tôi đang chờ duyệt')).toBeInTheDocument()
    expect(screen.getByText('Đơn đã được duyệt')).toBeInTheDocument()
    expect(screen.getByText('Ngày phép năm còn lại')).toBeInTheDocument()
    expect(screen.getByText('Đơn cần bạn duyệt')).toBeInTheDocument()
  })

  it('renders pending approvals table with status badges', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Hoạt Động Gần Đây')).toBeInTheDocument()
    expect(screen.getByText('LV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })
})
