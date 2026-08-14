import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'REQUEST_REJECTED':
        return <AlertCircle className="h-4 w-4 text-coral-light" />
      case 'DOCUMENT_GENERATED':
        return <FileCheck className="h-4 w-4 text-teal-300" />
      default:
        return <Info className="h-4 w-4 text-sky-400" />
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all"
        aria-label="Thông báo"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-coral-dark text-[9px] font-extrabold text-white shadow-[0_0_8px_rgba(239,108,74,0.9)] animate-pulse">
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
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-white/20 bg-[#12151e]/90 backdrop-blur-3xl p-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 p-3.5 bg-white/[0.04]">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>Thông Báo Hệ Thống</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] py-0.2 px-2 rounded-full bg-coral-dark/30 text-coral-light border border-coral-light/40 font-bold">
                    {unreadCount} mới
                  </span>
                )}
              </div>

              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkAllRead()
                  }}
                  className="text-[11px] text-teal-300 hover:text-teal-200 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Đọc tất cả
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/50">
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
                    className={`p-3 text-xs cursor-pointer hover:bg-white/10 transition-colors flex items-start gap-2.5 ${
                      !n.is_read ? 'bg-white/[0.06] font-medium' : 'text-white/60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(n.event_type)}</div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="font-semibold text-white truncate">{n.title}</div>
                      <div className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                        {n.message}
                      </div>
                      <div className="text-[9px] text-white/40 pt-0.5">
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

            <div className="border-t border-white/10 p-2.5 bg-white/[0.02] text-center">
              <a
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors block"
              >
                Xem tất cả thông báo &amp; hàng đợi email →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
