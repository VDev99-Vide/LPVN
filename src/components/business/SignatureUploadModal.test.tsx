import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignatureUploadModal } from './SignatureUploadModal'

describe('SignatureUploadModal', () => {
  it('renders upload dialog elements', () => {
    render(
      <SignatureUploadModal
        isOpen={true}
        onClose={vi.fn()}
        onUpload={vi.fn()}
      />
    )

    expect(screen.getByText(/Tải Lên Hình Ảnh Chữ Ký/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tên nhận diện chữ ký/i)).toBeInTheDocument()
    expect(screen.getByText(/Bấm để chọn file ảnh từ máy tính/i)).toBeInTheDocument()
  })
})
