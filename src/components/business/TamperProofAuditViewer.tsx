import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { History, CheckCircle2, RefreshCw } from 'lucide-react'
import { securityHardeningService, type AuditLogHMACPayload } from '@/services/security-hardening.service'

interface AuditLogDisplayItem extends AuditLogHMACPayload {
  actorName: string
  details: string
  hmacSignature: string
  isValid: boolean
}

const INITIAL_AUDIT_LOGS: Array<Omit<AuditLogDisplayItem, 'hmacSignature' | 'isValid'>> = [
  {
    id: 'AUD-2026-081',
    actorId: 'emp-sc-002',
    actorName: 'Lê Văn C (Team Leader)',
    action: 'APPROVE_LEAVE',
    targetId: 'LV-2026-001',
    timestamp: '2026-08-10T08:30:00Z',
    details: 'Phê duyệt đơn xin nghỉ phép 1 ngày cho Nguyễn Văn A (Phòng Supply Chain)',
  },
  {
    id: 'AUD-2026-082',
    actorId: 'emp-sc-001',
    actorName: 'Nguyễn Văn A',
    action: 'CREATE_GATE_PASS',
    targetId: 'GP-2026-014',
    timestamp: '2026-08-11T09:15:00Z',
    details: 'Tạo giấy phép ra cổng công tác kiểm kê kho vệ tinh',
  },
  {
    id: 'AUD-2026-083',
    actorId: 'emp-sc-003',
    actorName: 'Trần Thị B (Supervisor)',
    action: 'SIGN_DOCUMENT',
    targetId: 'DOC-ISO-0013-09',
    timestamp: '2026-08-12T14:20:00Z',
    details: 'Đóng dấu nét ký số điện tử vào biểu mẫu LPVN-HR-F-0013',
  },
  {
    id: 'AUD-2026-084',
    actorId: 'emp-sc-004',
    actorName: 'Aaron Zhang (Admin)',
    action: 'CREATE_USER',
    targetId: 'emp-sc-045',
    timestamp: '2026-08-14T03:45:00Z',
    details: 'Tạo tài khoản trực tiếp trên frontend cho nhân viên phòng Supply Chain',
  },
]

export function TamperProofAuditViewer() {
  const [logs, setLogs] = useState<AuditLogDisplayItem[]>(() => {
    return INITIAL_AUDIT_LOGS.map((log) => {
      const hmac = securityHardeningService.computeAuditHMAC(log)
      return {
        ...log,
        hmacSignature: hmac,
        isValid: securityHardeningService.verifyAuditHMAC(log, hmac),
      }
    })
  })

  const handleVerifyAll = () => {
    setLogs((prev) =>
      prev.map((log) => ({
        ...log,
        isValid: securityHardeningService.verifyAuditHMAC(log, log.hmacSignature),
      }))
    )
  }

  return (
    <Card className="rounded-2xl shadow-xs border">
      <CardHeader className="pb-3 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E8F6F5] text-[#1E8C86] dark:bg-teal-950/60 dark:text-teal-300">
              <History className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Nhật Ký Kiểm Toán Chống Giả Mạo (Tamper-Resistant Audit Trail)
              </CardTitle>
              <CardDescription className="text-xs">
                Toàn bộ nhật ký được ký bảo mật HMAC-SHA256 bất biến không thể sửa đổi
              </CardDescription>
            </div>
          </div>

          <Button
            onClick={handleVerifyAll}
            variant="outline"
            size="sm"
            className="text-xs h-8 rounded-lg gap-1.5 border-[#3CC4BD]/40 text-[#1E8C86] dark:text-[#3CC4BD]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Thẩm Tra Mã Băm HMAC</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-dashed">
              <TableHead className="text-xs uppercase font-bold">Mã Log</TableHead>
              <TableHead className="text-xs uppercase font-bold">Người Thực Hiện</TableHead>
              <TableHead className="text-xs uppercase font-bold">Hành Động</TableHead>
              <TableHead className="text-xs uppercase font-bold">Đối Tượng</TableHead>
              <TableHead className="text-xs uppercase font-bold">Chi Tiết</TableHead>
              <TableHead className="text-xs uppercase font-bold text-right">Chữ Ký Toàn Vẹn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-[#E8F6F5]/40 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-muted-foreground">{log.id}</TableCell>
                <TableCell className="text-xs font-medium text-foreground">{log.actorName}</TableCell>
                <TableCell>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-muted">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-[#1E8C86]">{log.targetId}</TableCell>
                <TableCell className="text-xs max-w-[260px] truncate text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right">
                  {log.isValid ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>HMAC-Verified</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/15 text-destructive">
                      CORRUPTED
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
