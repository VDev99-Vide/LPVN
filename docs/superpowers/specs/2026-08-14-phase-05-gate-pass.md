# Phase 05 — Employee Gate Pass (LPVN-HR-F-0014) Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Số hóa hoàn chỉnh quy trình đăng ký, phê duyệt và đối soát tại cổng bảo vệ cho **Giấy Phép Ra Cổng (Employee Gate Pass — Biểu mẫu ISO `LPVN-HR-F-0014`)**.

### 1.1. Nguyên tắc cốt lõi
- **SaaS Input Form**: Nhân viên/Trưởng ca đăng ký nhanh trên web, tự động điền họ tên, mã NV, phòng ban.
- **Phân loại lý do**:
  - `BUSINESS`: Công tác bên ngoài phục vụ công việc công ty.
  - `PERSONAL_OR_RESIGNED`: Việc riêng cá nhân hoặc nhân viên nghỉ việc ra về.
- **Kê khai tài sản**: Ghi nhận rõ các thiết bị, tài liệu, tài sản công ty mang theo (nếu có).
- **Luồng phê duyệt**: Trưởng bộ phận / Quản lý trực tiếp (hoặc Giám sát/Trưởng ca ngoài giờ hành chính) phê duyệt.
- **Trạm gác Bảo vệ (Security Station)**: Bảo vệ tại cổng tra cứu đơn đã duyệt, ghi nhận thời gian ra/vào thực tế và xác nhận cho qua cổng.
- **Tài liệu ISO**: Sau khi duyệt và hoàn tất, hệ thống có thể xem trước hoặc in biểu mẫu ISO chuẩn `LPVN-HR-F-0014` có logo Leggett & Platt và chữ ký điện tử.

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.gate_passes`
```sql
CREATE TABLE IF NOT EXISTS public.gate_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no VARCHAR(50) NOT NULL DEFAULT 'LPVN-HR-F-0014',
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason_type VARCHAR(50) NOT NULL CHECK (reason_type IN ('BUSINESS', 'PERSONAL_OR_RESIGNED')),
  reason_details TEXT,
  pass_date DATE NOT NULL DEFAULT CURRENT_DATE,
  from_time VARCHAR(10) NOT NULL, -- e.g. "13:30"
  to_time VARCHAR(10) NOT NULL,   -- e.g. "16:30"
  accompanied_items TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL' 
    CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED')),
  approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  manager_notes TEXT,
  security_out_time TIMESTAMPTZ,
  security_in_time TIMESTAMPTZ,
  security_guard_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  security_guard_name VARCHAR(100),
  security_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 3. Phân quyền & Row Level Security (RLS)
1. **Authenticated Users**: Xem và tạo đơn của chính mình (`employee_id = auth.uid()`).
2. **Managers**: Xem và cập nhật trạng thái (`APPROVED`/`REJECTED`) cho các đơn của nhân viên cấp dưới.
3. **Security / HR / Admin**: Xem toàn bộ các đơn ở trạng thái `APPROVED`, `IN_TRANSIT`, `COMPLETED` để kiểm tra cổng và ghi nhận giờ thực tế.

---

## 4. Giao diện & Luồng Tương tác (UI/UX)
- **Tab 1: Giấy ra cổng của tôi**:
  - Nút "Tạo Giấy Ra Cổng Mới" mở Drawer Form.
  - Danh sách đơn của tôi với thẻ trạng thái (`StatusBadge`).
  - Nút "Xem Biểu Mẫu ISO" mở `GatePassISO` modal để in/preview.
- **Tab 2: Phê duyệt (Manager)**:
  - Danh sách đơn chờ duyệt từ nhân viên cấp dưới.
  - Thao tác nhanh: `[ Phê Duyệt ]` / `[ Từ Chối ]` kèm ghi chú.
- **Tab 3: Trạm kiểm soát Bảo vệ (Security Station)**:
  - Thanh tìm kiếm nhanh theo Mã NV / Tên NV / Ngày.
  - Danh sách đơn hợp lệ trong ngày.
  - Nút 1 chạm: `[ Xác nhận Ra ]` (Ghi nhận `security_out_time`, chuyển sang `IN_TRANSIT`) và `[ Xác nhận Vào ]` (Ghi nhận `security_in_time`, chuyển sang `COMPLETED`).
