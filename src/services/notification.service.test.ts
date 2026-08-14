import { describe, expect, it } from 'vitest'
import { notificationService } from './notification.service'

describe('NotificationService', () => {
  it('exports notificationService with all expected in-app and queue methods', () => {
    expect(notificationService).toBeDefined()
    expect(typeof notificationService.getInAppNotifications).toBe('function')
    expect(typeof notificationService.markAsRead).toBe('function')
    expect(typeof notificationService.markAllAsRead).toBe('function')
    expect(typeof notificationService.sendInAppNotification).toBe('function')
    expect(typeof notificationService.enqueueEmail).toBe('function')
    expect(typeof notificationService.getQueueItems).toBe('function')
  })
})
