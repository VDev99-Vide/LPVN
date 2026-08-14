import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import type { AttendanceWithRelations } from '@/services/attendance.service'
import { FileText, ClipboardCheck, CheckCircle2 } from 'lucide-react'

export interface AttendanceHRReviewTableProps {
  attendances: AttendanceWithRelations[]
  onRecordHR: (att: AttendanceWithRelations) => Promise<void>
  onViewISO: (att: AttendanceWithRelations) => void
}

export function AttendanceHRReviewTable({
  attendances,
  onRecordHR,
  onViewISO,
}: AttendanceHRReviewTableProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const approvedList = attendances.filter(
    (a) => a.status === 'APPROVED' || a.status === 'HR_RECORDED'
  )

  const pendingHRCount = attendances.filter((a) => a.status === 'APPROVED').length

  const handleRecord = async (att: AttendanceWithRelations) => {
    setProcessingId(att.id)
    try {
      await onRecordHR(att)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-base font-bold">
                  Hàng Đợi Chấm Công Phòng Nhân Sự (HR Queue)
                </CardTitle>
                <CardDescription className="text-xs">
                  Sau khi Trưởng bộ phận duyệt, HR ghi nhận vào bảng tính công tháng.
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-primary">
                {pendingHRCount}
              </div>
              <div className="text-[11px] text-muted-foreground">Phiếu chờ cập nhật công</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Ngày Cần Ghi Nhận</TableHead>
                  <TableHead>Khung Giờ</TableHead>
                  <TableHead>Người Duyệt</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác HR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Không có phiếu nào cần HR xử lý chấm công.
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedList.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell className="font-mono font-medium">
                        {att.employee?.employee_code || '—'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {att.employee?.full_name || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{att.confirmation_date}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">
                        {att.from_time} - {att.to_time}
                      </TableCell>
                      <TableCell className="text-xs">
                        {att.approver?.full_name || 'Quản lý'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={att.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewISO(att)}
                          className="gap-1 h-8 text-xs"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Phiếu ISO
                        </Button>

                        {att.status === 'APPROVED' && (
                          <Button
                            size="sm"
                            disabled={processingId === att.id}
                            onClick={() => handleRecord(att)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8 text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Đã Chấm Công
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
