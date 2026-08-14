import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import type { AttendanceWithRelations } from '@/services/attendance.service'
import { FileText, Check, X } from 'lucide-react'

export interface AttendanceTableProps {
  attendances: AttendanceWithRelations[]
  onViewISO?: (att: AttendanceWithRelations) => void
  onApprove?: (att: AttendanceWithRelations) => void
  onReject?: (att: AttendanceWithRelations) => void
  showApprovalActions?: boolean
}

export function AttendanceTable({
  attendances,
  onViewISO,
  onApprove,
  onReject,
  showApprovalActions = false,
}: AttendanceTableProps) {
  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã NV</TableHead>
            <TableHead>Nhân Viên</TableHead>
            <TableHead>Lý Do Xác Nhận</TableHead>
            <TableHead>Ngày Cần Xác Nhận</TableHead>
            <TableHead>Khung Giờ</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Không tìm thấy phiếu xác nhận ngày công nào.
              </TableCell>
            </TableRow>
          ) : (
            attendances.map((att) => (
              <TableRow key={att.id}>
                <TableCell className="font-mono font-medium">
                  {att.employee?.employee_code || '—'}
                </TableCell>
                <TableCell className="font-medium">
                  {att.employee?.full_name || '—'}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-xs truncate max-w-xs">{att.reason}</div>
                  {att.notes && (
                    <div className="text-[11px] text-muted-foreground italic">
                      Ghi chú: {att.notes}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{att.confirmation_date}</TableCell>
                <TableCell className="font-mono text-xs font-semibold">
                  {att.from_time} - {att.to_time}
                </TableCell>
                <TableCell>
                  <StatusBadge status={att.status} />
                </TableCell>
                <TableCell className="text-right space-x-1.5">
                  {onViewISO && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewISO(att)}
                      className="gap-1 h-8"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Mẫu ISO
                    </Button>
                  )}

                  {showApprovalActions && att.status === 'PENDING_APPROVAL' && onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(att)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Duyệt
                    </Button>
                  )}

                  {showApprovalActions && att.status === 'PENDING_APPROVAL' && onReject && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(att)}
                      className="gap-1 h-8"
                    >
                      <X className="h-3.5 w-3.5" />
                      Từ Chối
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
