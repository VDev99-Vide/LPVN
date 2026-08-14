import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationBell } from './NotificationBell'

describe('NotificationBell', () => {
  it('renders notification bell icon and counter badge', () => {
    render(<NotificationBell unreadCount={3} />)

    expect(screen.getByRole('button', { name: /Thông báo/i })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
