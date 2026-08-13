# SKILL.md — LPVN HR Workflow SaaS (Antigravity Skills & Capabilities)

## 1. Vai trò
Agent Antigravity đóng vai trò là Senior Full-Stack & Architect Engineer chuyên xây dựng hệ thống **LPVN Flow** với:
- React 19 + TypeScript + Vite.
- Supabase Auth / PostgreSQL / RLS / Storage / Edge Functions.
- Cloudflare Pages / Workers / Cloudflare R2 Storage.
- Form-driven & Event-driven Workflow Engine.
- Outlook Notification Adapter (Basic Email & Advanced Actionable Messages).
- ISO Document Preview & PDF Generation Pipeline.
- Enterprise Auditability & Zero-Trust Security Boundary.

---

## 2. Bối cảnh nghiệp vụ cốt lõi
Hệ thống là web app SaaS nội bộ. Người dùng điền form dữ liệu nghiệp vụ trên web app, không điền trực tiếp trên file Word/PDF. Dữ liệu được lưu vào Supabase PostgreSQL, trải qua luồng duyệt (Approval Engine), phát sinh Domain Event và render dữ liệu vào 3 mẫu biểu ISO chuẩn khi xuất PDF:
- **LPVN-HR-F-0008**: Attendance Confirmation (Giấy xác nhận ngày công).
- **LPVN-HR-F-0013**: Leave Application (Đơn xin nghỉ phép).
- **LPVN-HR-F-0014**: Employee Gate Pass (Giấy xin ra cổng).

---

## 3. Skill: Database & RLS Enforcement (Supabase)
- **Relational Schema**: Phân định bảng dữ liệu rõ ràng, ràng buộc khóa ngoại (foreign keys) và enum/check constraint cho controlled vocabularies.
- **Row Level Security (RLS)**: Bắt buộc cấu hình RLS cho từng bảng. Không coi UI role là ranh giới an ninh.
- **RLS Matrix**:
  - Employee: Chỉ được SELECT/INSERT request của chính mình; không xem dữ liệu phòng ban khác.
  - Manager: Được SELECT request của nhân viên trực thuộc (`manager_id` / `approval_tasks`).
  - Security (Bảo vệ): Chỉ xem và UPDATE phần thông tin ra/vào thực tế trên `gate_pass_requests`.
  - HR: Quyền xử lý hồ sơ nhân sự theo policy.

---

## 4. Skill: Authentication, Authorization & Identity Mapping
- **Identity Provider**: Supabase Auth (Email/Password, Magic Link) + Slot chờ sẵn cho Microsoft Entra ID (Azure AD SSO).
- **Identity Mapping Table**: `entra_identity_mappings` (`entra_object_id` ↔ `employee_id` ↔ `company_email`).
- **Org Chart Manager Resolution**: Thẩm quyền duyệt được tính toán tự động từ DB (`employees.manager_id`), tuyệt đối không tin tưởng `manager_id` hoặc `approver_id` do client gửi lên.

---

## 5. Skill: Decoupled Approval Engine & Notification Engine
- **Domain Events**: Approval Engine phát các sự kiện: `REQUEST_SUBMITTED`, `REQUEST_ASSIGNED`, `REQUEST_APPROVED`, `REQUEST_REJECTED`, `DOCUMENT_GENERATED`, `DOCUMENT_READY`.
- **Notification Adapters**:
  - `InAppAdapter`: Lưu thông báo trong ứng dụng (`notifications`).
  - `EmailAdapter`: Gửi HTML Email responsive.
  - `OutlookAdapter`: Đa chế độ (Basic Mode deep-link `[ 🔎 XEM YÊU CẦU ]` & Advanced Mode Actionable Cards `[ ✅ CHẤP NHẬN ]` / `[ ❌ TỪ CHỐI ]`).
- **Zero M365 Admin Dependency**: Mặc định chạy Basic Mode không cần quyền Tenant Admin.

---

## 6. Skill: Signature Engine
- **Phân loại CSDL**: Bảng `signatures` lưu `signature_type` với giá trị:
  - `ELECTRONIC_IMAGE`: Nét ký / hình ảnh chữ ký quản lý của Manager (MVP).
  - `DIGITAL_CERTIFICATE`: Chữ ký số PKI/x509 (Future upgrade).
- **Bảo mật Chữ ký**: Chữ ký Manager được lưu riêng biệt, chỉ được chèn tự động server-side sau khi `approval_task` chuyển trạng thái `APPROVED` hợp lệ.

---

## 7. Skill: Post-Approval Document Pipeline & Versioning
- **Pipeline**: `APPROVED` → Audit → Signature Resolution → Document Context → Template Version Mapping → PDF Rendering → PDF Validation → Cloudflare R2 → Update Metadata → Employee Notification.
- **Template Versioning**: Mỗi PDF được lưu vết `template_id`, `template_version_id`, `document_hash`, `storage_path`. Không dùng template mới để tái tạo tài liệu lịch sử.

---

## 8. Skill: UI/UX & Design Intelligence (UI UX Pro Max Integration)
- **Superpowers & UI UX Pro Max Skills**: Antigravity kích hoạt khả năng truy vấn 84 UI styles, 192 color palettes, 74 font pairings, 98 UX guidelines thông qua script search chính thức:
  ```bash
  python3 .agent/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "HR SaaS Dashboard" --stack react
  ```
- **Design System Tokens**: Quản lý 3 lớp tokens (Primitive, Semantic, Component) trong `src/styles/globals.css` kết hợp Tailwind CSS v4 và shadcn/ui.

---

## 9. Skill: Antigravity Subagent & Testing Discipline
- **Subagent Parallel Execution**: Sử dụng `invoke_subagent` phân công công việc cho các subagents với các mức model `flash`, `pro`, `inherit`.
- **Empirical Test Verification**: Chạy Vitest suite (`npm test`), linter (`npm run lint`), typecheck (`npm run typecheck`) trước khi hoàn tất bất kỳ task nào.
