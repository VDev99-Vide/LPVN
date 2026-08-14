import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutlookDeepLinkGenerator } from './OutlookDeepLinkGenerator'

describe('OutlookDeepLinkGenerator', () => {
  it('renders deep link generator with URL box and copy button', () => {
    render(<OutlookDeepLinkGenerator />)

    expect(screen.getByText('Trình Tạo Deep Link Outlook (Testing Tool)')).toBeInTheDocument()
    expect(screen.getByText(/URL Deep Link An Toàn:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mở Trang Phê Duyệt Nhanh/i })).toBeInTheDocument()
  })
})
