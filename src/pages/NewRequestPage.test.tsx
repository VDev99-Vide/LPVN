import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { NewRequestPage } from './NewRequestPage'
import { AuthProvider } from '@/contexts/AuthContext'

afterEach(cleanup)

function renderNewRequestPage() {
  return render(
    <AuthProvider>
      <NewRequestPage />
    </AuthProvider>
  )
}

describe('NewRequestPage', () => {
  it('renders all 3 ISO form tabs', () => {
    renderNewRequestPage()
    expect(screen.getByText('Tạo Đơn Mới (Chuẩn ISO)')).toBeInTheDocument()
    expect(screen.getByText('1. Giấy Phép Ra Cổng')).toBeInTheDocument()
    expect(screen.getByText('2. Đơn Xin Nghỉ Phép')).toBeInTheDocument()
    expect(screen.getByText('3. Xác Nhận Ngày Công')).toBeInTheDocument()
  })

  it('switches to Gate Pass tab when clicked', () => {
    renderNewRequestPage()
    const gpTab = screen.getByText('1. Giấy Phép Ra Cổng')
    fireEvent.click(gpTab)
    expect(screen.getByText(/Giấy Phép Ra Cổng · Gate Pass/i)).toBeInTheDocument()
    expect(screen.getByText('Loại ra cổng')).toBeInTheDocument()
  })

  it('switches to Attendance tab when clicked', () => {
    renderNewRequestPage()
    const attTab = screen.getByText('3. Xác Nhận Ngày Công')
    fireEvent.click(attTab)
    expect(screen.getByText(/Phiếu Xác Nhận Ngày Công/i)).toBeInTheDocument()
    expect(screen.getByText('Lý do điều chỉnh công')).toBeInTheDocument()
  })

  it('shows medical attachment requirement when selecting Sick Leave', () => {
    renderNewRequestPage()
    const sickRadio = screen.getByLabelText(/Nghỉ ốm \/ Khám bệnh/i)
    fireEvent.click(sickRadio)
    expect(
      screen.getByText(/Đính kèm Giấy tờ Y tế \/ Minh chứng/i)
    ).toBeInTheDocument()
  })
})
