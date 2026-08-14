import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from './App'

afterEach(() => {
  cleanup()
  window.history.pushState({}, '', '/')
})

describe('App', () => {
  it('renders the dashboard inside the app shell', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Dashboard/i)
    expect(screen.getByText('Quản lý Phép năm')).toBeInTheDocument()
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
