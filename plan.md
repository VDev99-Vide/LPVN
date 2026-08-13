# LPVN HR Workflow SaaS — PLAN.md

## 0. Mục tiêu dự án

Xây dựng web app SaaS nội bộ cho quy trình nhân sự gồm:

- Đăng nhập và phân quyền theo cơ cấu phòng ban (org chart).
- Đăng ký giấy phép ra cổng.
- Xác nhận ngày công.
- Xin nghỉ phép.
- Quản lý nhân viên.
- Quản lý phép năm và số ngày đã sử dụng.
- Báo cáo nghỉ theo tháng/năm và theo loại nghỉ.
- Luồng duyệt bởi quản lý trực tiếp.
- Thư viện chữ ký số/nét ký của quản lý để chèn tự động sau khi duyệt.
- Preview dữ liệu vào mẫu ISO trước khi xuất PDF.
- Deployment trên Cloudflare, database/auth trên Supabase.

## 1. Nguyên tắc kiến trúc

### 1.1. SaaS trước, biểu mẫu sau

Người dùng KHÔNG điền trực tiếp vào file Word/PDF. Người dùng điền form dữ liệu nghiệp vụ trong web app. Sau khi dữ liệu được duyệt, hệ thống render dữ liệu vào mẫu biểu chuẩn để preview và xuất PDF.

### 1.2. Single Source of Truth

Dữ liệu nghiệp vụ trong Supabase là nguồn dữ liệu chuẩn. File mẫu ISO chỉ là presentation template.

### 1.3. Approval là trạng thái nghiệp vụ

Mỗi yêu cầu phải có lifecycle rõ ràng, ví dụ:

DRAFT → SUBMITTED → PENDING_APPROVAL → APPROVED / REJECTED → DOCUMENT_GENERATED → COMPLETED

### 1.4. Không hard-code quyền vào UI

UI chỉ phản ánh permission. Quyền thực tế phải được enforce ở backend/database/RLS.

### 1.5. Audit-first

Các hành động quan trọng phải có audit log: tạo đơn, sửa đơn, gửi duyệt, duyệt, từ chối, xuất tài liệu, thay đổi dữ liệu phép, thay đổi manager, thay đổi chữ ký.

## 2. Kiến trúc mục tiêu

```text
Browser
  |
  v
Cloudflare Pages / Workers
  |
  +--> React + TypeScript + Vite
  |      +--> UI / Forms / Workflow / Reports
  |      +--> Document Preview
  |
  +--> Supabase
         +--> Auth
         +--> PostgreSQL
         +--> RLS
         +--> Storage (signature/template/generated docs nếu cần)
         +--> Edge Functions (server-side document generation / privileged actions)

Core domains:
  Employee
  Organization
  Attendance Confirmation
  Leave
  Gate Pass
  Leave Balance
  Approval Workflow
  Signature
  Document Generation
  Notification
  Audit Log
  Reporting
```

## 3. Product modules

### Phase 00 — Project foundation

- [x] Tạo repository và branch strategy.
- [x] Khởi tạo React + TypeScript + Vite.
- [x] Chuẩn hóa ESLint/Prettier/TypeScript strict.
- [x] Thiết lập environment variables.
- [x] Thiết lập CI cơ bản.
- [x] Thiết lập `.agent/` và state management.

### Phase 01 — Design system & UX foundation

- [ ] Tạo design tokens riêng cho hệ thống HR SaaS.
- [ ] Thiết lập typography, spacing, radius, elevation, states.
- [ ] Thiết kế dashboard layout.
- [ ] Thiết kế navigation theo role.
- [ ] Thiết kế form components chuẩn.
- [ ] Thiết kế approval status components.
- [ ] Thiết kế table/filter/pagination.
- [ ] Thiết kế modal/drawer/confirmation patterns.
- [ ] Giữ tinh thần hệ thống mẫu tham khảo: token hóa màu, typography, spacing, radius, elevation, component states thay vì sao chép visual game UI. `DESIGN.md` định nghĩa rõ các token màu, typography, spacing, radius, elevation và nguyên tắc component/state.

### Phase 02 — Supabase foundation

- [ ] Tạo Supabase project.
- [ ] Cấu hình Auth.
- [ ] Tạo schema và migration strategy.
- [ ] Tạo profiles.
- [ ] Tạo departments.
- [ ] Tạo positions.
- [ ] Tạo employee master.
- [ ] Tạo manager relationships.
- [ ] Tạo role/permission model.
- [ ] Tạo RLS policies.
- [ ] Tạo audit log.
- [ ] Viết seed data cho dev.

### Phase 03 — Employee & organization

- [ ] CRUD nhân viên.
- [ ] Employee fields bắt buộc:
  - [ ] Employee Code / Mã số nhân viên.
  - [ ] Full Name / Họ tên.
  - [ ] Department / Bộ phận.
  - [ ] Position / Chức vụ.
  - [ ] Join Date / Ngày vào làm.
