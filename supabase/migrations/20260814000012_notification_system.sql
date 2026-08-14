-- Phase 11: Notification Core & Email Integration
-- Creates notifications and notification_queue tables with indexes and RLS

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('REQUEST_SUBMITTED', 'REQUEST_ASSIGNED', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'DOCUMENT_GENERATED', 'SYSTEM_ALERT')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL DEFAULT 'EMAIL' CHECK (channel IN ('EMAIL', 'IN_APP', 'WEBHOOK')),
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'RETRYING')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Notifications insertable by authenticated users" 
  ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Notification queue viewable by authenticated users" 
  ON public.notification_queue FOR SELECT TO authenticated USING (true);

CREATE POLICY "Notification queue insertable by authenticated users" 
  ON public.notification_queue FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Notification queue updatable by authenticated users" 
  ON public.notification_queue FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON public.notification_queue(status, created_at);
