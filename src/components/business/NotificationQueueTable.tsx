import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NotificationQueueRow } from '@/services/notification.service'
import { Send, Mail, CheckCircle2, Clock, AlertTriangle, Eye } from 'lucide-react'

export interface NotificationQueueTableProps {
  queueItems: NotificationQueueRow[]
  onOpenEmailPreview: () => void
}

export function NotificationQueueTable({
  queueItems,
  onOpenEmailPreview,
}: NotificationQueueTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 text-[10px] gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Đã gửi
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge variant="outline" className="text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-300 text-[10px] gap-1">
            <Clock className="h-2.5 w-2.5" />
            Đang chờ
          </Badge>
        )
      case 'FAILED':
        return (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            Thất bại
          </Badge>
        )
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Hàng Đợi Gửi Email & Webhook (Outbound Queue)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Theo dõi tình trạng gửi email tự động, số lần thử lại (Retry count) và nhật ký chuyển phát
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenEmailPreview}
          className="gap-1.5 text-xs h-8"
        >
          <Eye className="h-3.5 w-3.5" />
          Xem Mẫu Email Outlook
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-[11px]">
                <TableHead>Email Người Nhận</TableHead>
                <TableHead>Tiêu Đề Email</TableHead>
                <TableHead>Kênh</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-center">Thử Lại</TableHead>
                <TableHead>Thời Điểm Tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queueItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    Hàng đợi email hiện đang trống.
                  </TableCell>
                </TableRow>
              ) : (
                queueItems.map((q) => (
                  <TableRow key={q.id} className="text-xs">
                    <TableCell className="font-mono font-medium flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {q.recipient_email}
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-[240px] truncate">
                      {q.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {q.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(q.status)}</TableCell>
                    <TableCell className="text-center font-mono text-[11px]">
                      {q.retry_count}/{q.max_retries}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-[11px]">
                      {new Date(q.created_at).toLocaleTimeString('vi-VN')}
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
