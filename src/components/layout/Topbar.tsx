import { Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from '@/components/business/NotificationBell'
import { useAuth } from '@/hooks/useAuth'

export function Topbar() {
  const { user } = useAuth()

  const sampleNotifications = [
    {
      id: 'notif-1',
      recipient_id: user?.id || 'admin',
      event_type: 'REQUEST_ASSIGNED' as const,
      title: 'Yêu cầu phê duyệt Đơn nghỉ phép',
      message: 'Trần Văn An gửi đơn xin nghỉ phép 2 ngày chờ bạn phê duyệt.',
      action_url: '/approvals',
      is_read: false,
      read_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      recipient_id: user?.id || 'admin',
      event_type: 'DOCUMENT_GENERATED' as const,
      title: 'Đã xuất bản Biểu mẫu ISO',
      message: 'Biểu mẫu LPVN-HR-F-0014 đã được đóng dấu chữ ký và lưu trữ hash SHA-256.',
      action_url: '/documents',
      is_read: false,
      read_at: null,
      metadata: {},
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : 'LA'

  const userName = user?.user_metadata?.full_name || 'LPVN Admin'

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Tìm kiếm nhanh đơn từ, nhân sự..." className="pl-8 text-xs" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell
          notifications={sampleNotifications}
          unreadCount={2}
          onMarkAllRead={() => {}}
        />
        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground">{userName}</span>
        </div>
      </div>
    </header>
  )
}
