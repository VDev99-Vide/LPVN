import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { MonthlyLeaveData, DepartmentLeaveData, LeaveTypeDistribution } from '@/services/reporting.service'
import { BarChart3, PieChart, Building2 } from 'lucide-react'

export interface ReportChartsProps {
  monthlyTrend: MonthlyLeaveData[]
  departmentData: DepartmentLeaveData[]
  leaveTypeData: LeaveTypeDistribution[]
}

export function ReportCharts({
  monthlyTrend,
  departmentData,
  leaveTypeData,
}: ReportChartsProps) {
  const maxMonthly = Math.max(...monthlyTrend.map((m) => m.days), 1)
  const maxDept = Math.max(...departmentData.map((d) => d.totalDays), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 1. Monthly Leave Trend (Bar Chart) */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold">Xu Hướng Nghỉ Phép Theo Tháng</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Tổng số ngày nghỉ toàn công ty ghi nhận theo từng tháng trong năm
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-end justify-between gap-1.5 h-44 pt-6 pb-2 border-b border-muted">
            {monthlyTrend.map((item) => {
              const heightPercent = Math.round((item.days / maxMonthly) * 100)
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.days}
                  </div>
                  <div className="w-full bg-muted/60 rounded-t-sm relative flex items-end justify-center h-28">
                    <div
                      className="w-full bg-primary/80 hover:bg-primary rounded-t-sm transition-all duration-500"
                      style={{ height: `${heightPercent}%`, minHeight: item.days > 0 ? '4px' : '0px' }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{item.monthName}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Department Breakdown */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold">Phân Bổ Nghỉ Theo Phòng Ban</CardTitle>
          </div>
          <CardDescription className="text-xs">
            So sánh số ngày nghỉ và bình quân ngày/người giữa các bộ phận
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3.5">
          {departmentData.map((dept) => {
            const widthPercent = Math.round((dept.totalDays / maxDept) * 100)
            return (
              <div key={dept.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{dept.department}</span>
                  <span className="font-mono text-muted-foreground font-semibold">
                    {dept.totalDays} ngày ({dept.avgDaysPerEmp} ngày/NV)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 3. Leave Type Composition (Full width on bottom if needed or 2 cols) */}
      <Card className="border shadow-xs lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold">Cơ Cấu Các Loại Hình Nghỉ</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Tỷ lệ phần trăm giữa phép năm, nghỉ ốm, việc riêng và các chế độ khác
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaveTypeData.map((item) => (
              <div
                key={item.type}
                className="p-3 rounded-lg border bg-muted/20 flex flex-col justify-between gap-2"
              >
                <div className="text-xs font-semibold text-foreground">{item.type}</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary font-mono">{item.percent}%</span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {item.days} ngày ({item.count} đơn)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
