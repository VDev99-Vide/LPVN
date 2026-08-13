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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Quản lý Phép năm')).toBeInTheDocument()
  })

  it('renders LeaveManagementPage when path is /leave', () => {
    window.history.pushState({}, '', '/leave')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quản lý Nghỉ phép & Phép năm')
  })
})
