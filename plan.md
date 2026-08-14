# LPVN HR Workflow SaaS — PLAN.md

## 0. Mục tiêu dự án

Xây dựng web app SaaS nội bộ cho quy trình nhân sự bao gồm:

- Đăng nhập và phân quyền theo cơ cấu phòng ban (org chart).
- Đăng ký giấy phép ra cổng (Gate Pass).
- Xác nhận ngày công (Attendance Confirmation).
- Xin nghỉ phép (Leave Application).
- Quản lý nhân viên & cơ cấu tổ chức.
- Quản lý phép năm và số ngày đã sử dụng.
- Báo cáo nghỉ theo tháng/năm và theo loại nghỉ.
- Luồng duyệt tự động bởi quản lý trực tiếp (Approval Workflow Engine).
- Tích hợp thông báo & phê duyệt qua Microsoft 365 Outlook (Basic Mode MVP & Advanced Mode khi được IT cấp quyền).
- Thư viện chữ ký nét ký/hình ảnh chữ ký của quản lý để chèn tự động vào văn bản sau khi duyệt.
- Preview dữ liệu vào mẫu ISO trước khi xuất PDF.
- Deployment trên Cloudflare Pages/Workers, database/auth/storage trên Supabase + R2.

---

## 1. Nguyên tắc kiến trúc

### 1.1. SaaS trước, biểu mẫu sau
Người dùng KHÔNG điền trực tiếp vào file Word/PDF. Người dùng điền form dữ liệu nghiệp vụ trong web app. Sau khi dữ liệu được duyệt, hệ thống render dữ liệu vào mẫu biểu chuẩn để preview và xuất PDF.

### 1.2. Single Source of Truth
Dữ liệu nghiệp vụ trong Supabase là nguồn dữ liệu chuẩn. File mẫu ISO chỉ là presentation template.

### 1.3. Approval là trạng thái nghiệp vụ
Mỗi yêu cầu phải có lifecycle rõ ràng:
`DRAFT → SUBMITTED → PENDING_APPROVAL → APPROVED / REJECTED → DOCUMENT_GENERATED → COMPLETED`

### 1.4. Không hard-code quyền vào UI
UI chỉ phản ánh permission. Quyền thực tế phải được enforce ở backend/database/RLS.

### 1.5. Audit-first
Các hành động quan trọng phải có audit log: tạo đơn, sửa đơn, gửi duyệt, duyệt, từ chối, xuất tài liệu, thay đổi dữ liệu phép, thay đổi manager, thay đổi chữ ký.

### 1.6. Approval Engine độc lập khỏi Notification Channel / Outlook
> **LPVN Flow là hệ thống workflow độc lập. Microsoft Outlook chỉ là notification/approval channel, không phải core business system.**

Approval Engine KHÔNG phụ thuộc vào Outlook hay bất kỳ kênh thông báo bên ngoài nào. Approval Engine chỉ phát sinh các Domain Events (`REQUEST_SUBMITTED`, `REQUEST_ASSIGNED`, `REQUEST_APPROVED`, `REQUEST_REJECTED`, `DOCUMENT_GENERATED`, `DOCUMENT_READY`). Notification Engine sẽ lắng nghe event và gửi thông báo qua các adapter độc lập (In-App, Standard Email, Outlook Graph, Actionable Messages, Teams, Zalo,...).

### 1.7. Zero Microsoft 365 Admin Dependency cho MVP
MVP phải hoạt động hoàn hảo ngay cả khi Developer/Hệ thống KHÔNG có quyền Microsoft 365 Tenant Admin, không có `Application Permission`, không có `Admin Consent`, không có Outlook Actionable Messages hoặc không được phép sửa Exchange Online policy.

### 1.8. Dynamic Capability Detection & Progressive Upgrade
Hệ thống tự động phát hiện khả năng tích hợp của tenant (`OutlookCapabilityDetector`):
- Khi chưa có quyền Admin: Hoạt động ở **Basic Email Mode** (gửi email thông báo chứa link an toàn `[ 🔎 XEM YÊU CẦU ]` dẫn về LPVN Flow web app).
- Khi IT/Admin cấp quyền: Bật thêm **Outlook Advanced Approval Mode** (Actionable Message với nút `[ ✅ CHẤP NHẬN ]` / `[ ❌ TỪ CHỐI ]` ngay trong email) mà KHÔNG cần thiết kế lại Approval Engine hay rewrite core business code.

### 1.9. Zero-Trust & Replay-Protected Approval Endpoint
Backend chịu trách nhiệm xác thực tuyệt đối danh tính người duyệt, quyền hạn phê duyệt (`approval_authority`), trạng thái request, token một lần (one-time token) và thời hạn token. Không bao giờ tin tưởng client hay email recipient address. Mọi hành động approve/reject phải sinh audit log và bảo vệ chống replay.

### 1.10. Snapshot Identity & Snapshot Versioning
- `approval_task` lưu thông tin snapshot người duyệt (`approver_employee_id`, `approver_name_snapshot`, `approver_email_snapshot`) tại thời điểm tạo request để tránh trường hợp thay đổi org chart sau này làm sai lệch lịch sử duyệt.
- Document Engine sử dụng đúng `template_id` và `template_version_id` tại thời điểm tạo tài liệu. Không dùng template mới nhất để tái tạo tài liệu lịch sử.

