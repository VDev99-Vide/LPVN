import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { SecurityAuditPage } from './SecurityAuditPage'

afterEach(cleanup)

describe('SecurityAuditPage', () => {
  it('renders heading and all 3 security components', () => {
    render(<SecurityAuditPage />)
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Trung Tâm Kiểm Soát An Ninh (Security & RLS Hardening)')
    expect(
      screen.getByText('Bộ Quét An Ninh Toàn Diện Hệ Thống (Live Security Posture Scan)')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Ma Trận Kiểm Soát An Ninh (OWASP Security Controls)')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Nhật Ký Kiểm Toán Chống Giả Mạo (Tamper-Resistant Audit Trail)')
    ).toBeInTheDocument()
  })
})
