# LPVN HR Flow — Phase 14: Production Deployment Specification

## 1. Mục tiêu (Objective)
Chuẩn bị và hoàn thiện toàn diện các tiêu chuẩn triển khai môi trường Production (Go-Live) cho hệ thống LPVN HR Flow SaaS tại nhà máy Leggett & Platt:
- **Production Supabase Configuration:** Kiểm định biến môi trường (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, Database URL, JWT Secrets, Storage Bucket `lpvn-documents-r2`).
- **Database Migrations Release:** Xác nhận toàn bộ 14 tệp SQL migrations đã sẵn sàng để migrate lên production database với RLS và indexes.
- **Cloudflare Pages / Workers Deployment:** Cấu hình file `wrangler.toml` / build script cho Cloudflare Pages edge delivery.
- **Domain & SSL Setup:** Tên miền sản xuất `https://lpvn.leggett.com` kèm SSL/TLS 1.3 và CORS headers nghiêm ngặt.
- **Monitoring & Logging:** Hệ thống giám sát uptime, error telemetry, audit log streaming và webhook alerts.
- **Backup & Disaster Recovery:** Kế hoạch sao lưu tự động hàng ngày (Daily automated PostgreSQL backups) và quy trình Rollback.
- **UAT Sign-off Matrix:** Bộ tiêu chí nghiệm thu người dùng cho 4 nhóm vai trò (Nhân viên, Team Leader, Supervisor, Admin).

---

## 2. Danh Mục Kiểm Tra Nghiệm Thu (UAT Sign-off Checklist)

| STT | Nghiệp Vụ / Hạng Mục | Tiêu Chí Đạt (Acceptance Criteria) | Trạng Thái |
|---|---|---|---|
| 1 | Xác thực & Đăng nhập | Đăng nhập Microsoft 365 Entra ID SSO hoặc User/Pass, ghi nhớ phiên, logo Leggett.jpg | SẴN SÀNG |
| 2 | Biểu mẫu ISO 0013, 0014, 0008 | Hiển thị chuẩn viền ISO kép, form validation, đính kèm chứng từ y tế | SẴN SÀNG |
| 3 | Duyệt đơn & Phân quyền RBAC | Team Leader & Supervisor duyệt theo phòng Supply Chain, huy hiệu số lượng đơn chờ | SẴN SÀNG |
| 4 | Ký số điện tử & Lưu trữ | Vẽ chữ ký canvas, đóng dấu nét ký vào văn bản duyệt, lưu snapshot SHA-256 | SẴN SÀNG |
| 5 | Tự động hóa Pipeline | Sinh PDF chuẩn in ấn, mã băm bất biến, lưu trữ R2, thông báo đa kênh | SẴN SÀNG |
| 6 | Thống kê & Top Rank | Dashboard Supervisor thống kê nghỉ phép tháng, top rank phép năm/phép bệnh | SẴN SÀNG |
| 7 | An Ninh OWASP & RLS Matrix | 8 bảng RLS bảo vệ 100%, chống IDOR, kiểm toán HMAC-SHA256 bất biến | SẴN SÀNG |
| 8 | Hiệu năng & Build | Thời gian tải trang < 1.2s, bundle size tối ưu, 100% Quality Gate passed | SẴN SÀNG |
