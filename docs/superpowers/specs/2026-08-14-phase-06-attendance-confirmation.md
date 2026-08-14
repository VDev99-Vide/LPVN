# Phase 06 — Attendance Confirmation (LPVN-HR-F-0008) Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Số hóa quy trình đăng ký, thẩm tra, phê duyệt và chuyển giao dữ liệu chấm công cho **Phiếu Yêu Cầu Xác Nhận Ngày Công (Attendance Confirmation Form — Biểu mẫu ISO `LPVN-HR-F-0008`)**.

### 1.1. Các tình huống nghiệp vụ
- Quên quẹt thẻ / vân tay lúc vào ca hoặc tan ca.
- Lỗi thiết bị máy chấm công tại cổng hoặc phân xưởng.
- Đi công tác hoặc làm việc ngoài hiện trường đột xuất.
- Đổi ca làm việc theo chỉ đạo quản lý nhưng chưa kịp điều chỉnh trên hệ thống máy quẹt thẻ.

### 1.2. Luồng phê duyệt & Chuyển giao
```text
[ 1. Nhân viên tạo phiếu ]
Điền ngày cần xác nhận, lý do, khung giờ (From time -> To time)
       ↓
[ 2. Trưởng bộ phận duyệt ]
Kiểm tra tính hợp lệ và bấm APPROVE / REJECT
       ↓
[ 3. Chuyển giao Phòng Nhân Sự (HR Handover) ]
Phiếu được chuyển sang hàng đợi của HR để chuyên viên C&B kiểm tra và bấm "Đã ghi nhận công" (HR_RECORDED)
       ↓
[ 4. Biểu mẫu ISO LPVN-HR-F-0008 ]
Có thể xem trước / in phiếu có đầy đủ logo Leggett và 3 chữ ký (Người đề nghị, Xác nhận, Phê duyệt)
```

---

## 2. Mô hình Dữ liệu (Database Schema)

### Bảng `public.attendance_confirmations`
```sql
CREATE TABLE IF NOT EXISTS public.attendance_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no VARCHAR(50) NOT NULL DEFAULT 'LPVN-HR-F-0008',
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  confirmation_date DATE NOT NULL,
  from_time VARCHAR(10) NOT NULL,
  to_time VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL' 
    CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HR_RECORDED', 'CANCELLED')),
  checker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  hr_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  hr_recorded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 3. Phân quyền RLS
1. **Authenticated Users**: Xem và tạo phiếu của chính mình (`employee_id = auth.uid()`).
2. **Managers**: Xem và duyệt phiếu của nhân viên trong bộ phận (`status = 'PENDING_APPROVAL'`).
3. **HR Admins**: Xem tất cả các phiếu ở trạng thái `APPROVED` để cập nhật ngày công và chuyển sang `HR_RECORDED`.
