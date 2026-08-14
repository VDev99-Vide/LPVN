import { LeaveApplicationISO, type LeaveApplicationData } from '@/components/documents/LeaveApplicationISO'
import { GatePassISO, type GatePassData } from '@/components/documents/GatePassISO'
import { AttendanceConfirmationISO, type AttendanceConfirmationData } from '@/components/documents/AttendanceConfirmationISO'

export interface DocumentRendererProps {
  documentType: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION' | string
  data: Record<string, any>
  zoomLevel?: number
}

export function DocumentRenderer({
  documentType,
  data,
  zoomLevel = 100,
}: DocumentRendererProps) {
  const isType = (code: string) =>
    documentType.toUpperCase().includes(code.toUpperCase())

  const scale = zoomLevel / 100

  return (
    <div
      className="flex justify-center p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-x-auto print:p-0 print:bg-white"
      style={{ minHeight: '600px' }}
    >
      <div
        className="transition-transform origin-top print:scale-100"
        style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
      >
        {isType('LEAVE') || isType('0013') ? (
          <LeaveApplicationISO data={data as LeaveApplicationData} />
        ) : isType('GATE_PASS') || isType('0014') ? (
          <GatePassISO data={data as GatePassData} />
        ) : isType('ATTENDANCE') || isType('0008') ? (
          <AttendanceConfirmationISO data={data as AttendanceConfirmationData} />
        ) : (
          <div className="p-8 text-center text-muted-foreground border rounded bg-card">
            Không tìm thấy mẫu hiển thị phù hợp cho loại tài liệu: {documentType}
          </div>
        )}
      </div>
    </div>
  )
}