### 1.11. Fail-Safe Approval → Document Pipeline
Khi request chuyển sang `APPROVED`, quy trình sinh PDF, chèn chữ ký và lưu R2 được kích hoạt async. Sự cố sinh PDF hoặc gửi thông báo KHÔNG được làm rollback transaction đã duyệt thành công. Ngược lại, thông báo "đã duyệt" chỉ gửi tới nhân viên sau khi PDF được tạo thành công.

---

## 2. Kiến trúc mục tiêu

### 2.1. Sơ đồ luồng tổng thể LPVN Flow & Microsoft 365 Outlook

```text
                         ┌──────────────────────┐
                         │      LPVN FLOW       │
                         │   React / TypeScript │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Supabase        │
                         │ Auth / PostgreSQL    │
                         │ RLS / Realtime       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Approval Engine    │
                         └──────────┬───────────┘
                                    │
                             REQUEST_SUBMITTED
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Notification Engine  │
                         └──────────┬───────────┘
                                    │
                           ┌────────┴────────┐
                           ▼                 ▼
                    In-App Notification   Email
                                             │
                                             ▼
                                  Microsoft 365 Outlook
                                             │
                                      ┌──────┴──────┐
                                      ▼             ▼
                                  View Request   Future:
                                      │          Approve /
                                      │          Reject
                                      ▼
                                 LPVN Flow
                                      │
                                      ▼
                              Approval Endpoint
                                      │
                                      ▼
                                   Supabase
                                      │
                              ┌───────┴────────┐
                              ▼                ▼
                           APPROVED         REJECTED
                              │
                              ▼
                        Document Engine
                              │
                              ▼
                        Signature Engine
                              │
                              ▼
                        PDF Generator
                              │
                              ▼
                          Cloudflare R2
                              │
                              ▼
                        Employee / HR
```

### 2.2. Kiến trúc phân tách Notification Engine & Adapters

```text
               ┌─────────────────────────────────┐
               │         Approval Engine         │
               └────────────────┬────────────────┘
                                │ (Domain Events)
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
REQUEST_SUBMITTED       REQUEST_APPROVED         REQUEST_REJECTED
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                │
                                ▼
               ┌─────────────────────────────────┐
               │       Notification Engine       │
               └────────────────┬────────────────┘
                                │
   ┌───────────────┬────────────┼────────────┬───────────────┐
   ▼               ▼            ▼            ▼               ▼
InAppAdapter  EmailAdapter OutlookAdapter Future:         Future:
                            │                TeamsAdapter    ZaloAdapter
                   ┌────────┴────────┐
                   ▼                 ▼
              Basic Mode       Advanced Mode
             (Deep Link)    (Actionable Message)
```

---

## 3. Phân tách chi tiết kiến trúc & Mô hình nghiệp vụ

### 3.1. Phân tách Approval Engine và Notification Engine
- **Approval Engine**: Chỉ chịu trách nhiệm quản lý vòng đời yêu cầu (state machine), kiểm tra thẩm quyền duyệt, khởi tạo `approval_tasks` và phát các domain events:
  - `REQUEST_SUBMITTED`
  - `REQUEST_ASSIGNED`
  - `REQUEST_APPROVED`
  - `REQUEST_REJECTED`
  - `DOCUMENT_GENERATED`
  - `DOCUMENT_READY`
- **Notification Engine**: Nhận domain event và phân phối thông báo độc lập qua các adapter:
  - `InAppAdapter`
  - `EmailAdapter`
  - `OutlookAdapter` (gồm `EmailNotification`, `GraphEmailAdapter`, `ActionableMessageAdapter`, `OutlookCapabilityDetector`)
  - `Future: TeamsAdapter`
  - `Future: ZaloAdapter`
- **Tuyệt đối KHÔNG**: Viết business logic phê duyệt trực tiếp vào trong Outlook Adapter.

### 3.2. MVP Không có quyền Microsoft 365 Admin (Outlook Basic Mode - Fallback Mặc định)
Trong MVP, hệ thống hoạt động mặc định theo luồng an toàn tuyệt đối:
```text
Employee
    ↓
Submit Request
    ↓
Supabase
    ↓
Approval Engine
    ↓
Notification Engine
    ↓
Email / Outlook
    ↓
[ 🔎 XEM YÊU CẦU ] (Link bảo mật dính kèm one-time token / deep link)
    ↓
LPVN Flow Web App
    ↓
Manager Authentication
    ↓
Authorization Check (Backend / DB RLS)
    ↓
Approve / Reject
```
**Đặc điểm MVP:**
- Outlook chỉ đóng vai trò kênh nhận thông báo.
- Nút `[ 🔎 XEM YÊU CẦU ]` mở trang chi tiết đơn trên LPVN Flow.
- Manager phải đăng nhập hoặc được xác thực danh tính hợp lệ trước khi thực hiện Approve / Reject.
- KHÔNG yêu cầu Outlook Actionable Message.
- KHÔNG yêu cầu tenant-wide Microsoft Graph Application Permission.
- KHÔNG yêu cầu can thiệp Exchange Online hay chỉnh sửa Outlook client policy.

