import { Card, CardContent } from '@/components/ui/card'
import type { CompanyKPIs } from '@/services/reporting.service'
import { CalendarDays, Percent, DoorOpen, ClipboardCheck, TrendingUp } from 'lucide-react'

export interface ReportMetricsGridProps {
  kpis: CompanyKPIs
}

export function ReportMetricsGrid({ kpis }: ReportMetricsGridProps) {
  const cards = [
    {
      title: 'Tổng Ngày Nghỉ Đã Duyệt',
      value: `${kpis.totalLeaveDaysTaken} ngày`,
      subtext: `Trên tổng số ${kpis.totalActiveEmployees} nhân sự`,
      icon: CalendarDays,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      trend: '+12% so với cùng kỳ',
    },
    {
      title: 'Tỷ Lệ Sử Dụng Phép Năm',
      value: `${kpis.leaveUtilizationRate}%`,
      subtext: 'Mức độ tiêu thụ hạn mức phép',
      icon: Percent,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      trend: 'Tiến độ bình thường',
    },
    {
      title: 'Lượt Ra Cổng Được Cấp',
      value: `${kpis.totalGatePasses} lượt`,
      subtext: '68% công vụ, 32% việc riêng',
      icon: DoorOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      trend: '100% check-in đúng giờ',
    },
    {
      title: 'Phiếu Xác Nhận Ngày Công',
      value: `${kpis.totalAttendanceCorrections} đơn`,
      subtext: 'Đã hoàn tất kiểm tra & duyệt',
      icon: ClipboardCheck,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      trend: '-18% so với tháng trước',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <Card key={i} className="border shadow-xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{c.title}</span>
                <div className={`p-2 rounded-lg ${c.bg}`}>
                  <Icon className={`h-4 w-4 ${c.color}`} />
                </div>
              </div>

              <div>
                <div className="text-xl font-bold tracking-tight text-foreground">{c.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{c.subtext}</div>
              </div>

              <div className="pt-2 border-t flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>{c.trend}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
