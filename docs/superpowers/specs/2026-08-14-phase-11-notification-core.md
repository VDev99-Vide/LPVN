# Phase 11 — Notification Core & Email Integration Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Xây dựng hệ thống Thông báo Đa kênh (Multi-channel Notification System) cho **LPVN HR Flow SaaS**:
- Cập nhật tức thời trạng thái phê duyệt cho Nhân viên và Quản lý qua hộp thư In-App.
- Hỗ trợ gửi Email thông báo tự động với định dạng HTML responsive, được tối ưu riêng cho Microsoft Outlook và ứng dụng Mail di động.
- Triển khai hàng đợi thông báo (Notification Queue) với cơ chế Retry tự động và ghi nhật ký lỗi (Audit & Failure logging).

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.notifications`
```sql
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
```

### Bảng `public.notification_queue`
```sql
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
```
