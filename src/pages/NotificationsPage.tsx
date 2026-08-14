import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationList } from '@/components/business/NotificationList'
import { NotificationQueueTable } from '@/components/business/NotificationQueueTable'
import { EmailPreviewModal } from '@/components/business/EmailPreviewModal'
import {
  notificationService,
  type NotificationRow,
  type NotificationQueueRow,
} from '@/services/notification.service'
import { useAuth } from '@/hooks/useAuth'
import { Bell, Inbox, Send } from 'lucide-react'

export function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [queueItems, setQueueItems] = useState<NotificationQueueRow[]>([])
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false)
  const [, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const userId = user?.id || 'demo-user-1'
    const [notifsRes, queueRes] = await Promise.all([
      notificationService.getInAppNotifications(userId),
      notificationService.getQueueItems(),
    ])

    if (notifsRes.data.length > 0) {
      setNotifications(notifsRes.data)
    } else {
      // Demo fallback data
      setNotifications([
        {
          id: 'n-1',
          recipient_id: userId,
          event_type: 'REQUEST_ASSIGNED',
          title: 'Đơn xin nghỉ phép mới cần phê duyệt',
          message: 'Trần Văn An (LPVN-0001) đã gửi Đơn xin nghỉ phép 2 ngày cần bạn xem xét.',
          action_url: '/approvals',
          is_read: false,
          read_at: null,
          metadata: {},
          created_at: new Date().toISOString(),
        },
        {
          id: 'n-2',
          recipient_id: userId,
          event_type: 'REQUEST_APPROVED',
          title: 'Giấy phép ra cổng đã được chấp thuận',
          message: 'Quản lý Nguyễn Quản Lý đã phê duyệt giấy phép ra cổng của bạn.',
          action_url: '/gate-pass',
          is_read: false,
          read_at: null,
          metadata: {},
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'n-3',
          recipient_id: userId,
          event_type: 'DOCUMENT_GENERATED',
          title: 'Văn bản ISO LPVN-HR-F-0013 đã xuất bản',
          message: 'Tài liệu đã được đóng dấu chữ ký số điện tử và cấp mã hash SHA-256.',
          action_url: '/documents',
          is_read: true,
          read_at: new Date(Date.now() - 86400000).toISOString(),
          metadata: {},
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ])
    }

    if (queueRes.data.length > 0) {
      setQueueItems(queueRes.data)
    } else {
      // Demo fallback queue
      setQueueItems([
        {
          id: 'q-1',
          event_type: 'REQUEST_ASSIGNED',
          channel: 'EMAIL',
          recipient_email: 'manager.dept@lpvn.com',
          subject: '[LPVN Flow] Yêu cầu phê duyệt Đơn Xin Nghỉ Phép - Trần Văn An',
          body_html: '<html><body>Content</body></html>',
          status: 'SENT',
          retry_count: 0,
          max_retries: 3,
          last_error: null,
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: 'q-2',
          event_type: 'REQUEST_APPROVED',
          channel: 'EMAIL',
          recipient_email: 'tran.an@lpvn.com',
          subject: '[LPVN Flow] Đơn Giấy Phép Ra Cổng (LPVN-HR-F-0014) ĐÃ ĐƯỢC PHÊ DUYỆT',
          body_html: '<html><body>Content</body></html>',
          status: 'PENDING',
          retry_count: 0,
          max_retries: 3,
          last_error: null,
          sent_at: null,
          created_at: new Date().toISOString(),
        },
      ])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const handleMarkRead = async (id: string) => {
    const userId = user?.id || 'demo-user-1'
    await notificationService.markAsRead(id, userId)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    )
  }

  const handleMarkAllRead = async () => {
    const userId = user?.id || 'demo-user-1'
    await notificationService.markAllAsRead(userId)
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bell className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Trung Tâm Thông Báo & Hàng Đợi Email</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Hộp thư thông báo trong ứng dụng, hàng đợi chuyển phát email Microsoft Outlook và kiểm soát tiến độ
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="inbox" className="gap-1.5 text-xs sm:text-sm">
            <Inbox className="h-4 w-4" />
            Hộp Thư Thông Báo ({notifications.filter((n) => !n.is_read).length} mới)
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-1.5 text-xs sm:text-sm">
            <Send className="h-4 w-4" />
            Hàng Đợi Email ({queueItems.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: In-App Inbox */}
        <TabsContent value="inbox" className="mt-4 space-y-4">
          <NotificationList
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        </TabsContent>

        {/* Tab 2: Outbound Queue */}
        <TabsContent value="queue" className="mt-4 space-y-4">
          <NotificationQueueTable
            queueItems={queueItems}
            onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Outlook Email Preview Modal */}
      <EmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
      />
    </div>
  )
}
