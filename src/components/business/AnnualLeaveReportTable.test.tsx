import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnnualLeaveReportTable } from './AnnualLeaveReportTable'
import { reportingService } from '@/services/reporting.service'

describe('AnnualLeaveReportTable', () => {
  it('renders employee leave summaries and export button', () => {
    const mockData = reportingService.getEmployeeLeaveSummaries(2026)

    render(<AnnualLeaveReportTable data={mockData} year={2026} />)

    expect(screen.getByText('Báo Cáo Tổng Hợp Số Dư Phép Năm 2026')).toBeInTheDocument()
    expect(screen.getByText('Trần Văn An')).toBeInTheDocument()
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xuất Báo Cáo Excel\/CSV/i })).toBeInTheDocument()
  })
})