- [ ] Mapping nhân viên → quản lý trực tiếp.
- [ ] Mapping phòng ban → manager.
- [ ] Org chart view.
- [ ] Trạng thái active/inactive.

### Phase 04 — Leave & annual leave

- [ ] Danh mục loại nghỉ.
- [ ] Annual Leave.
- [ ] Marriage.
- [ ] Unpaid Leave.
- [ ] Sick Leave.
- [ ] Bereavement.
- [ ] Other.
- [ ] Leave entitlement per year.
- [ ] Leave used.
- [ ] Leave remaining.
- [ ] Tự động kiểm tra balance khi gửi đơn.
- [ ] Không cho âm phép năm nếu policy không cho phép.
- [ ] Lưu snapshot số phép tại thời điểm submit/approve khi cần audit.

Mẫu ISO LPVN-HR-F-0013 hiện có các trường: họ tên, mã số nhân viên, bộ phận, chức vụ, loại nghỉ, tổng số ngày, từ ngày/đến ngày, phép năm được hưởng, phép năm nghỉ, phép năm còn lại và khu vực chữ ký người xin nghỉ + quản lý trực tiếp. fileciteturn0file2L5-L40

### Phase 05 — Gate Pass

- [ ] Form SaaS cho Employee Gate Pass.
- [ ] Loại lý do: công tác / việc riêng hoặc nghỉ việc ra về.
- [ ] Từ giờ → đến giờ.
- [ ] Danh sách tài liệu/vật dụng/tài sản mang theo.
- [ ] Approval by manager.
- [ ] Security view.
- [ ] Actual out / actual in.
- [ ] Security officer.
- [ ] In/export PDF.

Mẫu LPVN-HR-F-0014 có ngày, họ tên, bộ phận, E.Code, lý do, thời gian từ/đến, tài liệu/vật dụng/tài sản mang theo, người đề nghị/xem xét/duyệt và khu vực dành cho bảo vệ ghi thời gian thực tế cùng tên nhân viên bảo vệ. fileciteturn0file3L5-L27

### Phase 06 — Attendance Confirmation

- [ ] Form yêu cầu xác nhận ngày công.
- [ ] Reason.
- [ ] Confirmation date.
- [ ] From/To time.
- [ ] Requested by.
- [ ] Checked by.
- [ ] Approved by.
- [ ] Notes.
- [ ] HR processing state.
- [ ] Export PDF.

Mẫu LPVN-HR-F-0008 có Name, E.Code, Dept., Reason, Confirmation Date, From/To time, Requested by/Checked by/Approved by và ghi chú sau khi trưởng bộ phận duyệt thì gửi HR để ghi nhận chấm công. fileciteturn0file1L6-L26

### Phase 07 — Approval workflow engine

- [ ] Generic workflow model.
- [ ] Resolve direct manager.
- [ ] Create approval task.
- [ ] Approve.
- [ ] Reject with reason.
- [ ] Re-submit/re-open policy nếu được cho phép.
- [ ] Notification inbox.
- [ ] Dashboard pending approvals.
- [ ] Delegation/backup approver chỉ khi policy được xác định rõ.
- [ ] Audit log mọi transition.

### Phase 08 — Digital signature library

- [ ] Signature profile per manager.
- [ ] Upload signature image.
- [ ] Metadata: owner, active, created_at, updated_at.
- [ ] Chỉ manager có quyền quản lý chữ ký của chính mình hoặc role được cấp.
- [ ] Chèn chữ ký vào generated document sau khi approve.
- [ ] Không cho client tự tin cậy path chữ ký để bypass authorization.
- [ ] Signature access phải qua server-side authorization/signed URL hoặc cơ chế tương đương.
- [ ] Audit tất cả thay đổi signature.

> Lưu ý: “chữ ký số” trong phạm vi MVP ở đây nên được định nghĩa là hình ảnh/chữ ký được quản lý và chèn tự động vào biểu mẫu. Đây chưa mặc định là chữ ký số PKI có giá trị pháp lý. Nếu cần PKI/e-signature, phải thiết kế một phase riêng.

### Phase 09 — Document template & rendering

- [ ] Xác định template contract cho từng form.
- [ ] Field mapping giữa database và template.
- [ ] Template versioning.
- [ ] Render HTML/PDF hoặc pipeline server-side phù hợp.
- [ ] Preview before export.
- [ ] PDF generated phải gắn request/document id.
- [ ] Snapshot dữ liệu tại thời điểm generate.
- [ ] Signature insertion sau approval.
- [ ] Không sửa template ISO gốc trực tiếp bởi user.

### Phase 10 — Reporting

