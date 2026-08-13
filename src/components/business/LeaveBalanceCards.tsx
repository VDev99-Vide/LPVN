import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'
import { CalendarDays, CheckCircle2, Clock, Palmtree } from 'lucide-react'

export interface LeaveBalanceCardsProps {
  balances: LeaveBalanceWithRelations[]
}

export function LeaveBalanceCards({ balances = [] }: LeaveBalanceCardsProps) {
  const annual = balances.find((b) => b.leave_type?.code === 'ANNUAL') ||
    (balances.length > 0
      ? balances.reduce(
          (acc, curr) => ({
            total_days: acc.total_days + curr.total_days,
            used_days: acc.used_days + curr.used_days,
            pending_days: acc.pending_days + curr.pending_days,
            remaining_days: acc.remaining_days + curr.remaining_days,
          }),
          { total_days: 0, used_days: 0, pending_days: 0, remaining_days: 0 }
        )
      : {
          total_days: 12,
          used_days: 0,
          pending_days: 0,
          remaining_days: 12,
        })

  const stats = [
    {
      label: 'Tổng phép năm',
      value: `${annual.total_days} ngày`,
      desc: 'Quyền hạn năm 2026',
      icon: Palmtree,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Đã sử dụng',
      value: `${annual.used_days} ngày`,
      desc: 'Đã được duyệt',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Đang chờ duyệt',
      value: `${annual.pending_days} ngày`,
      desc: 'Đơn đang xử lý',
      icon: Clock,
      iconColor: 'text-amber-500',
    },
    {
      label: 'Khả dụng còn lại',
      value: `${annual.remaining_days} ngày`,
      desc: 'Sẵn sàng đăng ký',
      icon: CalendarDays,
      iconColor: 'text-indigo-500',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
