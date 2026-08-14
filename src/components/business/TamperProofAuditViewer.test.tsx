import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { TamperProofAuditViewer } from './TamperProofAuditViewer'

afterEach(cleanup)

describe('TamperProofAuditViewer', () => {
  it('renders heading and audit logs with HMAC verified badges', () => {
    render(<TamperProofAuditViewer />)
    expect(
      screen.getByText('Nhật Ký Kiểm Toán Chống Giả Mạo (Tamper-Resistant Audit Trail)')
    ).toBeInTheDocument()
    expect(screen.getByText('AUD-2026-081')).toBeInTheDocument()
    expect(screen.getByText('APPROVE_LEAVE')).toBeInTheDocument()
    expect(screen.getAllByText('HMAC-Verified').length).toBeGreaterThan(0)
  })

  it('re-verifies HMAC signatures when clicking Thẩm Tra Mã Băm HMAC', () => {
    render(<TamperProofAuditViewer />)
    const verifyBtn = screen.getByRole('button', { name: /Thẩm Tra Mã Băm HMAC/i })
    fireEvent.click(verifyBtn)
    expect(screen.getAllByText('HMAC-Verified').length).toBeGreaterThan(0)
  })
})
