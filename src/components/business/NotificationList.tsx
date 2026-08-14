import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NotificationRow } from '@/services/notification.service'
import { CheckCircle2, AlertCircle, FileCheck, Info, CheckCheck, Inbox } from 'lucide-react'

export interface NotificationListProps {
  notifications: NotificationRow[]
  onMarkRead: (id: string) => Promise<void>
  onMarkAllRead: () => Promise<void>
}

export function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationListProps) {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'APPROVAL' | 'DOCUMENT'>('ALL')

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read
    if (filter === 'APPROVAL') return n.event_type.includes('APPROVED') || n.event_type.includes('REJECTED')
    if (filter === 'DOCUMENT') return n.event_type.includes('DOCUMENT')
    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
      case 'REQUEST_REJECTED':
        return <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      case 'DOCUMENT_GENERATED':
        return <FileCheck className="h-5 w-5 text-primary shrink-0" />
      default:
        return <Info className="h-5 w-5 text-blue-600 shrink-0" />
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Hộp Thư Thông Báo Trong Ứng Dụng</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Theo dõi tức thời các quyết định phê duyệt, bàn giao và xuất bản tài liệu ISO
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
          className="gap-1.5 text-xs h-8"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Đánh Dấu Tất Cả Đã Đọc
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 border-b pb-3">
          <Button
            variant={filter === 'ALL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('ALL')}
            className="text-xs h-7"
          >
            Tất cả ({notifications.length})
          </Button>
          <Button
            variant={filter === 'UNREAD' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('UNREAD')}
            className="text-xs h-7"
          >
            Chưa đọc ({notifications.filter((n) => !n.is_read).length})
          </Button>
          <Button
            variant={filter === 'APPROVAL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('APPROVAL')}
            className="text-xs h-7"
          >
            Kết quả duyệt
          </Button>
          <Button
            variant={filter === 'DOCUMENT' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('DOCUMENT')}
            className="text-xs h-7"
          >
            Biểu mẫu ISO
          </Button>
        </div>

        {/* List */}
        <div className="divide-y rounded-md border">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Không có thông báo nào trong mục này.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                  !n.is_read ? 'bg-primary/5' : 'bg-card'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(n.event_type)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{n.title}</span>
                      {!n.is_read && (
                        <Badge variant="destructive" className="text-[9px] py-0 px-1">
                          MỚI
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <div className="text-[10px] text-muted-foreground pt-1 font-mono">
                      {new Date(n.created_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.action_url && (
                    <a
                      href={n.action_url}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Mở liên kết →
                    </a>
                  )}
                  {!n.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkRead(n.id)}
                      className="text-[11px] h-7 text-muted-foreground hover:text-foreground"
                    >
                      Đã đọc
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
