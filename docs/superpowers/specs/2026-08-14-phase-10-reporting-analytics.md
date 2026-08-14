# Phase 10 — Reporting & Analytics Specification

## 1. Mục tiêu & Bối cảnh Nghiệp vụ

Xây dựng hệ thống Báo cáo & Phân tích Dữ liệu Toàn diện cho **LPVN HR Flow SaaS**:
- Cung cấp cái nhìn tổng quan về tình hình nhân sự, nghỉ phép, ra cổng và chấm công theo thời gian thực.
- Cho phép Ban Giám Đốc và Bộ phận HR theo dõi tỷ lệ sử dụng ngày phép năm (Annual Leave Burn Rate) của các phòng ban để cân đối kế hoạch sản xuất.
- Cung cấp công cụ xuất dữ liệu chuẩn định dạng CSV / Excel (hỗ trợ mã hóa tiếng Việt UTF-8 BOM) và in ấn báo cáo tổng kết chuẩn ISO.

---

## 2. Các Chỉ Số KPI & Báo Cáo Trọng Yếu

### 2.1. KPI Metrics
1. **Tổng ngày nghỉ toàn công ty**: Tổng số ngày nghỉ được duyệt trong năm/tháng.
2. **Tỷ lệ sử dụng phép năm**: $\frac{\text{Tổng ngày phép đã dùng}}{\text{Tổng hạn mức phép được cấp}} \times 100\%$.
3. **Lượt xin ra cổng (Gate Pass Count)**: Phân tách theo mục đích Công vụ (Business) và Việc riêng (Personal).
4. **Phiếu điều chỉnh công (Attendance Correction Count)**: Số lượng trường hợp quên quẹt thẻ hoặc điều chỉnh dữ liệu công.

### 2.2. Biểu Đồ Trực Quan
- **Xu hướng theo Tháng (Monthly Trend)**: Số ngày nghỉ qua 12 tháng.
- **So sánh Phòng ban (Department Breakdown)**: Khối Sản xuất, Kỹ thuật, Kho vận, Văn phòng.
- **Cơ cấu Loại nghỉ (Leave Type Composition)**: Phép năm, Nghỉ ốm, Việc riêng, Thai sản, Không hưởng lương.

### 2.3. Bảng Dữ Liệu & Xuất File
- Bảng kê khai chi tiết từng nhân viên: Mã NV, Họ tên, Phòng ban, Hạn mức năm, Phép tồn năm trước, Đã sử dụng, Số dư còn lại, Tỷ lệ %.
- Bộ xuất file CSV/Excel UTF-8 BOM chuẩn.
