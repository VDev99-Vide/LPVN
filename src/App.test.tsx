import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from './App'

afterEach(() => {
  cleanup()
  window.history.pushState({}, '', '/')
})

describe('App', () => {
  it('renders the dashboard inside the spatial shell', () => {
    render(<App />)
    expect(screen.getAllByText('LPVN').length).toBeGreaterThan(0)
    expect(screen.getAllByText('visionOS').length).toBeGreaterThan(0)
    expect(screen.getByText(/Mark Attendance/i)).toBeInTheDocument()
    expect(screen.getByText(/Leaves Summary/i)).toBeInTheDocument()
    expect(screen.getByText(/Waiting For Approval/i)).toBeInTheDocument()
  })

  it('renders NewRequestPage when path is /new-request', () => {
    window.history.pushState({}, '', '/new-request')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tạo Đơn Mới (Chuẩn ISO)')
  })

  it('renders MyRequestsPage when path is /my-requests', () => {
    window.history.pushState({}, '', '/my-requests')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Đơn Của Tôi (My Requests)')
  })

  it('renders LeaveManagementPage when path is /leave', () => {
    window.history.pushState({}, '', '/leave')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quản lý Nghỉ phép & Phép năm')
  })
})
