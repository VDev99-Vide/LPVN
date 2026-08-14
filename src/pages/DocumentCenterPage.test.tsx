import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { DocumentCenterPage } from './DocumentCenterPage'

describe('DocumentCenterPage', () => {
  it('renders document center heading and template tabs', () => {
    render(
      <AuthProvider>
        <DocumentCenterPage />
      </AuthProvider>
    )

    expect(
      screen.getByRole('heading', { name: /Trung Tâm Tài Liệu & Xuất Bản ISO/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Danh Mục Biểu Mẫu ISO/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Tài Liệu Đã Xuất Bản/i })).toBeInTheDocument()
  })
})
