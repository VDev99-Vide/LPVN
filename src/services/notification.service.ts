import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type NotificationRow = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationQueueRow = Database['public']['Tables']['notification_queue']['Row']
export type NotificationQueueInsert = Database['public']['Tables']['notification_queue']['Insert']

export const notificationService = {
  async getInAppNotifications(
    userId: string,
    params?: { unreadOnly?: boolean }
  ): Promise<{ data: NotificationRow[]; unreadCount: number; error: Error | null }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })

      if (params?.unreadOnly) {
        query = query.eq('is_read', false)
      }

      const { data, error } = await query
      if (error) return { data: [], unreadCount: 0, error: new Error(error.message) }

      const list = (data as unknown as NotificationRow[]) || []
      const unreadCount = list.filter((n) => !n.is_read).length

      return { data: list, unreadCount, error: null }
    } catch (err) {
      return { data: [], unreadCount: 0, error: err as Error }
    }
  },

  async markAsRead(id: string, userId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('notifications') as any)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .eq('recipient_id', userId)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async markAllAsRead(userId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('notifications') as any)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('recipient_id', userId)
        .eq('is_read', false)

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async sendInAppNotification(params: {
    recipientId: string
    eventType: 'REQUEST_SUBMITTED' | 'REQUEST_ASSIGNED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'DOCUMENT_GENERATED' | 'SYSTEM_ALERT'
    title: string
    message: string
    actionUrl?: string
    metadata?: Record<string, any>
  }): Promise<{ data: NotificationRow | null; error: Error | null }> {
    try {
      const payload: NotificationInsert = {
        recipient_id: params.recipientId,
        event_type: params.eventType,
        title: params.title,
        message: params.message,
        action_url: params.actionUrl || null,
        is_read: false,
        metadata: params.metadata || {},
      }

      const { data, error } = await (supabase.from('notifications') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as NotificationRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async enqueueEmail(params: {
    recipientEmail: string
    subject: string
    bodyHtml: string
    eventType?: string
  }): Promise<{ data: NotificationQueueRow | null; error: Error | null }> {
    try {
      const payload: NotificationQueueInsert = {
        recipient_email: params.recipientEmail,
        subject: params.subject,
        body_html: params.bodyHtml,
        event_type: params.eventType || 'EMAIL_ALERT',
        channel: 'EMAIL',
        status: 'PENDING',
        retry_count: 0,
        max_retries: 3,
      }

      const { data, error } = await (supabase.from('notification_queue') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as NotificationQueueRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async getQueueItems(): Promise<{ data: NotificationQueueRow[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notification_queue')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as NotificationQueueRow[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },
}
