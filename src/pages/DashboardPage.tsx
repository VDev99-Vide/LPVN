import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusBadge } from '@/components/business/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock } from 'lucide-react'

const KPIS = [
  { label: 'Đơn của tôi đang chờ duyệt', value: '3', color: 'border-l-[#3CC4BD]' },
  { label: 'Đơn đã được duyệt', value: '18', color: 'border-l-[#FFD23F]' },
  { label: 'Ngày phép năm còn lại', value: '10.5', color: 'border-l-[#5DADE2]' },
  { label: 'Đơn cần bạn duyệt', value: '5', color: 'border-l-[#EF6C4A]' },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Nguyễn Văn A', type: 'Đơn Xin Nghỉ Phép', date: '10/08/2026', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Trần Thị B', type: 'Giấy Phép Ra Cổng', date: '11/08/2026', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Lê Văn C', type: 'Xác Nhận Ngày Công', date: '12/08/2026', status: 'REJECTED' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
            Tổng quan (Dashboard)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chào mừng trở lại. Đây là tình trạng đơn từ và quy trình phê duyệt hiện tại của bạn.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards from Template.html */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-card rounded-2xl p-5 shadow-xs border border-border border-l-6 ${kpi.color} space-y-1`}
          >
            <div className="text-3xl font-extrabold text-[#1E8C86] dark:text-[#3CC4BD]">
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Panel matching Template.html */}
      <Card className="rounded-2xl shadow-xs border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8F6F5] dark:bg-muted text-[#1E8C86] dark:text-[#3CC4BD]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Hoạt Động Gần Đây</CardTitle>
              <CardDescription className="text-xs">Theo dõi tiến độ duyệt các đơn từ mới nhất</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-dashed">
                <TableHead className="text-xs uppercase font-bold">Mã Đơn</TableHead>
                <TableHead className="text-xs uppercase font-bold">Người Gửi</TableHead>
                <TableHead className="text-xs uppercase font-bold">Loại Đơn</TableHead>
                <TableHead className="text-xs uppercase font-bold">Ngày Gửi</TableHead>
                <TableHead className="text-xs uppercase font-bold">Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PENDING_REQUESTS.map((request) => (
                <TableRow key={request.id} className="hover:bg-[#E8F6F5]/50 dark:hover:bg-muted/40 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-foreground">{request.id}</TableCell>
                  <TableCell className="text-xs font-medium">{request.employee}</TableCell>
                  <TableCell className="text-xs">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8F6F5] text-[#1E8C86] dark:bg-teal-950/60 dark:text-teal-300">
                      {request.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{request.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
