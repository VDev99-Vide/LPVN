import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import type { GatePassWithRelations } from '@/services/gate-pass.service'
import { FileText, Check, X } from 'lucide-react'

export interface GatePassTableProps {
  gatePasses: GatePassWithRelations[]
  onViewISO?: (pass: GatePassWithRelations) => void
  onApprove?: (pass: GatePassWithRelations) => void
  onReject?: (pass: GatePassWithRelations) => void
  showApprovalActions?: boolean
}

export function GatePassTable({
  gatePasses,
  onViewISO,
  onApprove,
  onReject,
  showApprovalActions = false,
}: GatePassTableProps) {
  const formatReason = (type: string) => {
    if (type === 'BUSINESS') return 'Công tác (Business)'
    if (type === 'PERSONAL_OR_RESIGNED') return 'Việc riêng / Về sớm'
    return type
  }

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã NV</TableHead>
            <TableHead>Nhân Viên</TableHead>
            <TableHead>Lý Do Ra Cổng</TableHead>
            <TableHead>Ngày Ra</TableHead>
            <TableHead>Khung Giờ</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gatePasses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Không tìm thấy giấy phép ra cổng nào.
              </TableCell>
            </TableRow>
          ) : (
            gatePasses.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-medium">
                  {p.employee?.employee_code || '—'}
                </TableCell>
                <TableCell className="font-medium">
                  {p.employee?.full_name || '—'}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-xs">{formatReason(p.reason_type)}</div>
                  {p.reason_details && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                      {p.reason_details}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{p.pass_date}</TableCell>
                <TableCell className="font-mono text-xs font-semibold">
                  {p.from_time} - {p.to_time}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="text-right space-x-1.5">
                  {onViewISO && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewISO(p)}
                      className="gap-1 h-8"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Mẫu ISO
                    </Button>
                  )}

                  {showApprovalActions && p.status === 'PENDING_APPROVAL' && onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(p)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Duyệt
                    </Button>
                  )}

                  {showApprovalActions && p.status === 'PENDING_APPROVAL' && onReject && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(p)}
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
