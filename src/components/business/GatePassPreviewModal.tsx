import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { GatePassISO, type GatePassData } from '@/components/documents/GatePassISO'
import type { GatePassWithRelations } from '@/services/gate-pass.service'
import { Printer } from 'lucide-react'

interface GatePassPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  gatePass: GatePassWithRelations | null
}

export function GatePassPreviewModal({
  isOpen,
  onClose,
  gatePass,
}: GatePassPreviewModalProps) {
  if (!gatePass) return null

  const d = new Date(gatePass.pass_date || new Date())
  const isoData: GatePassData = {
    document_no: gatePass.document_no || 'LPVN-HR-F-0014',
    version: '1.0',
    full_name: gatePass.employee?.full_name || '—',
    employee_code: gatePass.employee?.employee_code || '—',
    department: 'Bộ phận LPVN',
    reason_type: gatePass.reason_type,
    from_time: gatePass.from_time,
    to_time: gatePass.to_time,
    accompanied_items: gatePass.accompanied_items || '',
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    submission_date: gatePass.created_at ? new Date(gatePass.created_at).toLocaleDateString('vi-VN') : '',
    approval_date: gatePass.approved_at ? new Date(gatePass.approved_at).toLocaleDateString('vi-VN') : '',
    manager_name: gatePass.approver?.full_name,
    security_out_time: gatePass.security_out_time ? new Date(gatePass.security_out_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
    security_in_time: gatePass.security_in_time ? new Date(gatePass.security_in_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
    security_notes: gatePass.security_notes || '',
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <DialogTitle>Xem Trước Biểu Mẫu ISO (LPVN-HR-F-0014)</DialogTitle>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            In Biểu Mẫu
          </Button>
        </DialogHeader>

        <div className="py-2 overflow-x-auto bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md">
          <GatePassISO data={isoData} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
