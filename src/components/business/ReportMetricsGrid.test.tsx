import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportMetricsGrid } from './ReportMetricsGrid'

describe('ReportMetricsGrid', () => {
  it('renders all 4 metric cards with formatted KPI values', () => {
    const mockKPIs = {
      totalLeaveDaysTaken: 142.5,
      leaveUtilizationRate: 48.6,
      totalGatePasses: 86,
      totalAttendanceCorrections: 34,
      totalActiveEmployees: 24,
    }

    render(<ReportMetricsGrid kpis={mockKPIs} />)

    expect(screen.getByText('Tổng Ngày Nghỉ Đã Duyệt')).toBeInTheDocument()
    expect(screen.getByText('142.5 ngày')).toBeInTheDocument()
    expect(screen.getByText('48.6%')).toBeInTheDocument()
    expect(screen.getByText('86 lượt')).toBeInTheDocument()
    expect(screen.getByText('34 đơn')).toBeInTheDocument()
  })
})
