# LPVN HR Flow SaaS — Hướng Dẫn Triển Khai Production (Production Guide)

## 1. Tổng Quan Kiến Trúc
Hệ thống LPVN HR Flow SaaS được xây dựng theo mô hình Serverless / Edge-first:
- **Frontend SPA:** React 19 + TypeScript + Vite + Tailwind CSS / Vanilla CSS Tokens. Triển khai trên **Cloudflare Pages / Edge CDN**.
- **Backend & Database:** **Supabase PostgreSQL** với Row Level Security (RLS) cho tất cả các bảng dữ liệu, Realtime subscriptions, Edge Functions.
- **Storage:** Cloudflare R2 / Supabase Storage cho lưu trữ biểu mẫu ISO PDF đã duyệt và chữ ký số.
- **Authentication & Directory:** Microsoft Entra ID (Azure AD) OIDC SSO kết hợp đăng nhập mã định danh nhân viên nội bộ Leggett & Platt.
- **Notification Engine:** Adapter đa kênh hỗ trợ Microsoft Actionable Messages (duyệt trực tiếp trong email Outlook) và Basic HTML deep-link.

---

## 2. Các Bước Triển Khai (Go-Live Procedure)

### Bước 1: Khởi tạo Cơ sở dữ liệu Supabase Production
1. Tạo project mới trên [Supabase Console](https://app.supabase.com) (chọn region Singapore hoặc Tokyo).
2. Chạy toàn bộ các migrations trong thư mục `supabase/migrations/`:
   ```bash
   npx supabase db push
   ```
3. Kích hoạt RLS trên tất cả các bảng và kiểm tra bằng `validateRLSMatrix()`.

### Bước 2: Cấu hình Biến Môi Trường (Environment Variables)
Khai báo trên Cloudflare Pages Settings > Environment Variables:
```env
VITE_SUPABASE_URL=https://[YOUR_PROD_PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_PROD_ANON_KEY]
VITE_APP_ENV=production
VITE_APP_BASE_URL=https://lpvn.leggett.com
```

### Bước 3: Đóng Gói và Triển Khai Cloudflare Pages
```bash
npm run build
# Thư mục output: dist/
```

### Bước 4: Cấu Hình Tên Miền & SSL
1. Trỏ DNS CNAME `lpvn.leggett.com` về Cloudflare Pages custom domain.
2. Bật SSL/TLS mode: **Full (Strict)**.

### Bước 5: Sao Lưu & Khôi Phục (Backup & Disaster Recovery)
- PostgreSQL Daily Automated Backups: 00:00 UTC hàng ngày, lưu trữ retention 30 ngày.
- Rollback Procedure: Trong trường hợp có lỗi nghiêm trọng, chuyển hướng Cloudflare Pages về bản build trước đó trong vòng 30 giây.