### 3.3. Outlook Actionable Message (Outlook Advanced Mode - Feature Nâng cấp)
Khi IT/Admin công ty cấp quyền Microsoft 365 (Admin Consent, Actionable Email Provider registration), hệ thống kích hoạt phase `OUTLOOK ADVANCED APPROVAL`.

**Giao diện email khi chưa có quyền Admin (Basic Mode):**
```text
┌───────────────────────────────────────┐
│ 🔔 LPVN SystemBot                    │
│                                       │
│ Có yêu cầu mới cần phê duyệt          │
│                                       │
│ Nguyễn Văn A                          │
│ E00123                                │
│ Nghỉ phép năm                         │
│ 18/08/2026 - 19/08/2026               │
│ 2 ngày                                │
│                                       │
│ [ 🔎 XEM YÊU CẦU ]                    │
└───────────────────────────────────────┘
```

**Giao diện email khi được IT cấp quyền (Advanced Mode):**
```text
┌───────────────────────────────────────┐
│ 🔔 LPVN SystemBot                    │
│                                       │
│ Có yêu cầu mới cần phê duyệt          │
│                                       │
│ Nguyễn Văn A                          │
│ E00123                                │
│ Nghỉ phép năm                         │
│ 18/08/2026 - 19/08/2026               │
│ 2 ngày                                │
│                                       │
│ [ ✅ CHẤP NHẬN ] [ ❌ TỪ CHỐI ]       │
│                                       │
│ [ 🔎 XEM YÊU CẦU ]                    │
└───────────────────────────────────────┘
```

### 3.4. Secure Approval Endpoint & Token Verification
Nếu bật tính năng Approve/Reject trực tiếp từ Outlook (Advanced Mode), endpoint xử lý KHÔNG ĐƯỢC chỉ sử dụng URL dạng `/approve?id=123` đơn giản.

Backend API (`/api/approval/action` hoặc Supabase Edge Function) phải xác minh bắt buộc các tham số:
1. `request_id`: ID của yêu cầu xin nghỉ/xác nhận ngày công/ra cổng.
2. `manager_identity`: Danh tính người duyệt đã được xác thực mã hóa.
3. `action`: Hành động `APPROVE` hoặc `REJECT`.
4. `expiration`: Thời hạn hiệu lực của token duyệt (vd: 72 giờ).
5. `one_time_token`: Token chữ ký một lần chống replay.
6. `request_status`: Kiểm tra trạng thái hiện tại của đơn bắt buộc phải là `PENDING_APPROVAL`.
7. `approval_authority`: Backend kiểm tra người thao tác có đúng là `approver_employee_id` được gán trong `approval_task` hay không.

**Quy tắc chuyển trạng thái (State Machine):**
- Cho phép: `PENDING_APPROVAL` + `valid manager` → `APPROVED` / `REJECTED`.
- Ngăn chặn tuyệt đối:
  - `APPROVED` → `APPROVED` (Tránh trùng lặp)
  - `REJECTED` → `APPROVED` (Tránh đè trạng thái)
  - `REJECTED` → `REJECTED`
- Mọi thao tác duyệt đều bắt buộc ghi nhận bản ghi `audit_logs`.

### 3.5. Xác định Quản lý Trực tiếp & Approval Task Snapshot
Không bao giờ dựa vào địa chỉ email gửi đến để quyết định quyền duyệt. Cơ sở dữ liệu lưu trữ quan hệ tổ chức:
- Bảng `employees`: `id`, `employee_code`, `full_name`, `department_id`, `position`, `manager_id`, `status`.
- Khi nhân viên gửi đơn: `employee_id` → truy tìm `manager_id` tương ứng → khởi tạo `approval_task`.
- `approval_task` lưu **snapshot** tại thời điểm tạo đơn để bảo toàn tính toàn vẹn lịch sử kể cả khi phòng ban/sơ đồ tổ chức thay đổi về sau:
  - `id`
  - `request_id`
  - `approver_employee_id`
  - `approver_name_snapshot`
  - `approver_email_snapshot`
  - `status` (`PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`)
  - `created_at`, `acted_at`, `action`, `comment`

### 3.6. Email Notification Model & Nội dung Email
Email thông báo gửi cho Manager phải chứa đầy đủ thông tin ngữ cảnh để đưa ra quyết định mà không lộ thông tin nhạy cảm không liên quan:
- **Tiêu đề**: `[LPVN Flow] Yêu cầu phê duyệt mới từ {employee_name} ({employee_code})`
- **Nội dung chính**:
  - Tên bot gửi: `🔔 LPVN SystemBot`
  - Họ và tên nhân viên, Mã số nhân viên (MSNV), Bộ phận/Phòng ban, Chức vụ.
  - Loại yêu cầu (Nghỉ phép năm / Ra cổng / Xác nhận ngày công).
  - Thời gian (Từ ngày/giờ đến ngày/giờ), Tổng thời lượng (số ngày/giờ).
  - Nút bấm `[ 🔎 XEM YÊU CẦU ]` (mở LPVN Flow web app).
