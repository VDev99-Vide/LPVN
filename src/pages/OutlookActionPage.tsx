import { useEffect, useState } from 'react'
import { OutlookApprovalGate } from '@/components/business/OutlookApprovalGate'
import { OutlookCompatibilityBadge } from '@/components/business/OutlookCompatibilityBadge'
import { OutlookDeepLinkGenerator } from '@/components/business/OutlookDeepLinkGenerator'
import { MailCheck } from 'lucide-react'

export function OutlookActionPage() {
  const [taskId, setTaskId] = useState<string>('demo-task-001')
  const [token, setToken] = useState<string>('demo-token-123')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const urlTaskId = params.get('taskId')
      const urlToken = params.get('token')
      if (urlTaskId) setTaskId(urlTaskId)
      if (urlToken) setToken(urlToken)
    }
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-1">
          <MailCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cổng Phê Duyệt Nhanh Microsoft Outlook
        </h1>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          Hệ thống xác thực token bảo mật 1 lần từ email để cho phép Quản lý xem xét và ký duyệt đơn trực tiếp
        </p>
      </div>

      {/* Compatibility Badge */}
      <OutlookCompatibilityBadge />

      {/* Main Approval Gate */}
      <div className="py-2">
        <OutlookApprovalGate taskId={taskId} token={token} />
      </div>

      {/* Deep Link Generator for Admin / Testing */}
      <div className="pt-4 border-t">
        <OutlookDeepLinkGenerator />
      </div>
    </div>
  )
}
