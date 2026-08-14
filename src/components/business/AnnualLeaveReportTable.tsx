import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reportingService, type EmployeeLeaveSummaryItem } from '@/services/reporting.service'
import { Download, Search, FileSpreadsheet } from 'lucide-react'

export interface AnnualLeaveReportTableProps {
  data: EmployeeLeaveSummaryItem[]
  year?: number
}

export function AnnualLeaveReportTable({
  data,
  year = new Date().getFullYear(),
}: AnnualLeaveReportTableProps) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')

  const departments = ['ALL', ...Array.from(new Set(data.map((d) => d.department)))]

  const filtered = data.filter((item) => {
    const matchDept = selectedDept === 'ALL' || item.department === selectedDept
    const matchSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  const handleExportCSV = () => {
    const headers = [
      { label: 'Mã Nhân Viên', key: 'employeeCode' },
      { label: 'Họ Và Tên', key: 'fullName' },
      { label: 'Phòng Ban', key: 'department' },
      { label: 'Hạn Mức Năm', key: 'entitledDays' },
      { label: 'Phép Tồn Năm Trước', key: 'carriedOverDays' },
      { label: 'Tổng Phép Được Nghỉ', key: 'totalEntitled' },
      { label: 'Đã Sử Dụng (Ngày)', key: 'usedDays' },
      { label: 'Số Dư Còn Lại (Ngày)', key: 'remainingDays' },
      { label: 'Tỷ Lệ Tiêu Thụ (%)', key: 'utilizationPercent' },
    ]
    reportingService.exportToCSV(`Bao_Cao_Phep_Nam_LPVN_${year}`, headers, filtered)
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold">Báo Cáo Tổng Hợp Số Dư Phép Năm {year}</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Bảng theo dõi hạn mức, số ngày đã nghỉ và số dư phép còn lại của từng nhân sự
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

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc mã nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Bộ phận:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs p-1.5 rounded-md border bg-background text-foreground h-8"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'Tất cả phòng ban' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-[11px]">
                <TableHead>Mã NV</TableHead>
                <TableHead>Họ và Tên</TableHead>
                <TableHead>Phòng Ban</TableHead>
                <TableHead className="text-right">Hạn Mức</TableHead>
                <TableHead className="text-right">Tồn Năm Cũ</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tổng Được Nghỉ</TableHead>
                <TableHead className="text-right text-destructive font-semibold">Đã Dùng</TableHead>
                <TableHead className="text-right text-emerald-600 font-bold">Còn Lại</TableHead>
                <TableHead className="text-right">Tiêu Thụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">
                    Không tìm thấy nhân viên phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emp) => (
                  <TableRow key={emp.employeeId} className="text-xs">
                    <TableCell className="font-mono font-bold">{emp.employeeCode}</TableCell>
                    <TableCell className="font-medium text-foreground">{emp.fullName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {emp.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{emp.entitledDays}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{emp.carriedOverDays}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{emp.totalEntitled}</TableCell>
                    <TableCell className="text-right font-mono text-destructive font-semibold">{emp.usedDays}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600 font-bold">{emp.remainingDays}</TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      <span
                        className={
                          emp.utilizationPercent > 70
                            ? 'text-destructive font-bold'
                            : emp.utilizationPercent > 40
                            ? 'text-amber-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {emp.utilizationPercent}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
