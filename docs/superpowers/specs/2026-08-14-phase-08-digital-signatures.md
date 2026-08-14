# Phase 08 — Digital Signature Library Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Xây dựng thư viện quản lý chữ ký số & chữ ký điện tử cho **LPVN HR Flow SaaS**, phục vụ tự động hóa việc ký duyệt và đóng dấu tên người phê duyệt vào các biểu mẫu ISO:
- `LPVN-HR-F-0013`: Đơn xin nghỉ phép (Leave Application).
- `LPVN-HR-F-0014`: Giấy phép ra cổng (Employee Gate Pass).
- `LPVN-HR-F-0008`: Phiếu xác nhận ngày công (Attendance Confirmation).

### 1.1. Yêu cầu Kiến trúc & Phân loại
- **Phân loại Chữ ký (ADR-002 & ADR-008)**:
  - `CANVAS_DRAWN`: Ký tay trực tiếp trên màn hình cảm ứng hoặc chuột máy tính.
  - `ELECTRONIC_IMAGE`: Tải file ảnh chữ ký (PNG nền trong suốt hoặc JPG).
  - `DIGITAL_CERTIFICATE`: Tích hợp chứng thư số PKI mở rộng trong tương lai.
- **Bảo mật & RLS**: Chữ ký là tài sản cá nhân được mã hóa/phân quyền nghiêm ngặt, chỉ chính chủ mới có quyền chỉnh sửa/thay đổi.
- **Audit Logging**: Mọi hành vi tạo, cập nhật, xóa, và mỗi lần chữ ký được đóng dấu lên tài liệu đều được ghi vết vào `signature_audit_logs`.

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.digital_signatures`
```sql
CREATE TABLE IF NOT EXISTS public.digital_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  signature_type VARCHAR(50) NOT NULL DEFAULT 'ELECTRONIC_IMAGE' 
    CHECK (signature_type IN ('ELECTRONIC_IMAGE', 'CANVAS_DRAWN', 'DIGITAL_CERTIFICATE')),
  signature_url TEXT NOT NULL,
  title VARCHAR(100) DEFAULT 'Chữ ký cá nhân',
  is_default BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Bảng `public.signature_audit_logs`
```sql
CREATE TABLE IF NOT EXISTS public.signature_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signature_id UUID REFERENCES public.digital_signatures(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  document_id UUID,
  document_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
