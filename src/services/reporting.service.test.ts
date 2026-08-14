import { describe, expect, it } from 'vitest'
import { reportingService } from './reporting.service'

describe('ReportingService', () => {
  it('returns company KPIs correctly', () => {
    const kpis = reportingService.getCompanyKPIs(2026)
    expect(kpis).toBeDefined()
    expect(kpis.totalLeaveDaysTaken).toBeGreaterThan(0)
    expect(kpis.leaveUtilizationRate).toBeGreaterThan(0)
    expect(kpis.totalActiveEmployees).toBeGreaterThan(0)
  })

  it('returns monthly leave trend for 12 months', () => {
    const trend = reportingService.getMonthlyLeaveTrend(2026)
    expect(trend).toHaveLength(12)
    expect(trend[0].monthName).toBe('T1')
    expect(trend[11].monthName).toBe('T12')
  })

  it('generates UTF-8 BOM CSV format correctly', () => {
    const headers = [
      { label: 'Mã NV', key: 'code' },
      { label: 'Họ Tên', key: 'name' },
    ]
    const data = [{ code: 'LPVN-001', name: 'Trần Văn An' }]
    const csv = reportingService.exportToCSV('test_report', headers, data)

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('"Mã NV","Họ Tên"')
    expect(csv).toContain('"LPVN-001","Trần Văn An"')
  })
})
