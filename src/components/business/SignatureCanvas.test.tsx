import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignatureCanvas } from './SignatureCanvas'

describe('SignatureCanvas', () => {
  it('renders canvas drawing area and control buttons', () => {
    render(<SignatureCanvas onSave={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText(/Màu mực:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xóa nét/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hoàn tác/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lưu Chữ Ký Này/i })).toBeInTheDocument()
  })
})