- **Metadata đi kèm**: `request_id`, `request_type`, `employee_name`, `employee_code`, `department`, `manager`, `created_at`.

### 3.7. Pipeline Xử lý Sau Approval (Approval → Document Pipeline)
Khi Manager bấm duyệt (`APPROVED`):
```text
APPROVED
   ↓
Approval Audit (Ghi audit log hành động duyệt)
   ↓
Signature Resolution (Lấy hình ảnh nét ký của Manager từ Signature Profile)
   ↓
Document Generation (Tạo context dữ liệu gồm form data + signature + audit info)
   ↓
Template Mapping (Khớp dữ liệu vào template ISO tương ứng)
   ↓
PDF Rendering (Render PDF chính xác theo mẫu ISO)
   ↓
PDF Validation (Kiểm tra PDF tạo ra không bị lỗi/0-byte)
   ↓
Store in R2 (Lưu trữ PDF vào Cloudflare R2 / Supabase Storage)
   ↓
Document Metadata in Supabase (Lưu record document_no, hash, storage_path)
   ↓
Notify Employee (Gửi thông báo thành công kèm link xem PDF cho nhân viên)
```
**Xử lý sự cố (Fail-safe):**
- KHÔNG gửi email "Đã duyệt" cho nhân viên trước khi file PDF được tạo và lưu trữ thành công.
- Nếu sinh PDF thất bại: Request ghi nhận trạng thái `DOCUMENT_GENERATION_FAILED`, kích hoạt cơ chế retry tự động và phát cảnh báo audit log tới Admin.

### 3.8. Signature Engine (Thư viện Chữ ký Manager)
Phân định rõ ràng trong hệ thống:
- **MVP Signature**: `ELECTRONIC_IMAGE` (Hình ảnh nét ký/chữ ký mẫu của Manager được quản lý an toàn và chèn tự động vào file PDF).
- **Future Signature**: `DIGITAL_CERTIFICATE` (Tích hợp chữ ký số PKI/x509 khi có yêu cầu pháp lý cao hơn).
- Bảng `signatures` lưu trữ: `id`, `employee_id`, `signature_type` (`ELECTRONIC_IMAGE` / `DIGITAL_CERTIFICATE`), `image_path`, `active`, `created_at`, `updated_at`.
- Tuyệt đối không gọi hình ảnh chữ ký đơn thuần là "Digital Signature" / "Chữ ký số pháp lý" trong UI hay tài liệu hệ thống.

### 3.9. Document Versioning & Reproducibility
Tất cả các tài liệu PDF được tạo ra phải lưu giữ đầy đủ snapshot định danh:
- `request_id`, `template_id`, `template_version`, `generated_at`, `approved_by`, `approved_at`, `signature_id`, `document_hash`, `storage_path`.
- **Ví dụ**: Form `LPVN-HR-F-0013`, phiên bản mẫu `Version 1.0`, ứng với request `REQ-2026-000123`.
- Không bao giờ dùng phiên bản template mới để render lại các tài liệu trong lịch sử nếu template version đã thay đổi.

### 3.10. Outlook Integration Layers & Fallback Strategy
**Các lớp thành phần:**
```text
OutlookIntegration
├── EmailNotification (Định dạng HTML email responsive)
├── GraphEmailAdapter (Gửi mail qua Microsoft Graph API khi có token)
├── ActionableMessageAdapter (Tạo payload Actionable Message Adaptive Card)
└── OutlookCapabilityDetector (Phát hiện quyền & chế độ hoạt động)
```
**Chiến lược Fallback nhiều tầng (Resilience):**
1. Nếu Outlook Advanced (Actionable Message) không khả dụng → Tự động chuyển xuống **Standard Email** chứa link `[ 🔎 XEM YÊU CẦU ]`.
2. Nếu Microsoft Graph API không khả dụng / bị lặp lỗi → Chuyển sang **Alternative Email Provider / SMTP / Resend API**; hệ thống **In-App Notification** vẫn hoạt động độc lập.
3. Nếu gửi Email thất bại hoàn toàn → Ghi nhận `notification_failure_log`, cho phép retry. Lỗi gửi thông báo KHÔNG ĐƯỢC làm rollback giao dịch nghiệp vụ đã duyệt thành công.

### 3.11. Microsoft Entra ID (Azure AD) Integration
- **Nếu Tenant cho phép**: Tích hợp Microsoft Entra ID OAuth2 / OIDC cho Single Sign-On (SSO). Bản ghi ánh xạ identity: `entra_object_id` ↔ `employee_id` ↔ `company_email`.
- **Nếu chưa được phép**: MVP hoạt động bình thường với Supabase Auth (Email/Password hoặc Magic Link) kèm bảng ánh xạ `auth_user` ↔ `employee`.
- KHÔNG biến Microsoft Entra ID thành dependency cứng làm nghẽn việc triển khai MVP. Không dùng email làm định danh bất biến duy nhất.

