import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/business/StatusBadge'
import { LeaveApplicationISO, type LeaveApplicationData } from '@/components/documents/LeaveApplicationISO'
import { GatePassISO, type GatePassData } from '@/components/documents/GatePassISO'
import { AttendanceConfirmationISO, type AttendanceConfirmationData } from '@/components/documents/AttendanceConfirmationISO'
import { FileText, Printer, Plus, Eye, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface MyRequestItem {
  id: string
  docType: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE'
  typeLabel: string
  submitDate: string
  details: string
  status: 'SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  managerName?: string
  approvalDate?: string
  isoData: LeaveApplicationData | GatePassData | AttendanceConfirmationData
}

export function MyRequestsPage() {
  const { activeUser } = useAuth()
  const [selectedDoc, setSelectedDoc] = useState<MyRequestItem | null>(null)

  const [requests] = useState<MyRequestItem[]>([
    {
      id: 'LV-2026-001',
      docType: 'LEAVE',
      typeLabel: 'Đơn Xin Nghỉ Phép',
      submitDate: '10/08/2026',
      details: 'Nghỉ phép năm · 1 ngày (10/08/2026)',
      status: 'APPROVED',
      managerName: 'Lê Văn C',
      approvalDate: '10/08/2026',
      isoData: {
        document_no: 'LPVN-HR-F-0013',
        full_name: activeUser.name,
        employee_code: activeUser.code,
        department: activeUser.dept,
        position: activeUser.position,
        leave_type: 'ANNUAL',
        total_days: 1,
        leave_from_date: '2026-08-10',
        leave_to_date: '2026-08-10',
        annual_leave_entitled: activeUser.leaveEntitled,
        annual_leave_applied: 1,
        annual_leave_remain: activeUser.leaveEntitled - activeUser.leaveUsed,
        submission_date: '10/08/2026',
        approval_date: '10/08/2026',
        manager_name: 'Lê Văn C (Team Leader)',
      } as LeaveApplicationData,
    },
    {
      id: 'GP-2026-014',
      docType: 'GATE_PASS',
      typeLabel: 'Giấy Phép Ra Cổng',
      submitDate: '11/08/2026',
      details: 'Công tác giao nhận mẫu linh kiện Supply Chain (10:00 - 14:00)',
      status: 'PENDING_APPROVAL',
      isoData: {
        document_no: 'LPVN-HR-F-0014',
        full_name: activeUser.name,
        employee_code: activeUser.code,
        department: activeUser.dept,
        reason_type: 'BUSINESS',
        from_time: '10:00',
        to_time: '14:00',
        accompanied_items: 'Laptop Dell, bộ chứng từ kho Supply Chain',
        other_reason_details: 'Kiểm kê kho vệ tinh và giao chứng từ đối tác',
        submission_date: '11/08/2026',
      } as GatePassData,
    },
    {
      id: 'AC-2026-009',
      docType: 'ATTENDANCE',
      typeLabel: 'Xác Nhận Ngày Công',
      submitDate: '12/08/2026',
      details: 'Quên quẹt thẻ ca sáng ngày 12/08/2026',
      status: 'SUBMITTED',
      isoData: {
        document_no: 'LPVN-HR-F-0008',
        full_name: activeUser.name,
        employee_code: activeUser.code,
        department: activeUser.dept,
        reason: 'Quên quẹt thẻ ca sáng ngày 12/08 do máy quét bảo trì',
        confirmation_date: '2026-08-12',
        from_time: '08:00',
        to_time: '17:00',
        submission_date: '12/08/2026',
      } as AttendanceConfirmationData,
    },
  ])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with New Request CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
            Đơn Của Tôi (My Requests)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi tiến độ duyệt các đơn từ đã gửi của bạn tại phòng Supply Chain.
          </p>
        </div>

        <Button
          onClick={() => {
            if (typeof window !== 'undefined') window.location.href = '/new-request'
          }}
          className="text-xs h-10 px-5 font-bold rounded-full btn-gold gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Đơn Mới</span>
        </Button>
      </div>

      {/* Requests Table */}
      <Card className="rounded-2xl shadow-xs border">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-bold">Danh Sách Đơn Đã Nộp</CardTitle>
          <CardDescription className="text-xs">
            Tổng cộng <strong>{requests.length} đơn</strong> trong kỳ làm việc hiện tại
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-dashed">
                <TableHead className="text-xs uppercase font-bold">Mã Đơn</TableHead>
                <TableHead className="text-xs uppercase font-bold">Loại Đơn</TableHead>
                <TableHead className="text-xs uppercase font-bold">Ngày Gửi</TableHead>
                <TableHead className="text-xs uppercase font-bold">Nội Dung Chi Tiết</TableHead>
                <TableHead className="text-xs uppercase font-bold">Trạng Thái</TableHead>
                <TableHead className="text-xs uppercase font-bold text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-[#E8F6F5]/40 dark:hover:bg-muted/40 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-[#1E8C86] dark:text-teal-300">
                    {req.id}
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8F6F5] text-[#1E8C86] dark:bg-teal-950/60 dark:text-teal-300">
                      {req.typeLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.submitDate}</TableCell>
                  <TableCell className="text-xs max-w-[280px] truncate font-medium text-foreground">
                    {req.details}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDoc(req)}
                      className="text-xs h-8 rounded-lg gap-1.5 border-[#3CC4BD]/40 text-[#1E8C86] dark:text-[#3CC4BD] hover:bg-[#E8F6F5]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Xem &amp; In ISO</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ISO Document Preview & Print Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card text-card-foreground rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between bg-[#E8F6F5] dark:bg-muted/60">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#1E8C86] dark:text-[#3CC4BD]" />
                <h2 className="text-sm font-bold text-foreground">
                  Biểu Mẫu Chuẩn ISO: {selectedDoc.id} ({selectedDoc.typeLabel})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  className="text-xs h-8 px-4 font-bold rounded-full btn-gold gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>In Bản ISO / PDF</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoc(null)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Body with Rendered Document */}
            <div className="p-6 overflow-y-auto bg-neutral-100 dark:bg-neutral-900 flex justify-center">
              {selectedDoc.docType === 'LEAVE' && (
                <LeaveApplicationISO data={selectedDoc.isoData as LeaveApplicationData} />
              )}
              {selectedDoc.docType === 'GATE_PASS' && (
                <GatePassISO data={selectedDoc.isoData as GatePassData} />
              )}
              {selectedDoc.docType === 'ATTENDANCE' && (
                <AttendanceConfirmationISO data={selectedDoc.isoData as AttendanceConfirmationData} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
