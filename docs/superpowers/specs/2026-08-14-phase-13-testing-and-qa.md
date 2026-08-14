# LPVN HR Flow — Phase 13: Testing & Quality Assurance Specification

## 1. Mục tiêu (Objective)
Thiết lập bộ kiểm thử toàn diện cấp hệ thống (Integration & End-to-End Simulation) đảm bảo độ tin cậy 100% cho mọi kịch bản vận hành thực tế tại nhà máy Leggett & Platt:
- **E2E Happy Path Flow:** Nhân viên tạo đơn (có đính kèm minh chứng y tế/lý do) → Thông báo Outlook gửi tới Manager → Manager phê duyệt (In-App hoặc Outlook Actionable Card) → Hệ thống tự động kích hoạt Document Pipeline → Sinh file PDF chuẩn ISO có chữ ký → Lưu trữ R2 → Thông báo hoàn tất cho nhân viên tải in.
- **E2E Rejection & Balance Flow:** Từ chối đơn với lý do bắt buộc → Hoàn trả số dư phép năm → Gửi thông báo từ chối → Không sinh tài liệu ISO đã duyệt.
- **E2E Fallback Resilience:** Khi adapter Outlook Advanced gặp lỗi mạng hoặc bị tắt, hệ thống tự động fallback 100% sang Basic HTML Email với mã bảo mật ký số một lần.
- **Cross-Role Isolation Testing:** Kiểm thử tự động ngăn chặn can thiệp chéo giữa các vai trò `EMPLOYEE`, `TEAM_LEADER`, `SUPERVISOR`, `ADMIN` và giữa các phòng ban.
- **Visual QA Suite:** Bảng điều khiển kiểm thử trực quan trên giao diện dành cho Admin/QA để chạy toàn bộ kịch bản kiểm thử theo yêu cầu.

---

## 2. Kịch Bản Kiểm Thử (Test Scenarios)

### Kịch bản 1: Happy Path — Đơn Nghỉ Phép Phòng Supply Chain
1. Nhân viên `Nguyễn Văn A` (Mã NV `LPVN-0231`) tạo đơn `LPVN-HR-F-0013` nghỉ ốm 1 ngày kèm ảnh chụp giấy khám bệnh.
2. Số dư phép được giữ nguyên (nghỉ ốm hưởng BHXH).
3. `approvalDocumentPipelineService` chuyển trạng thái sang `PENDING_APPROVAL`.
4. Team Leader `Lê Văn C` ký duyệt đơn bằng chữ ký điện tử đã lưu.
5. Trạng thái chuyển thành `APPROVED`.
6. Document Pipeline tạo snapshot bất biến, gán mã băm `SHA-256`, tạo đường dẫn PDF `/storage/r2/2026/08/DOC-ISO-0013-09.pdf`.
7. Nhân viên nhận thông báo và tải in bản PDF chuẩn ISO.

### Kịch bản 2: Rejection Path & Hoàn Phép
1. Nhân viên nộp đơn nghỉ phép năm 3 ngày. Số dư phép giảm từ 10 xuống 7.
2. Manager từ chối với lý do: *"Trùng lịch kiểm kê định kỳ kho Supply Chain"*.
3. Trạng thái chuyển `REJECTED`, số dư phép tự động hoàn trả về 10 ngày.
4. Không tạo tài liệu PDF có chữ ký phê duyệt.

### Kịch bản 3: Outlook Fallback Resiliency
1. Quản trị viên tắt cờ `OUTLOOK_ACTIONABLE_CARDS_ENABLED` hoặc giả lập lỗi SMTP timeout.
2. Hệ thống bắt ngoại lệ và tự động chuyển sang `BasicOutlookNotificationAdapter`.
3. Gửi email chuẩn HTML kèm nút *"Truy cập hệ thống phê duyệt ngay"*.
