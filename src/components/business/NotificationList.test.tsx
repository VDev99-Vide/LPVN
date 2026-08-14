import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationList } from './NotificationList'
import type { NotificationRow } from '@/services/notification.service'

describe('NotificationList', () => {
  it('renders notifications list and filter triggers', () => {
    const mockNotifications: NotificationRow[] = [
      {
        id: 'notif-1',
        recipient_id: 'user-1',
        event_type: 'REQUEST_APPROVED',
        title: 'Đơn nghỉ phép đã duyệt',
        message: 'Trưởng bộ phận đã duyệt đơn của bạn.',
        action_url: '/leave',
        is_read: false,
        read_at: null,
        metadata: {},
        created_at: '2026-08-14T00:00:00Z',
      },
    ]

    render(
      <NotificationList
        notifications={mockNotifications}
        onMarkRead={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    )

    expect(screen.getByText('Hộp Thư Thông Báo Trong Ứng Dụng')).toBeInTheDocument()
    expect(screen.getByText('Đơn nghỉ phép đã duyệt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đánh Dấu Tất Cả Đã Đọc/i })).toBeInTheDocument()
  })
})
