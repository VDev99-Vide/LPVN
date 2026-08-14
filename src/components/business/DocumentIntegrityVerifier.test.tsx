import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentIntegrityVerifier } from './DocumentIntegrityVerifier'

describe('DocumentIntegrityVerifier', () => {
  it('renders integrity verifier with JSON input and compute button', () => {
    render(<DocumentIntegrityVerifier />)

    expect(
      screen.getByText('Kiểm Thẩm Tra Mã Băm Toàn Vẹn SHA-256 (Anti-Tamper Verifier)')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Tính Mã Băm & Thẩm Tra/i })
    ).toBeInTheDocument()
  })
})
