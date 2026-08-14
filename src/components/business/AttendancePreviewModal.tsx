import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AttendanceConfirmationISO, type AttendanceConfirmationData } from '@/components/documents/AttendanceConfirmationISO'
import type { AttendanceWithRelations } from '@/services/attendance.service'
import { Printer } from 'lucide-react'

interface AttendancePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  attendance: AttendanceWithRelations | null
}

export function AttendancePreviewModal({
  isOpen,
  onClose,
  attendance,
}: AttendancePreviewModalProps) {
  if (!attendance) return null

  const isoData: AttendanceConfirmationData = {
    document_no: attendance.document_no || 'LPVN-HR-F-0008',
    version: '1.0',
    full_name: attendance.employee?.full_name || '—',
    employee_code: attendance.employee?.employee_code || '—',
    department: 'Bộ phận LPVN',
    reason: attendance.reason,
    confirmation_date: attendance.confirmation_date,
    from_time: attendance.from_time,
    to_time: attendance.to_time,
    submission_date: attendance.created_at
      ? new Date(attendance.created_at).toLocaleDateString('vi-VN')
      : '',
    approval_date: attendance.approved_at
      ? new Date(attendance.approved_at).toLocaleDateString('vi-VN')
      : '',
    checker_name: attendance.checker?.full_name,
    manager_name: attendance.approver?.full_name,
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <DialogTitle>Xem Trước Phiếu Xác Nhận Ngày Công (LPVN-HR-F-0008)</DialogTitle>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            In Phiếu ISO
          </Button>
        </DialogHeader>

        <div className="py-2 overflow-x-auto bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md">
          <AttendanceConfirmationISO data={isoData} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
