import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentTemplateCatalog } from './DocumentTemplateCatalog'

describe('DocumentTemplateCatalog', () => {
  it('renders all 3 standard ISO template cards', () => {
    render(<DocumentTemplateCatalog onSelectTemplate={vi.fn()} />)

    expect(screen.getByText('LPVN-HR-F-0013')).toBeInTheDocument()
    expect(screen.getByText('LPVN-HR-F-0014')).toBeInTheDocument()
    expect(screen.getByText('LPVN-HR-F-0008')).toBeInTheDocument()
    expect(screen.getByText('Đơn Xin Nghỉ Phép')).toBeInTheDocument()
    expect(screen.getByText('Giấy Phép Ra Cổng')).toBeInTheDocument()
    expect(screen.getByText('Phiếu Yêu Cầu Xác Nhận Ngày Công')).toBeInTheDocument()
  })
})
