import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmailPreviewModal } from './EmailPreviewModal'

describe('EmailPreviewModal', () => {
  it('renders email preview modal with Outlook templates', () => {
    render(<EmailPreviewModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Xem Trước Mẫu Email Microsoft Outlook')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /1. Thông Báo Duyệt Đơn/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /2. Kết Quả Xử Lý/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /3. Xuất Bản ISO/i })).toBeInTheDocument()
  })
})
