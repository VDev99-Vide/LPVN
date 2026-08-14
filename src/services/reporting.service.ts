export interface CompanyKPIs {
  totalLeaveDaysTaken: number
  leaveUtilizationRate: number
  totalGatePasses: number
  totalAttendanceCorrections: number
  totalActiveEmployees: number
}

export interface MonthlyLeaveData {
  month: number
  monthName: string
  days: number
}

export interface DepartmentLeaveData {
  department: string
  totalDays: number
  employeeCount: number
  avgDaysPerEmp: number
}

export interface LeaveTypeDistribution {
  type: string
  count: number
  days: number
  percent: number
}

export interface EmployeeLeaveSummaryItem {
  employeeId: string
  employeeCode: string
  fullName: string
  department: string
  entitledDays: number
  carriedOverDays: number
  totalEntitled: number
  usedDays: number
  remainingDays: number
  utilizationPercent: number
}

export const reportingService = {
  getCompanyKPIs(_year: number = new Date().getFullYear()): CompanyKPIs {
    return {
      totalLeaveDaysTaken: 142.5,
      leaveUtilizationRate: 48.6,
      totalGatePasses: 86,
      totalAttendanceCorrections: 34,
      totalActiveEmployees: 24,
    }
  },

  getMonthlyLeaveTrend(_year: number = new Date().getFullYear()): MonthlyLeaveData[] {
    const months = [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
    ]
    const sampleDays = [12, 28, 8, 14, 18, 15, 10, 16, 9, 7, 4, 1]
    return months.map((m, idx) => ({
      month: idx + 1,
      monthName: m,
      days: sampleDays[idx] || 0,
    }))
  },

  getDepartmentBreakdown(_year: number = new Date().getFullYear()): DepartmentLeaveData[] {
    return [
      { department: 'Phòng Sản Xuất', totalDays: 68.5, employeeCount: 12, avgDaysPerEmp: 5.7 },
      { department: 'Phòng Kỹ Thuật', totalDays: 32.0, employeeCount: 5, avgDaysPerEmp: 6.4 },
      { department: 'Bộ phận Kho Vận', totalDays: 24.0, employeeCount: 4, avgDaysPerEmp: 6.0 },
      { department: 'Khối Văn Phòng & HR', totalDays: 18.0, employeeCount: 3, avgDaysPerEmp: 6.0 },
    ]
  },

  getLeaveTypeDistribution(_year: number = new Date().getFullYear()): LeaveTypeDistribution[] {
    return [
      { type: 'Nghỉ phép năm', count: 48, days: 98.0, percent: 68.8 },
      { type: 'Nghỉ ốm / Khám bệnh', count: 16, days: 22.5, percent: 15.8 },
      { type: 'Nghỉ việc riêng có lương', count: 8, days: 12.0, percent: 8.4 },
      { type: 'Nghỉ không hưởng lương', count: 4, days: 10.0, percent: 7.0 },
    ]
  },

  getEmployeeLeaveSummaries(
    _year: number = new Date().getFullYear(),
    department?: string
  ): EmployeeLeaveSummaryItem[] {
    const list: EmployeeLeaveSummaryItem[] = [
      {
        employeeId: 'emp-1',
        employeeCode: 'LPVN-0001',
        fullName: 'Trần Văn An',
        department: 'Phòng Sản Xuất',
        entitledDays: 12,
        carriedOverDays: 2,
        totalEntitled: 14,
        usedDays: 6.5,
        remainingDays: 7.5,
        utilizationPercent: 46.4,
      },
      {
        employeeId: 'emp-2',
        employeeCode: 'LPVN-0002',
        fullName: 'Nguyễn Thị Bình',
        department: 'Phòng Kỹ Thuật',
        entitledDays: 14,
        carriedOverDays: 3,
        totalEntitled: 17,
        usedDays: 8.0,
        remainingDays: 9.0,
        utilizationPercent: 47.1,
      },
      {
        employeeId: 'emp-3',
        employeeCode: 'LPVN-0003',
        fullName: 'Lê Hoàng Cường',
        department: 'Bộ phận Kho Vận',
        entitledDays: 12,
        carriedOverDays: 0,
        totalEntitled: 12,
        usedDays: 5.0,
        remainingDays: 7.0,
        utilizationPercent: 41.7,
      },
      {
        employeeId: 'emp-4',
        employeeCode: 'LPVN-0004',
        fullName: 'Phạm Minh Đức',
        department: 'Khối Văn Phòng & HR',
        entitledDays: 15,
        carriedOverDays: 4,
        totalEntitled: 19,
        usedDays: 11.5,
        remainingDays: 7.5,
        utilizationPercent: 60.5,
      },
      {
        employeeId: 'emp-5',
        employeeCode: 'LPVN-0005',
        fullName: 'Hoàng Kim Dung',
        department: 'Phòng Sản Xuất',
        entitledDays: 12,
        carriedOverDays: 1,
        totalEntitled: 13,
        usedDays: 9.0,
        remainingDays: 4.0,
        utilizationPercent: 69.2,
      },
    ]

    if (department && department !== 'ALL') {
      return list.filter((e) => e.department === department)
    }
    return list
  },

  exportToCSV(
    filename: string,
    headers: { label: string; key: string }[],
    rows: Record<string, any>[]
  ): string {
    const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',')
    const dataRows = rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h.key] ?? ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
    )

    // Prepend UTF-8 BOM for Excel Vietnamese compatibility
    const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n')

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return csvContent
  },
}
