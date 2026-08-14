# Phase 07 — Approval Workflow Engine Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Xây dựng hệ thống Workflow Engine tập trung cho **LPVN HR Flow SaaS**, quản lý trạng thái phê duyệt hợp nhất cho cả 3 quy trình ISO:
- `LPVN-HR-F-0013`: Đơn xin nghỉ phép (Leave Application).
- `LPVN-HR-F-0014`: Giấy phép ra cổng (Employee Gate Pass).
- `LPVN-HR-F-0008`: Phiếu xác nhận ngày công (Attendance Confirmation).

### 1.1. Yêu cầu Kiến trúc & Bảo mật
- **Generic State Machine**: Quản lý vòng đời trạng thái (`DRAFT` → `PENDING` → `APPROVED` / `REJECTED` → `COMPLETED` / `HR_RECORDED`).
- **Anti-Replay Security Tokens**: Sinh token bảo mật ngẫu nhiên dùng 1 lần (Single-use Cryptographic Nonce) cho phê duyệt email / Outlook Notification.
- **Unified Approvals Hub**: Hộp thư đến phê duyệt tập trung giúp Trưởng phòng/Ban giám đốc xử lý tất cả yêu cầu từ 1 giao diện duy nhất.
- **Audit Trail Transition Log**: Ghi vết 100% các lần thay đổi trạng thái kèm người thao tác, thời gian, và ghi chú để đáp ứng tiêu chuẩn kiểm toán ISO.

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.approval_tasks`
```sql
CREATE TABLE IF NOT EXISTS public.approval_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('LEAVE', 'GATE_PASS', 'ATTENDANCE_CONFIRMATION')),
  document_id UUID NOT NULL,
  document_no VARCHAR(50) NOT NULL,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  decision_notes TEXT,
  decided_at TIMESTAMPTZ,
  security_token VARCHAR(100) UNIQUE,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Bảng `public.workflow_transitions`
```sql
CREATE TABLE IF NOT EXISTS public.workflow_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.approval_tasks(id) ON DELETE CASCADE,
  from_status VARCHAR(50) NOT NULL,
  to_status VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
