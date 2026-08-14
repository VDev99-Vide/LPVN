import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationQueueTable } from './NotificationQueueTable'
import type { NotificationQueueRow } from '@/services/notification.service'

describe('NotificationQueueTable', () => {
  it('renders outbound queue entries with recipient email and status', () => {
    const mockQueue: NotificationQueueRow[] = [
      {
        id: 'q-1',
        event_type: 'REQUEST_ASSIGNED',
        channel: 'EMAIL',
        recipient_email: 'manager@lpvn.com',
        subject: '[LPVN Flow] Yêu cầu phê duyệt',
        body_html: '<html><body>Hello</body></html>',
        status: 'SENT',
        retry_count: 0,
        max_retries: 3,
        last_error: null,
        sent_at: '2026-08-14T00:00:00Z',
        created_at: '2026-08-14T00:00:00Z',
      },
    ]

    render(
      <NotificationQueueTable
        queueItems={mockQueue}
        onOpenEmailPreview={vi.fn()}
      />
    )

    expect(screen.getByText('Hàng Đợi Gửi Email & Webhook (Outbound Queue)')).toBeInTheDocument()
    expect(screen.getByText('manager@lpvn.com')).toBeInTheDocument()
    expect(screen.getByText('Đã gửi')).toBeInTheDocument()
  })
})
