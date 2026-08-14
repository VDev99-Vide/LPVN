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

describe('DashboardPage - Real System Data & Vision Pro Spatial Edition', () => {
  it('renders user welcome header and real department info', () => {
    renderDashboardPage()
    expect(screen.getByText('Welcome Back,')).toBeInTheDocument()
    expect(screen.getByText(/Phòng ban:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Ban Quản Trị & Nhân Sự|Supply Chain/i).length).toBeGreaterThan(0)
  })

  it('renders Mark Attendance card with timer, location toggle and action buttons', () => {
    renderDashboardPage()
    expect(screen.getByText(/Mark Attendance \(Chấm công\)/i)).toBeInTheDocument()
    expect(screen.getByText('Office')).toBeInTheDocument()
    expect(screen.getByText('Work From Home')).toBeInTheDocument()
    expect(screen.getByText(/Giờ làm việc \(Work Hours\)/i)).toBeInTheDocument()
    expect(screen.getByText('Out for Lunch')).toBeInTheDocument()
    expect(screen.getByText('Out for Break')).toBeInTheDocument()
    expect(screen.getByText(/Clock Out/i)).toBeInTheDocument()

    // Test location toggle
    const wfhBtn = screen.getByText('Work From Home')
    fireEvent.click(wfhBtn)
    expect(screen.getByText(/Trạm làm việc từ xa \(WFH\)/i)).toBeInTheDocument()
  })

  it('renders real system KPIs for employees and leave days', () => {
    renderDashboardPage()
    expect(screen.getByText('Nhân sự phòng ban')).toBeInTheDocument()
    expect(screen.getByText('24 nhân sự')).toBeInTheDocument()
    expect(screen.getByText('Tổng ngày nghỉ (2026)')).toBeInTheDocument()
    expect(screen.getByText('142.5 ngày')).toBeInTheDocument()
  })

  it('renders Leaves Summary card with real leave entitlement types', () => {
    renderDashboardPage()
    expect(screen.getByText(/Leaves Summary \(Quỹ Phép\)/i)).toBeInTheDocument()
    expect(screen.getByText('Năm 2026')).toBeInTheDocument()
    expect(screen.getByText(/Phép năm \(Annual Leave\)/i)).toBeInTheDocument()
    expect(screen.getByText(/7.5 \/ 14 ngày còn lại/i)).toBeInTheDocument()
    expect(screen.getByText(/Nghỉ ốm \/ Khám bệnh \(Sick Leave\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Việc riêng có lương \(Casual Leave\)/i)).toBeInTheDocument()
  })

  it('renders Attendance Summary card with performance metrics', () => {
    renderDashboardPage()
    expect(screen.getByText(/Attendance Summary \(Hiệu Suất Công\)/i)).toBeInTheDocument()
    expect(screen.getByText('6.75')).toBeInTheDocument()
    expect(screen.getByText(/Giờ làm việc trung bình \/ ngày/i)).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText(/Số ngày đi trễ \(Trong tháng\)/i)).toBeInTheDocument()
  })

  it('renders real Waiting For Approval queue and allows approving requests', () => {
    renderDashboardPage()
    expect(screen.getByText(/Waiting For Approval \(Chờ Phê Duyệt\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Trần Văn An/i)).toBeInTheDocument()
    expect(screen.getByText(/Nguyễn Thị Bình/i)).toBeInTheDocument()

    const approveButtons = screen.getAllByText('Duyệt')
    fireEvent.click(approveButtons[0])
    expect(screen.getByText('Đã phê duyệt yêu cầu thành công!')).toBeInTheDocument()
  })

  it('renders Forms launcher with LPVN ISO templates', () => {
    renderDashboardPage()
    expect(screen.getByText(/Forms \(Biểu Mẫu Chuẩn ISO\)/i)).toBeInTheDocument()
    expect(screen.getByText('Tạo Biểu Mẫu Ngay (Fill Form)')).toBeInTheDocument()
  })
})
