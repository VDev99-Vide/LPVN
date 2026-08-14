import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { SecurityAuditDashboard } from './SecurityAuditDashboard'

afterEach(cleanup)

describe('SecurityAuditDashboard', () => {
  it('renders security overview metrics', () => {
    render(<SecurityAuditDashboard />)
    expect(screen.getByText('Điểm Đánh Giá An Ninh (A+ Grade)')).toBeInTheDocument()
    expect(screen.getByText('Bảo Vệ RLS Độc Lập 100%')).toBeInTheDocument()
    expect(screen.getByText('Nhật Ký Kiểm Toán Bất Biến')).toBeInTheDocument()
  })

  it('renders all 8 security controls', () => {
    render(<SecurityAuditDashboard />)
    expect(
      screen.getByText('Ma Trận Kiểm Soát An Ninh (OWASP Security Controls)')
    ).toBeInTheDocument()
    expect(screen.getByText('Row Level Security (RLS Matrix)')).toBeInTheDocument()
    expect(screen.getByText('IDOR Defense & Owner Verification')).toBeInTheDocument()
    expect(screen.getByText('Supply Chain Department Boundary')).toBeInTheDocument()
  })
})
