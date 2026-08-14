import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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

describe('DashboardPage - Vision Pro Spatial Edition', () => {
  it('renders top-left Leggett branding and visionOS badge', () => {
    renderDashboardPage()
    expect(screen.getByAltText('Leggett & Platt Logo')).toBeInTheDocument()
    expect(screen.getByText('LPVN Flow')).toBeInTheDocument()
    expect(screen.getByText('visionOS')).toBeInTheDocument()
    expect(screen.getByText(/Supply Chain Hub · Leggett & Platt/i)).toBeInTheDocument()
  })

  it('renders user welcome header and time filter controls', () => {
    renderDashboardPage()
    expect(screen.getByText('Welcome Back,')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
  })

  it('renders Mark Attendance card with timer, location toggle and action buttons', () => {
    renderDashboardPage()
    expect(screen.getByText('Mark Attendance')).toBeInTheDocument()
    expect(screen.getByText('Office')).toBeInTheDocument()
    expect(screen.getByText('Work From Home')).toBeInTheDocument()
    expect(screen.getByText('Work Hours')).toBeInTheDocument()
    expect(screen.getByText('Out for Lunch')).toBeInTheDocument()
    expect(screen.getByText('Out for Break')).toBeInTheDocument()
    expect(screen.getByText('Clock Out')).toBeInTheDocument()

    // Test location toggle
    const wfhBtn = screen.getByText('Work From Home')
    fireEvent.click(wfhBtn)
    expect(screen.getByText(/Home Remote Station/i)).toBeInTheDocument()
  })

  it('renders Income and Expenses mini cards', () => {
    renderDashboardPage()
    expect(screen.getByText('Income')).toBeInTheDocument()
    expect(screen.getByText('$ 12,800.00')).toBeInTheDocument()
    expect(screen.getByText('+7.2% Higher')).toBeInTheDocument()
    expect(screen.getByText('Expenses')).toBeInTheDocument()
    expect(screen.getByText('$ 2,800.00')).toBeInTheDocument()
  })

  it('renders Leaves Summary card with leave types and progress bars', () => {
    renderDashboardPage()
    expect(screen.getByText('Leaves Summary')).toBeInTheDocument()
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByText(/Annual Leave/i)).toBeInTheDocument()
    expect(screen.getByText('15/15')).toBeInTheDocument()
    expect(screen.getByText(/Unpaid Leave/i)).toBeInTheDocument()
    expect(screen.getByText('12/15')).toBeInTheDocument()
    expect(screen.getByText(/Sick Leave/i)).toBeInTheDocument()
    expect(screen.getByText('5/8')).toBeInTheDocument()
    expect(screen.getByText(/Casual Leave/i)).toBeInTheDocument()
    expect(screen.getByText('2/5')).toBeInTheDocument()
  })

  it('renders Attendance Summary card with metrics', () => {
    renderDashboardPage()
    expect(screen.getByText('Attendance Summary')).toBeInTheDocument()
    expect(screen.getByText('6.75')).toBeInTheDocument()
    expect(screen.getByText('Avg Time Spent Hours')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('Total Late (days)')).toBeInTheDocument()
  })

  it('renders Waiting For Approval queue and allows approving requests', () => {
    renderDashboardPage()
    expect(screen.getByText('Waiting For Approval')).toBeInTheDocument()
    expect(screen.getByText('Valeria Garza')).toBeInTheDocument()
    expect(screen.getByText('Marci Senter')).toBeInTheDocument()

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])
    expect(screen.getByText('Đã phê duyệt yêu cầu thành công!')).toBeInTheDocument()
  })

  it('renders Forms launcher with LPVN ISO templates', () => {
    renderDashboardPage()
    expect(screen.getByText(/Forms \(Biểu Mẫu ISO\)/i)).toBeInTheDocument()
    expect(screen.getByText('Fill Form')).toBeInTheDocument()
  })

  it('renders bottom floating navigation dock', () => {
    renderDashboardPage()
    expect(screen.getByRole('navigation', { name: 'Bottom Navigation' })).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Expense & Leaves')).toBeInTheDocument()
    expect(screen.getByText('Timesheet')).toBeInTheDocument()
    expect(screen.getByText('Approvals')).toBeInTheDocument()
  })
})
