import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentExportToolbar } from './DocumentExportToolbar'

describe('DocumentExportToolbar', () => {
  it('renders toolbar with print button and hash badge', () => {
    render(
      <DocumentExportToolbar
        documentHash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        onPrint={vi.fn()}
      />
    )

    expect(screen.getByText(/Bảo mật SHA-256/i)).toBeInTheDocument()
    expect(screen.getByText(/e3b0c44298fc/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /In Bản Chuẩn ISO/i })).toBeInTheDocument()
  })
})
