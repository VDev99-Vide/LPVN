# Phase 09 — Document Template & Rendering Pipeline Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Xây dựng hệ thống Rendering và Xuất bản Tài liệu ISO chuẩn hóa cho **LPVN HR Flow SaaS**:
- `LPVN-HR-F-0013`: Đơn xin nghỉ phép (Leave Application).
- `LPVN-HR-F-0014`: Giấy phép ra cổng (Employee Gate Pass).
- `LPVN-HR-F-0008`: Phiếu xác nhận ngày công (Attendance Confirmation).

### 1.1. Yêu cầu Kỹ thuật & Tiêu chuẩn ISO
- **Snapshot Immutability (ADR-001 & ADR-008)**: Sau khi đơn được phê duyệt, dữ liệu biểu mẫu được đóng băng toàn bộ (snapshot) vào `generated_documents` để đảm bảo văn bản đã xuất bản không bị thay đổi ngay cả khi dữ liệu nhân viên sau này biến động.
- **Tự động gắn Chữ ký điện tử**: Tự động chèn `SignatureStamp` của người phê duyệt (lấy từ chữ ký mặc định trong `digital_signatures`) vào đúng ô ký trên biểu mẫu.
- **Mã kiểm định toàn vẹn (SHA-256 Document Hash)**: Mỗi bản xuất bản được cấp một mã băm mật mã SHA-256 duy nhất, in trên góc văn bản để phục vụ kiểm tra tính xác thực và chống làm giả tài liệu.
- **In ấn chuẩn kích thước A4/A5**: Tối ưu CSS `@media print` đạt chuẩn in ấn văn phòng không vỡ khung, hỗ trợ xuất PDF sắc nét.

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.document_templates`
```sql
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  current_version VARCHAR(20) NOT NULL DEFAULT '1.0',
  field_mappings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Bảng `public.generated_documents`
```sql
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  document_no VARCHAR(50) NOT NULL,
  source_entity_type VARCHAR(50) NOT NULL,
  source_entity_id UUID NOT NULL,
  rendered_data_snapshot JSONB NOT NULL,
  document_hash VARCHAR(64) NOT NULL,
  file_url TEXT,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
