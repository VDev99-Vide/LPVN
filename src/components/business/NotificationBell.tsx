import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCheck, CheckCircle2, AlertCircle, FileCheck, Info } from 'lucide-react'
import type { NotificationRow } from '@/services/notification.service'

export interface NotificationBellProps {
  notifications?: NotificationRow[]
  unreadCount?: number
  onMarkAllRead?: () => void
  onSelectNotification?: (notif: NotificationRow) => void
}

export function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onSelectNotification,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case 'REQUEST_REJECTED':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'DOCUMENT_GENERATED':
        return <FileCheck className="h-4 w-4 text-primary" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full"
        aria-label="Thông báo"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border bg-card p-0 shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between border-b p-3 bg-muted/30">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>Thông Báo</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                    {unreadCount} mới
                  </Badge>
                )}
              </div>

              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAllRead()
                  }}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  Đọc tất cả
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Không có thông báo nào.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onSelectNotification?.(n)
                      setIsOpen(false)
                    }}
                    className={`p-3 text-xs cursor-pointer hover:bg-muted/50 transition-colors flex items-start gap-2.5 ${
                      !n.is_read ? 'bg-primary/5 font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(n.event_type)}</div>
                    <div className="flex-1 space-y-0.5">
                      <div className="font-semibold text-foreground">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.message}
                      </div>
                      <div className="text-[9px] text-muted-foreground pt-0.5">
                        {new Date(n.created_at).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {new Date(n.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-2 bg-muted/20 text-center">
              <a
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-primary hover:underline block"
              >
                Xem tất cả thông báo & hàng đợi email →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
