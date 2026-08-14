# LPVN HR Flow — Supply Chain Workflow & Template.html Overhaul Spec

## 1. Mục tiêu & Tổng quan
Chuẩn hóa toàn bộ hệ thống LPVN HR Flow SaaS theo cấu trúc thực tế của `Template.html`, tối ưu hóa giao diện và phân quyền chi tiết theo từng cấp bậc (Role Hierarchy) ưu tiên cho **Phòng Supply Chain (Chuỗi Cung Ứng)**:
- **Logo chính:** `Leggett.jpg` nằm ở chính giữa header màn hình đăng nhập. Tên tiêu đề chính: **LPVN**.
- **Màn hình Đăng nhập:** Giao diện tối giản, trường nhập User / Email, Mật khẩu, nút Đăng nhập và tự động ghi nhớ phiên (`Remember Me / Auto-Save`). Bỏ khung cảnh báo demo.
- **Phân quyền Role-Based Menu:**
  - `EMPLOYEE (Nhân viên)`: `Tạo đơn mới` (3 mẫu ISO, đính kèm giấy khám chữa bệnh khi nghỉ ốm/khác), `Đơn của tôi` (theo dõi trạng thái, xuất PDF có chữ ký khi duyệt), `Thư viện chữ ký` (vẽ nét ký).
  - `TEAM_LEADER (Trưởng nhóm)`: 3 menu của nhân viên + `Duyệt đơn` (huy hiệu số lượng đơn chờ duyệt trên header/menu, đồng bộ trạng thái đơn, tự động đóng dấu nét ký).
  - `SUPERVISOR (Giám sát)`: Quyền duyệt đơn cấp cao hơn + `Dashboard` (thống kê nhân sự nghỉ trong tháng, Top rank nhân viên nghỉ nhiều nhất theo phép năm / phép bệnh).
  - `ADMIN (Quản trị viên)`: Toàn quyền quản trị nhân sự, phòng ban Supply Chain, sơ đồ cấp bậc, mẫu đơn ISO, và **tạo tài khoản trực tiếp trên frontend** (username, password, role, dept).
- **Thông báo đa kênh:** Cấp duyệt (Team Leader, Supervisor, Admin) cấu hình địa chỉ Gmail / Outlook để nhận email phê duyệt tức thì.

---

## 2. Ma Trận Menu & Phân Quyền (RBAC Matrix)

| Menu / Tính năng | EMPLOYEE | TEAM_LEADER | SUPERVISOR | ADMIN |
|---|:---:|:---:|:---:|:---:|
| **Tạo đơn mới** (3 mẫu ISO + đính kèm hồ sơ y tế) | ✅ | ✅ | ✅ | ✅ |
| **Đơn của tôi** (Xem trạng thái & Xuất PDF) | ✅ | ✅ | ✅ | ✅ |
| **Thư viện chữ ký số** (Canvas ký & lưu) | ✅ | ✅ | ✅ | ✅ |
| **Duyệt đơn** (Badge số lượng đơn chờ) | ❌ | ✅ | ✅ | ✅ |
| **Dashboard** (Top rank nghỉ phép & Thống kê tháng) | ❌ | ❌ | ✅ | ✅ |
| **Báo cáo & Phép năm** (Theo dõi số ngày còn lại) | ❌ | ❌ | ✅ | ✅ |
| **Quản trị nhân sự & Tạo User trực tiếp** | ❌ | ❌ | ❌ | ✅ |
| **Sơ đồ tổ chức & Phòng ban Supply Chain** | ❌ | ❌ | ❌ | ✅ |
| **Cấu hình Email / SSO / Template ISO** | ❌ | ❌ | ❌ | ✅ |

---

## 3. Kiến Trúc Mẫu Đơn Chuẩn ISO & Đính Kèm Tệp Minh Chứng

1. **Giấy phép ra cổng (`LPVN-HR-F-0014`):** Lý do (Công tác / Việc riêng), Ngày, Giờ từ → đến, Tài sản mang theo.
2. **Đơn xin nghỉ phép (`LPVN-HR-F-0013`):**
   - Lý do: Nghỉ phép năm, Nghỉ không lương, Kết hôn, Nghỉ ốm, Tang gia, Khác.
   - **Tệp đính kèm y tế/minh chứng (`attachment_url` / `attachment_name`):** Bắt buộc/khuyến nghị tải ảnh hoặc PDF giấy khám bệnh, giấy chứng nhận khi chọn lý do khác phép năm.
   - Thông tin phép năm: Được cấp, đã dùng, còn lại.
3. **Phiếu xác nhận ngày công (`LPVN-HR-F-0008`):** Lý do (quên chấm công...), Ngày, Giờ từ → đến.
