import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportCharts } from './ReportCharts'
import { reportingService } from '@/services/reporting.service'

describe('ReportCharts', () => {
  it('renders monthly trend, department breakdown and leave types', () => {
    const monthlyTrend = reportingService.getMonthlyLeaveTrend(2026)
    const deptData = reportingService.getDepartmentBreakdown(2026)
    const typeData = reportingService.getLeaveTypeDistribution(2026)

    render(
      <ReportCharts
        monthlyTrend={monthlyTrend}
        departmentData={deptData}
        leaveTypeData={typeData}
      />
    )

    expect(screen.getByText('Xu Hướng Nghỉ Phép Theo Tháng')).toBeInTheDocument()
    expect(screen.getByText('Phân Bổ Nghỉ Theo Phòng Ban')).toBeInTheDocument()
    expect(screen.getByText('Cơ Cấu Các Loại Hình Nghỉ')).toBeInTheDocument()
    expect(screen.getByText('Phòng Sản Xuất')).toBeInTheDocument()
  })
})
