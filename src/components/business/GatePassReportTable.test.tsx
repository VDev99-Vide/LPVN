import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GatePassReportTable } from './GatePassReportTable'

describe('GatePassReportTable', () => {
  it('renders gate pass statistics and export button', () => {
    render(<GatePassReportTable />)

    expect(screen.getByText('Thống Kê Ra Cổng & Xác Nhận Công')).toBeInTheDocument()
    expect(screen.getByText('Phòng Sản Xuất')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xuất Báo Cáo Excel\/CSV/i })).toBeInTheDocument()
  })
})
