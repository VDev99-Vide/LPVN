import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

export interface LeaveBalanceTableProps {
  balances: LeaveBalanceWithRelations[]
  onAdjustEntitlement: (balance: LeaveBalanceWithRelations) => void
  loading?: boolean
  itemsPerPage?: number
}

export function LeaveBalanceTable({
  balances = [],
  onAdjustEntitlement,
  loading = false,
  itemsPerPage = 10,
}: LeaveBalanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(balances.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBalances = balances.slice(startIndex, startIndex + itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ và Tên</TableHead>
              <TableHead>Loại Phép</TableHead>
              <TableHead className="text-right">Tổng Quỹ</TableHead>
              <TableHead className="text-right">Đã Dùng</TableHead>
              <TableHead className="text-right">Chờ Duyệt</TableHead>
              <TableHead className="text-right">Còn Lại</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : paginatedBalances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy dữ liệu phép nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedBalances.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono font-medium">
                    {b.employee?.employee_code || '—'}
                  </TableCell>
                  <TableCell className="font-medium">{b.employee?.full_name || '—'}</TableCell>
                  <TableCell>{b.leave_type?.name || 'Nghỉ phép năm'}</TableCell>
                  <TableCell className="text-right font-mono">{b.total_days}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {b.used_days}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {b.pending_days}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">
                    {b.remaining_days}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onAdjustEntitlement(b)}>
                      Điều Chỉnh
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {balances.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, balances.length)} trên tổng số {balances.length} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
