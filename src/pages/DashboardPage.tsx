import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/business/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const KPIS = [
  { label: 'Đơn chờ duyệt (Supply Chain)', value: '5', color: 'border-l-[#EF6C4A]' },
  { label: 'Nhân sự nghỉ trong tháng', value: '8 người', color: 'border-l-[#3CC4BD]' },
  { label: 'Tổng số ngày nghỉ (Tháng 8)', value: '14.5 ngày', color: 'border-l-[#FFD23F]' },
  { label: 'Nhân sự phòng Supply Chain', value: '24', color: 'border-l-[#5DADE2]' },
]

const TOP_RANK_LEAVE = [
  { rank: 1, name: 'Nguyễn Văn A', code: 'LPVN-0231', totalDays: 4.5, annual: 2.0, sick: 2.5, unpaid: 0, status: 'Đang theo dõi' },
  { rank: 2, name: 'Phạm Thị D', code: 'LPVN-0145', totalDays: 3.0, annual: 3.0, sick: 0, unpaid: 0, status: 'Bình thường' },
  { rank: 3, name: 'Vũ Hoàng E', code: 'LPVN-0312', totalDays: 2.5, annual: 1.0, sick: 1.5, unpaid: 0, status: 'Có giấy khám' },
  { rank: 4, name: 'Lê Văn C', code: 'LPVN-0090', totalDays: 2.0, annual: 2.0, sick: 0, unpaid: 0, status: 'Bình thường' },
  { rank: 5, name: 'Đỗ Minh T', code: 'LPVN-0402', totalDays: 1.5, annual: 0.5, sick: 1.0, unpaid: 0, status: 'Có giấy khám' },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Nguyễn Văn A', type: 'Đơn Xin Nghỉ Phép', date: '10/08/2026', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Trần Thị B', type: 'Giấy Phép Ra Cổng', date: '11/08/2026', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Lê Văn C', type: 'Xác Nhận Ngày Công', date: '12/08/2026', status: 'REJECTED' },
]

export function DashboardPage() {
  const { currentRole } = useAuth()
  const isSupervisorOrAdmin = currentRole === 'SUPERVISOR' || currentRole === 'ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
            Tổng quan (Dashboard) · Phòng Supply Chain
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Báo cáo tiến độ duyệt đơn, thống kê vắng mặt và xếp hạng nghỉ phép nội bộ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F6F5] text-[#1E8C86] dark:bg-teal-950/60 dark:text-teal-300 border border-[#3CC4BD]/40">
            Tháng 08 / 2026
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
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

      {/* TOP RANK LEAVE TABLE FOR SUPERVISOR / ADMIN */}
      {isSupervisorOrAdmin && (
        <Card className="rounded-2xl shadow-xs border">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FFF8E7] text-[#8A6300]">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">
                    Top Rank Nghỉ Phép Nhân Sự (Supply Chain)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Theo dõi nhân viên nghỉ nhiều nhất trong tháng theo Phép Năm &amp; Phép Bệnh
                  </CardDescription>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Đặc quyền: Supervisor &amp; Admin
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-dashed">
                  <TableHead className="text-xs uppercase font-bold text-center w-12">Hạng</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Nhân Viên</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Mã NV</TableHead>
                  <TableHead className="text-xs uppercase font-bold text-center">Tổng Số Ngày Nghỉ</TableHead>
                  <TableHead className="text-xs uppercase font-bold text-center">Phép Năm (Ngày)</TableHead>
                  <TableHead className="text-xs uppercase font-bold text-center">Nghỉ Ốm (Ngày)</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Ghi Chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_RANK_LEAVE.map((item) => (
                  <TableRow key={item.code} className="hover:bg-[#E8F6F5]/40 transition-colors">
                    <TableCell className="text-center font-bold">
                      {item.rank === 1 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFD23F] text-[#3A2B00] text-xs shadow-xs">🥇</span>}
                      {item.rank === 2 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-neutral-800 text-xs">🥈</span>}
                      {item.rank === 3 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600/20 text-amber-800 text-xs">🥉</span>}
                      {item.rank > 3 && <span className="text-xs text-muted-foreground font-semibold">#{item.rank}</span>}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">{item.name}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.code}</TableCell>
                    <TableCell className="text-xs font-extrabold text-center text-[#EF6C4A]">
                      {item.totalDays} ngày
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-center text-[#1E8C86]">
                      {item.annual}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-center text-amber-700">
                      {item.sick}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 dark:bg-muted font-medium">
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Panel */}
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