### 3.12. Quy tắc An ninh & Bảo mật Bắt buộc (Security Rules)
1. KHÔNG lưu trữ mật khẩu Microsoft của người dùng.
2. KHÔNG lưu trữ Outlook API credentials dưới dạng plaintext.
3. KHÔNG commit client secret, tenant ID, private keys vào Git repository.
4. KHÔNG đưa Microsoft Graph access token vào frontend logs hay console.
5. KHÔNG cho phép frontend tự quyết định `approver_id` hoặc truyền `manager_id` để bypass kiểm tra server-side.
6. Backend phải tự truy vấn sơ đồ tổ chức để xác định thẩm quyền duyệt (`approval_authority`).
7. Tất cả hành động phê duyệt (báo duyệt, từ chối) phải được ghi audit log đầy đủ.
8. Approval token gửi qua email phải có thời hạn hết hạn (`expiration`) rõ ràng.
9. Token duyệt phải là one-time token hoặc được bảo vệ chống tấn công phát lại (replay attack protection).
10. Yêu cầu đã duyệt/từ chối tuyệt đối KHÔNG cho phép xử lý lại (idempotent state transition).
11. File PDF đã phát hành và lưu trên R2 KHÔNG ĐƯỢC âm thầm ghi đè.
12. Mọi thay đổi trạng thái đều phải ghi rõ `actor_id` và `timestamp`.

---

## 4. Product modules & Plan Roadmap

### Phase 00 — Project foundation
- [x] Tạo repository và branch strategy.
- [x] Khởi tạo React + TypeScript + Vite.
- [x] Chuẩn hóa ESLint/Prettier/TypeScript strict.
- [x] Thiết lập environment variables.
- [x] Thiết lập CI cơ bản.
- [x] Thiết lập `.agent/` và state management.

### Phase 01 — Design system & UX foundation
- [x] Tạo design tokens riêng cho hệ thống HR SaaS.
- [x] Thiết lập typography, spacing, radius, elevation, states.
- [x] Thiết kế dashboard layout.
- [x] Thiết kế navigation theo role (sidebar placeholder; role thật ở phase sau).
- [x] Thiết kế form components chuẩn.
- [x] Thiết kế approval status components.
- [x] Thiết kế table/filter/pagination (Table component; filter/pagination để phase sau).
- [x] Thiết kế modal/drawer/confirmation patterns (Dialog + Alert + DropdownMenu; drawer/confirmation pattern đầy đủ để phase sau).
- [x] Giữ tinh thần hệ thống mẫu tham khảo: token hóa màu, typography, spacing, radius, elevation, component states.

### Phase 02 — Supabase foundation
- [x] Tạo Supabase project & môi trường dev/staging.
- [x] Cấu hình Auth (Email/Password, Magic Link, chuẩn bị provider slot cho Entra ID).
- [x] Tạo schema và migration strategy.
- [x] Tạo bảng `profiles`, `departments`, `positions`, `employees`.
- [x] Tạo bảng `manager_assignments` & mối quan hệ quản lý trực tiếp.
- [x] Tạo role/permission model (`roles`, `permissions`, `user_roles`).
- [x] Tạo RLS policies cho dữ liệu nhân sự & đơn từ.
- [x] Tạo hệ thống `audit_logs`.
- [x] Viết seed data cho môi trường phát triển.

### Phase 03 — Employee & organization
- [x] Màn hình CRUD quản lý nhân viên.
- [x] Các trường nhân viên bắt buộc: Employee Code, Full Name, Department, Position, Join Date, Email.
- [x] Mapping nhân viên → quản lý trực tiếp (`manager_id`).
- [x] Mapping phòng ban → Trưởng phòng (Department Head).
- [x] Giao diện xem sơ đồ tổ chức (Org Chart View).
- [x] Quản lý trạng thái nhân viên (Active / Inactive).

### Phase 04 — Leave & annual leave
- [x] Danh mục loại nghỉ (Nghỉ phép năm, Kết hôn, Nghỉ không lương, Nghỉ ốm, Tang chế, Khác).
- [x] Entitlement ngày nghỉ hàng năm theo quy định công ty & thâm niên.
- [x] Tính toán số ngày phép đã dùng & số ngày phép còn lại (`leave_balances`).
- [x] Tự động kiểm tra số dư phép khi gửi đơn nghỉ phép.
- [x] Ngăn chặn gửi đơn vượt quá số phép còn lại (trừ trường hợp xin nghỉ không lương).
- [x] Snapshot số ngày phép tại thời điểm submit/approve để audit.

### Phase 05 — Gate Pass
- [x] Web Form SaaS cho Giấy xin ra cổng (Employee Gate Pass - LPVN-HR-F-0014).
- [x] Loại lý do: Công tác / Việc riêng / Nghỉ việc ra về.
- [x] Khung giờ ra/vào dự kiến (From time → To time).
- [x] Danh sách tài liệu/vật dụng/tài sản mang theo.
- [x] Luồng trình duyệt quản lý trực tiếp.
- [x] Giao diện dành riêng cho Bảo vệ cổng (Security View).
- [x] Ghi nhận thời gian ra/vào thực tế & nhân viên bảo vệ ca trực.

### Phase 06 — Attendance Confirmation
- [ ] Web Form SaaS cho Giấy xác nhận ngày công (LPVN-HR-F-0008).
- [ ] Lý do xác nhận (Quên quẹt thẻ, Công tác ngoài, Lỗi máy chấm công,...).
- [ ] Ngày xác nhận & Khung giờ từ/đến.
- [ ] Đơn vị/Phòng ban & Người đề nghị / Người kiểm tra / Người duyệt.
- [ ] Luồng chuyển giao HR ghi nhận chấm công sau khi trưởng bộ phận duyệt.

