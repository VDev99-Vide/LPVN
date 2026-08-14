import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReportsPage } from './ReportsPage'

describe('ReportsPage', () => {
  it('renders reports heading and all three main tabs', () => {
    render(
      <AuthProvider>
        <ReportsPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Báo Cáo & Phân Tích Dữ Liệu/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Tổng Quan Thống Kê/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Báo Cáo Phép Năm/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Ra Cổng & Chấm Công/i })).toBeInTheDocument()
  })
})
