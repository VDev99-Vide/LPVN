import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportMetricsGrid } from '@/components/business/ReportMetricsGrid'
import { ReportCharts } from '@/components/business/ReportCharts'
import { AnnualLeaveReportTable } from '@/components/business/AnnualLeaveReportTable'
import { GatePassReportTable } from '@/components/business/GatePassReportTable'
import { reportingService } from '@/services/reporting.service'
import { BarChart3, Calendar, FileSpreadsheet, DoorOpen, Sparkles } from 'lucide-react'

export function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2026)

  const kpis = reportingService.getCompanyKPIs(selectedYear)
  const monthlyTrend = reportingService.getMonthlyLeaveTrend(selectedYear)
  const departmentData = reportingService.getDepartmentBreakdown(selectedYear)
  const leaveTypeData = reportingService.getLeaveTypeDistribution(selectedYear)
  const employeeSummaries = reportingService.getEmployeeLeaveSummaries(selectedYear)

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Báo Cáo & Phân Tích Dữ Liệu</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng hợp chỉ số nhân sự, xu hướng nghỉ phép, lưu lượng ra cổng và xuất dữ liệu Excel/CSV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card border rounded-md px-3 py-1.5 shadow-xs">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Năm báo cáo:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-bold bg-transparent border-0 focus:ring-0 p-0 text-foreground cursor-pointer"
            >
              <option value={2026}>2026 (Năm hiện tại)</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Tổng Quan Thống Kê
          </TabsTrigger>
          <TabsTrigger value="leave" className="gap-1.5 text-xs sm:text-sm">
            <FileSpreadsheet className="h-4 w-4" />
            Báo Cáo Phép Năm
          </TabsTrigger>
          <TabsTrigger value="gatepass" className="gap-1.5 text-xs sm:text-sm">
            <DoorOpen className="h-4 w-4" />
            Ra Cổng & Chấm Công
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Charts */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <ReportMetricsGrid kpis={kpis} />
          <ReportCharts
            monthlyTrend={monthlyTrend}
            departmentData={departmentData}
            leaveTypeData={leaveTypeData}
          />
        </TabsContent>

        {/* Tab 2: Annual Leave Table */}
        <TabsContent value="leave" className="mt-4 space-y-4">
          <AnnualLeaveReportTable data={employeeSummaries} year={selectedYear} />
        </TabsContent>

        {/* Tab 3: Gate Pass & Attendance */}
        <TabsContent value="gatepass" className="mt-4 space-y-4">
          <GatePassReportTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
