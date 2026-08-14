import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QASuiteDashboard } from './QASuiteDashboard'

afterEach(cleanup)

describe('QASuiteDashboard', () => {
  it('renders overview metrics and test suites table', () => {
    render(<QASuiteDashboard />)
    expect(screen.getByText(/Tỷ Lệ Đạt/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Bộ Kiểm Thử/i).length).toBeGreaterThan(0)
    expect(screen.getByText('E2E Happy Path Lifecycle')).toBeInTheDocument()
    expect(screen.getByText('E2E Rejection & Outlook Fallback')).toBeInTheDocument()
    expect(screen.getByText('Cross-Role & Department Isolation')).toBeInTheDocument()
  })

  it('triggers live QA execution when clicking Chạy Toàn Bộ Kiểm Thử', async () => {
    render(<QASuiteDashboard />)
    const runBtn = screen.getByRole('button', { name: /Chạy Toàn Bộ Kiểm Thử/i })
    fireEvent.click(runBtn)

    expect(screen.getByText(/Đang Kiểm Thử.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Lần chạy gần nhất lúc/i)).toBeInTheDocument()
    })
  })
})