- [ ] Dashboard ngày nghỉ tháng.
- [ ] Dashboard ngày nghỉ năm.
- [ ] Theo nhân viên.
- [ ] Theo bộ phận.
- [ ] Theo loại nghỉ.
- [ ] Annual leave entitled.
- [ ] Annual leave used.
- [ ] Annual leave remaining.
- [ ] Sick.
- [ ] Marriage.
- [ ] Bereavement.
- [ ] Personal/unpaid.
- [ ] Other.
- [ ] Export report.

### Phase 11 — Notification

- [ ] In-app notification.
- [ ] Approval task notification.
- [ ] Approved/rejected notification.
- [ ] Document ready notification.
- [ ] Read/unread state.
- [ ] Retry-safe notification job.

### Phase 12 — Security hardening

- [ ] RLS test matrix.
- [ ] Role/permission test matrix.
- [ ] IDOR testing.
- [ ] Cross-department access testing.
- [ ] Signature file access testing.
- [ ] Audit tamper-resistance review.
- [ ] Server-side validation.
- [ ] Input validation/schema validation.
- [ ] Rate limiting cho privileged actions nếu cần.
- [ ] Security headers.
- [ ] Secret scanning.
- [ ] Dependency audit.

### Phase 13 — Testing

- [ ] Unit tests.
- [ ] Integration tests.
- [ ] RLS tests.
- [ ] Workflow tests.
- [ ] Document rendering snapshots.
- [ ] E2E happy path.
- [ ] E2E rejection path.
- [ ] E2E annual leave balance path.
- [ ] E2E security boundary path.

### Phase 14 — Production deployment

- [ ] Production Supabase project.
- [ ] Production migrations.
- [ ] Cloudflare Pages/Workers configuration.
- [ ] Environment variables.
- [ ] Domain.
- [ ] Monitoring/logging.
- [ ] Backup/restore procedure.
- [ ] Deployment rollback procedure.
- [ ] UAT checklist.

## 4. Data model mục tiêu

### Core tables

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
documents
document_versions
notifications
audit_logs
```

### Quan hệ cốt lõi

```text
Employee -> Department
Employee -> Position
Employee -> Manager
Employee -> Roles
Employee -> Leave Balance
Employee -> Requests
Request -> Approval Task(s)
Approved Request -> Document
Manager -> Signature
Document -> Template Version
Everything important -> Audit Log
```

## 5. Workflow chuẩn

### Người dùng

- [ ] Login.
- [ ] Xác định employee/profile/role/department.
- [ ] Chọn nghiệp vụ.
- [ ] Điền form SaaS.
- [ ] Validate.
- [ ] Preview dữ liệu nghiệp vụ.
- [ ] Submit.

### Quản lý

- [ ] Nhận notification.
- [ ] Mở approval task.
- [ ] Xem dữ liệu.
- [ ] Approve hoặc Reject.
- [ ] Nếu Approve: ký/chèn chữ ký theo policy.
- [ ] Request chuyển sang trạng thái approved.

### HR/Security

- [ ] Nhận hồ sơ phù hợp quyền.
- [ ] Xem document.
- [ ] In PDF / lưu hồ sơ.
- [ ] Gate Pass: ghi actual out/in và security officer.
- [ ] Attendance: xử lý ghi nhận chấm công.

## 6. Quy tắc versioning biểu mẫu

- [ ] Mỗi biểu mẫu có `document_no` và `version`.
- [ ] Không overwrite dữ liệu lịch sử khi template thay đổi.
- [ ] Request phải giữ `template_version_id` đã dùng để generate.
- [ ] PDF đã phát hành phải reproducible từ snapshot.

## 7. Định nghĩa hoàn thành

Một phase chỉ được đánh dấu DONE khi:

- [ ] Code hoạt động.
- [ ] Typecheck pass.
- [ ] Lint pass.
- [ ] Test liên quan pass.
- [ ] Không còn TODO quan trọng.
- [ ] Security review cho scope đã hoàn tất.
- [ ] State.json được cập nhật.
- [ ] Changelog/decision log được cập nhật nếu có thay đổi kiến trúc.

## 8. Agent checkpoint protocol

Trước khi bắt đầu phiên:

- [ ] Đọc `state.json`.
- [ ] Đọc `agent.md`.
- [ ] Đọc `rule.md`.
- [ ] Đọc phase đang ACTIVE trong plan.
- [ ] Kiểm tra git status.
- [ ] Chạy `scripts/check-state.sh`.

Sau mỗi task:

- [ ] Cập nhật `state.json`.
- [ ] Ghi changed files.
- [ ] Ghi validation.
- [ ] Ghi next task.

Trước khi kết thúc phiên:

- [ ] Chạy test/typecheck/lint liên quan.
- [ ] Ghi blockers.
- [ ] Ghi decisions.
- [ ] Đảm bảo `state.json` phản ánh đúng code hiện tại.
