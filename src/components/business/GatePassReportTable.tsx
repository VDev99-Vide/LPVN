import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reportingService } from '@/services/reporting.service'
import { Download, DoorOpen } from 'lucide-react'

export interface GatePassStatItem {
  department: string
  totalPasses: number
  businessPasses: number
  personalPasses: number
  onTimeReturnRate: number
  attendanceCorrections: number
}

export function GatePassReportTable() {
  const [stats] = useState<GatePassStatItem[]>([
    {
      department: 'Phòng Sản Xuất',
      totalPasses: 42,
      businessPasses: 28,
      personalPasses: 14,
      onTimeReturnRate: 97.6,
      attendanceCorrections: 18,
    },
    {
      department: 'Phòng Kỹ Thuật',
      totalPasses: 22,
      businessPasses: 18,
      personalPasses: 4,
      onTimeReturnRate: 100,
      attendanceCorrections: 6,
    },
    {
      department: 'Bộ phận Kho Vận',
      totalPasses: 16,
      businessPasses: 12,
      personalPasses: 4,
      onTimeReturnRate: 100,
      attendanceCorrections: 7,
    },
    {
      department: 'Khối Văn Phòng & HR',
      totalPasses: 6,
      businessPasses: 4,
      personalPasses: 2,
      onTimeReturnRate: 100,
      attendanceCorrections: 3,
    },
  ])

  const handleExportCSV = () => {
    const headers = [
      { label: 'Phòng Ban', key: 'department' },
      { label: 'Tổng Lượt Ra Cổng', key: 'totalPasses' },
      { label: 'Công Vụ (Lượt)', key: 'businessPasses' },
      { label: 'Việc Riêng (Lượt)', key: 'personalPasses' },
      { label: 'Tỷ Lệ Đúng Giờ (%)', key: 'onTimeReturnRate' },
      { label: 'Giải Trình Chấm Công (Đơn)', key: 'attendanceCorrections' },
    ]
    reportingService.exportToCSV('Bao_Cao_Ra_Cong_Va_Cham_Cong_LPVN', headers, stats)
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold">Thống Kê Ra Cổng & Xác Nhận Công</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Tổng hợp lưu lượng nhân viên ra vào cổng và tần suất điều chỉnh chấm công theo phòng ban
          </CardDescription>
        </div>

        <Button
          size="sm"
          onClick={handleExportCSV}
          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Xuất Báo Cáo Excel/CSV
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-[11px]">
                <TableHead>Phòng Ban</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tổng Lượt Ra Cổng</TableHead>
                <TableHead className="text-right text-blue-600">Công Vụ</TableHead>
                <TableHead className="text-right text-amber-600">Việc Riêng</TableHead>
                <TableHead className="text-right text-emerald-600">Đúng Giờ (%)</TableHead>
                <TableHead className="text-right">Giải Trình Công</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((row) => (
                <TableRow key={row.department} className="text-xs">
                  <TableCell className="font-medium text-foreground">{row.department}</TableCell>
                  <TableCell className="text-right font-mono font-bold">{row.totalPasses}</TableCell>
                  <TableCell className="text-right font-mono text-blue-600 font-semibold">{row.businessPasses}</TableCell>
                  <TableCell className="text-right font-mono text-amber-600">{row.personalPasses}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-600 font-bold">
                    <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                      {row.onTimeReturnRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-purple-600 font-medium">
                    {row.attendanceCorrections} đơn
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