### Phase 07 — Approval workflow engine
- [ ] Generic approval workflow state machine (`DRAFT`, `SUBMITTED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `DOCUMENT_GENERATED`).
- [ ] Tự động tìm kiếm quản lý trực tiếp (Manager resolution).
- [ ] Tạo `approval_task` kèm snapshot thông tin approver tại thời điểm tạo đơn.
- [ ] Xử lý hành động Approve / Reject kèm lý do rejection.
- [ ] Policy re-submit/re-open đơn khi bị từ chối.
- [ ] Dashboard hiển thị danh sách đơn chờ duyệt (Pending Approvals).
- [ ] Audit log mọi thay đổi trạng thái chuyển giao (state transitions).

### Phase 08 — Digital signature library
- [ ] Signature profile cho từng Manager/Approver.
- [ ] Upload & quản lý nét ký/hình ảnh chữ ký (`ELECTRONIC_IMAGE`).
- [ ] Metadata: owner, active_status, created_at, updated_at.
- [ ] Phân quyền bảo mật: Chỉ Manager được xem/chỉnh sửa chữ ký của chính mình.
- [ ] Tự động chèn chữ ký vào file PDF sau khi yêu cầu được duyệt thành công.
- [ ] Truy xuất chữ ký qua Server-side secure storage URL / Private bucket access.
- [ ] Audit log toàn bộ thao tác thêm/sửa/xóa chữ ký.

### Phase 09 — Document template & rendering
- [ ] Định nghĩa Template Contract cho từng biểu mẫu ISO (LPVN-HR-F-0008, 0013, 0014).
- [ ] Field mapping giữa dữ liệu Supabase và vị trí hiển thị trên mẫu ISO.
- [ ] Quản lý phiên bản mẫu biểu (`document_templates` & `template_versions`).
- [ ] Server-side PDF rendering pipeline (HTML/Canvas/PDFKit/Puppeteer hoặc Edge Function).
- [ ] Màn hình xem trước biểu mẫu (Preview before export PDF).
- [ ] Tự động gán mã tài liệu (`document_no`), mã đơn (`request_id`) và mã hash bảo mật vào file PDF.
- [ ] Snapshot toàn bộ dữ liệu nghiệp vụ tại thời điểm xuất file.

### Phase 10 — Reporting & Analytics
- [ ] Dashboard báo cáo ngày nghỉ theo tháng và năm.
- [ ] Báo cáo chi tiết theo từng nhân viên, bộ phận, loại hình nghỉ.
- [ ] Báo cáo tổng hợp số ngày phép năm được hưởng, đã dùng, còn lại.
- [ ] Xuất báo cáo dữ liệu định dạng Excel / CSV / PDF.

### Phase 11 — Notification Core & Email Integration
- [ ] **Notification Core**:
  - [ ] Thiết lập Domain Notification Events (`REQUEST_SUBMITTED`, `REQUEST_ASSIGNED`, `REQUEST_APPROVED`, `REQUEST_REJECTED`, `DOCUMENT_GENERATED`).
  - [ ] Xây dựng Notification Queue & Retry mechanism.
  - [ ] Notification logs & failure logging.
  - [ ] In-App Notification Center (Hộp thư thông báo trong ứng dụng, đánh dấu đọc/chưa đọc).
- [ ] **Email Notification Engine**:
  - [ ] Xây dựng HTML Email Template Engine responsive, tương thích Outlook.
  - [ ] Email thông báo cho Manager khi có đơn mới chờ duyệt.
  - [ ] Email thông báo cho Employee khi đơn được Duyệt/Từ chối kèm đường link kết quả.
  - [ ] Chèn secure deep link `[ 🔎 XEM YÊU CẦU ]`.

### Phase 11b — Outlook Basic Mode (MVP Default)
- [ ] Thiết lập Email Template chuẩn tương thích Microsoft 365 Outlook.
- [ ] Xây dựng quy trình "View Request" dẫn từ email về LPVN Flow web app.
- [ ] Tạo Secure Deep Links dính kèm short-lived verification tokens.
- [ ] Yêu cầu Manager đăng nhập/xác thực danh tính trước khi duyệt trên web.
- [ ] Đảm bảo vận hành hoàn hảo 100% mà KHÔNG cần quyền Admin Microsoft 365.

### Phase 11c — Microsoft Entra ID (Azure AD) Integration
- [ ] Đánh giá khả năng tích hợp (Capability Assessment) của Tenant.
- [ ] Cấu hình OAuth2 / OpenID Connect (OIDC) Single Sign-On (SSO).
- [ ] Ánh xạ danh tính (Identity Mapping): `entra_object_id` ↔ `employee_id` ↔ `company_email`.
- [ ] Ánh xạ Vai trò / Role Mapping từ Entra ID Groups sang LPVN Flow Roles.
- [ ] Cơ chế Auth Fallback tự động khi Entra ID không khả dụng.

### Phase 11d — Outlook Advanced Approval Mode (Feature Nâng cấp)
- [ ] Tích hợp Microsoft Graph Email API Adapter.
- [ ] Thiết kế Actionable Message Adaptive Card (Nút `[ ✅ CHẤP NHẬN ]`, `[ ❌ TỪ CHỐI ]`, `[ 🔎 XEM YÊU CẦU ]`).
- [ ] Xây dựng Secure Action Approval Endpoint (`/api/approval/action`).
- [ ] Kiểm tra Token mã hóa, hạn dùng và xác thực quyền duyệt (`approval_authority`).
- [ ] Cơ chế Replay Protection (Chống nhấn lại nút duyệt nhiều lần).
- [ ] `OutlookCapabilityDetector` tự động chuyển đổi giữa Basic Mode và Advanced Mode.

### Phase 11e — Approval → Document Pipeline Integration
- [ ] Kích hoạt quy trình tự động ngay sau khi sự kiện `REQUEST_APPROVED` phát ra.
- [ ] Tự động lấy nét ký (Signature Resolution) của Manager.
- [ ] Khóa phiên bản mẫu biểu (`Template Version Locking`).
- [ ] Sinh file PDF chuẩn ISO & Validate dung lượng/trạng thái file.
- [ ] Lưu trữ file PDF an toàn vào Cloudflare R2 / Supabase Storage.
- [ ] Cập nhật Document Metadata (`document_hash`, `storage_path`, `generated_at`).
- [ ] Gửi thông báo hoàn tất đính kèm link tải PDF tới Nhân viên.

### Phase 12 — Security hardening
- [ ] RLS test matrix cho tất cả các bảng dữ liệu.
- [ ] Kiểm thử phân quyền Role/Permission (RBAC & ABAC).
- [ ] Kiểm thử chống IDOR (Insecure Direct Object References).
- [ ] Kiểm thử ranh giới truy cập giữa các phòng ban.
- [ ] Kiểm thử bảo mật truy cập file chữ ký của Manager.
- [ ] Kiểm tra chống sửa đổi Audit Logs (Audit tamper-resistance review).
- [ ] Server-side input validation & schema sanitization.
- [ ] Rate limiting cho các privileged approval endpoints.
- [ ] Secret scanning & kiểm tra bảo mật dependency.

### Phase 13 — Testing & Quality Assurance
- [ ] Unit tests cho Business Logic & State Machines.
- [ ] Integration tests cho Approval Engine & Notification Adapters.
- [ ] Testing RLS policies với các vai trò người dùng khác nhau.
- [ ] Snapshot testing cho rendering tài liệu ISO.
- [ ] E2E Testing luồng Happy Path (Tạo đơn → Gửi email → Manager duyệt → Sinh PDF → Lưu R2 → Thông báo).
- [ ] E2E Testing luồng Rejection Path & Balance checking.
- [ ] E2E Testing cơ chế Fallback khi Outlook Advanced bị tắt/lỗi.

### Phase 14 — Production deployment
- [ ] Khởi tạo Production Supabase project & cấu hình môi trường.
- [ ] Áp dụng Database Migrations chính thức.
- [ ] Cấu hình Cloudflare Pages / Workers & Environment Variables.
- [ ] Cấu hình Tên miền chính thức & Custom Mail Domain.
- [ ] Thiết lập hệ thống Monitoring, Error Tracking & Centralized Logging.
- [ ] Xây dựng quy trình Backup / Restore dữ liệu định kỳ.
- [ ] Deployment Rollback Procedure.
- [ ] Nghiệm thu sản phẩm (UAT Checklist).

---

## 5. Data model mục tiêu

### 5.1. Bảng dữ liệu cốt lõi (Core Tables)
```text
profiles
employees
employee_roles
roles
permissions
role_permissions
departments
positions
manager_assignments
leave_types
leave_balances
leave_requests
gate_pass_requests
attendance_confirmation_requests
approval_tasks
approval_actions
signatures
document_templates
template_versions
documents
notifications
notification_logs
notification_queues
entra_identity_mappings
audit_logs
```

### 5.2. Quan hệ cốt lõi
```text
Employee -> Department
Employee -> Position
Employee -> Manager (qua manager_id hoặc manager_assignments)
Employee -> Roles
Employee -> Leave Balance
Employee -> Requests (Leave / Gate Pass / Attendance)
Request -> Approval Task (lưu Approver Snapshot tại thời điểm tạo đơn)
Approved Request -> Document (chứa template_version_id, document_hash, storage_path)
Manager -> Signature (phân loại signature_type: ELECTRONIC_IMAGE / DIGITAL_CERTIFICATE)
Document -> Template Version
Entra Identity -> Employee Mapping
Notification Event -> Notification Queue -> Notification Log
Everything Important -> Audit Log
```

---

## 6. Workflow chuẩn

### 6.1. Người dùng (Employee)
1. Đăng nhập hệ thống (Supabase Auth / Entra ID SSO).
2. Hệ thống xác định danh tính `employee`, `department`, `role`.
3. Chọn loại nghiệp vụ (Xin nghỉ / Ra cổng / Xác nhận ngày công).
4. Điền Form dữ liệu SaaS (nhập thông tin, thời gian, lý do).
5. Hệ thống kiểm tra điều kiện (vd: số dư phép năm).
6. Xem trước dữ liệu nghiệp vụ (Preview).
7. Bấm Submit → Tạo Request & phát event `REQUEST_SUBMITTED`.

### 6.2. Quản lý (Manager)
1. Nhận thông báo (In-App Notification & Email/Outlook).
2. Mở đơn từ link `[ 🔎 XEM YÊU CẦU ]` trong email hoặc bấm nút duyệt trực tiếp nếu bật Advanced Mode.
3. Xem chi tiết thông tin đơn.
4. Đăng nhập / Xác thực thẩm quyền duyệt.
5. Bấm **Approve** (Chấp nhận) hoặc **Reject** (Từ chối kèm lý do).
6. Nếu Approve: Hệ thống tự động gán nét ký của Manager vào bản ghi duyệt.
7. Request chuyển trạng thái `APPROVED` & phát event `REQUEST_APPROVED`.

### 6.3. Xử lý Tự động & HR/Security
1. **Pipeline Tự động**: Nhận event `REQUEST_APPROVED` → Lấy chữ ký → Render PDF ISO → Validate PDF → Lưu R2 → Ghi metadata → Gửi thông báo kèm link PDF cho Nhân viên.
2. **HR / Security**:
   - HR tiếp nhận dữ liệu đã duyệt để ghi nhận chấm công / trừ phép.
   - Security (Bảo vệ): Mở màn hình Security View kiểm tra thông tin Gate Pass, ghi nhận giờ ra/vào thực tế và lưu mã ca trực.

---

## 7. Quy tắc versioning biểu mẫu & Tài liệu

- Mỗi biểu mẫu ISO có mã biểu mẫu (`document_no`) và phiên bản (`version`).
- KHÔNG overwrite dữ liệu lịch sử khi template thay đổi.
- Request phải lưu đúng `template_version_id` được sử dụng để generate.
- PDF đã phát hành phải có tính tái tạo chính xác (reproducible) từ dữ liệu snapshot.

---

## 8. Định nghĩa hoàn thành (Definition of Done)

### 8.1. DoD chung cho các Phase
Một phase chỉ được đánh dấu **DONE** khi:
- [ ] Code hoạt động đúng yêu cầu.
- [ ] Typecheck pass (`npm run typecheck`).
- [ ] Lint pass (`npm run lint`).
- [ ] Tests liên quan pass (`npm test`).
- [ ] Không còn TODO quan trọng chưa xử lý.
- [ ] Security review cho scope đã hoàn tất.
- [ ] `state.json` được cập nhật.
- [ ] Changelog / Decision Log được cập nhật nếu có thay đổi kiến trúc.

### 8.2. DoD riêng cho Tính năng Approval & Microsoft 365 Outlook Integration
Feature Outlook & Approval Engine chỉ được đánh dấu **DONE** khi:
- [ ] MVP vận hành hoàn hảo 100% mà KHÔNG cần quyền Microsoft 365 Tenant Admin.
- [ ] Manager nhận được notification qua Email / In-App.
- [ ] Manager có thể mở request qua link bảo mật `[ 🔎 XEM YÊU CẦU ]`.
- [ ] Manager bắt buộc được xác thực trước khi thực hiện thao tác duyệt.
- [ ] Backend tự kiểm tra thẩm quyền duyệt (`approval_authority`) dựa trên sơ đồ tổ chức.
- [ ] Thao tác Approve / Reject được ghi nhận vào `audit_logs`.
- [ ] Approval Token có thời hạn và bảo vệ chống replay (không thể duyệt lại đơn đã xử lý).
- [ ] File PDF tự động được sinh ra ngay sau khi trạng thái chuyển sang `APPROVED`.
- [ ] File PDF sử dụng chính xác `template_version` tại thời điểm duyệt.
- [ ] Hình ảnh chữ ký được đính kèm đúng Manager duyệt.
- [ ] File PDF được lưu trữ an toàn trên R2 và xác thực không lỗi.
- [ ] Nhân viên nhận được thông báo kết quả phê duyệt kèm link tải file PDF.
- [ ] Outlook Advanced Mode (Actionable Messages) là tính năng optional, có thể bật/tắt linh hoạt.
- [ ] Việc tắt hoặc lỗi từ phía Outlook KHÔNG làm hỏng hay đứt gãy Approval Engine core.

---

## 9. Agent checkpoint protocol

### Trước khi bắt đầu phiên:
- [ ] Đọc `state.json`.
- [ ] Đọc `agent.md`.
- [ ] Đọc `rule.md`.
- [ ] Đọc phase đang ACTIVE trong `plan.md`.
- [ ] Kiểm tra git status.
- [ ] Chạy `scripts/check-state.sh`.

### Sau mỗi task:
- [ ] Cập nhật `state.json`.
- [ ] Ghi changed files.
- [ ] Ghi validation.
- [ ] Ghi next task.

### Trước khi kết thúc phiên:
- [ ] Chạy test/typecheck/lint liên quan.
- [ ] Ghi blockers.
- [ ] Ghi decisions.
- [ ] Đảm bảo `state.json` phản ánh đúng code hiện tại.
