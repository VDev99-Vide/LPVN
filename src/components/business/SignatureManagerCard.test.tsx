import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignatureManagerCard } from './SignatureManagerCard'
import type { DigitalSignatureRow } from '@/services/signature.service'

describe('SignatureManagerCard', () => {
  it('renders signature manager card with signatures list and action triggers', () => {
    const mockSignatures: DigitalSignatureRow[] = [
      {
        id: 'sig-1',
        user_id: 'user-1',
        signature_type: 'CANVAS_DRAWN',
        signature_url: 'data:image/png;base64,mock',
        title: 'Chữ ký giám đốc',
        is_default: true,
        is_active: true,
        metadata: {},
        created_at: '2026-08-14T00:00:00Z',
        updated_at: '2026-08-14T00:00:00Z',
      },
    ]

    render(
      <SignatureManagerCard
        signatures={mockSignatures}
        onSetDefault={vi.fn()}
        onDelete={vi.fn()}
        onOpenCanvas={vi.fn()}
        onOpenUpload={vi.fn()}
      />
    )

    expect(screen.getByText('Thư Viện Chữ Ký Điện Tử')).toBeInTheDocument()
    expect(screen.getByText('Chữ ký giám đốc')).toBeInTheDocument()
    expect(screen.getByText('Mặc định')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ký Nét Mới/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tải Ảnh/i })).toBeInTheDocument()
  })
})
