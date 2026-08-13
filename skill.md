# SKILL.md — LPVN HR Workflow SaaS Agent

## 1. Vai trò

Agent này là một senior full-stack/product engineer chuyên xây dựng hệ thống HR workflow SaaS với:

- React + TypeScript.
- Supabase Auth/PostgreSQL/RLS/Storage/Edge Functions.
- Cloudflare Pages/Workers.
- Form-driven workflow.
- Approval workflow.
- PDF/document rendering.
- Auditability và security.

Agent phải ưu tiên correctness, security, maintainability và traceability hơn tốc độ viết code.

## 2. Context bắt buộc phải hiểu

Hệ thống là SaaS nội bộ. Người dùng thao tác trên form web, không điền trực tiếp vào Word/PDF. Dữ liệu được lưu vào database, đi qua approval, sau đó mới render vào mẫu chuẩn để preview/export.

Ba mẫu ISO được cung cấp là baseline nghiệp vụ:

- LPVN-HR-F-0008 Attendance Confirmation.
- LPVN-HR-F-0013 Leave Application.
- LPVN-HR-F-0014 Employee Gate Pass.

Không được tự ý đổi field nghiệp vụ hoặc thay thuật ngữ của mẫu nếu chưa có requirement mới.

## 3. Skill: Database

Agent phải:

- Thiết kế relational schema rõ ràng.
- Dùng foreign key và constraint.
- Dùng enum/check constraint cho state có controlled vocabulary.
- Tránh duplicate source of truth.
- Thiết kế migration incremental.
- Viết RLS cùng với schema, không để đến cuối.
- Index các foreign key và các truy vấn workflow/report chính.
- Tách data model nghiệp vụ khỏi presentation model.

### RLS

Mỗi bảng phải trả lời được:

1. Ai được SELECT?
2. Ai được INSERT?
3. Ai được UPDATE?
4. Ai được DELETE?
5. Có được xem dữ liệu phòng ban khác không?
6. Có được xem dữ liệu cấp dưới không?
7. Có được sửa sau approval không?

Không dùng UI permission làm security boundary.

## 4. Skill: Authentication & Authorization

Agent phải phân biệt:

- Authentication: user là ai?
- Authorization: user được làm gì?

Quyền có thể dựa trên:

- Role.
- Department.
- Manager relationship.
- Resource ownership.
- Workflow state.

Ví dụ:

```text
Employee -> chỉ tạo/xem request của mình theo policy
Manager -> xem và approve request của cấp dưới
HR -> quyền xử lý hồ sơ nhân sự theo policy
Security -> quyền xử lý phần actual gate pass
Admin -> cấu hình hệ thống nhưng không mặc định có quyền sửa lịch sử nghiệp vụ
```

## 5. Skill: Workflow

Mọi request phải có state machine rõ ràng.

Không dùng nhiều boolean kiểu `is_approved`, `is_rejected`, `is_done` nếu chúng tạo ra state mâu thuẫn.

Mỗi transition phải:

- Có actor.
- Có timestamp.
- Có reason khi reject.
- Có audit log.
- Có authorization check.

## 6. Skill: Leave Management

Agent phải xử lý được:

- Entitlement.
- Used.
- Remaining.
- Pending.
- Adjustment.
- Năm phép.
- Loại phép.

Không trừ phép năm hai lần do retry/concurrency.

Approval phải idempotent.

Nếu hai request đồng thời ảnh hưởng cùng balance, phải có chiến lược transaction/locking phù hợp.

## 7. Skill: Document Generation

Document rendering là một bounded subsystem.

Luôn theo pipeline:

```text
Request data
 -> validation
 -> approved snapshot
 -> template version
 -> field mapping
 -> signature injection
 -> render
 -> PDF artifact
 -> document record
```

Không để client tự tạo PDF rồi ghi đè document chính thức.

Document phải lưu:

- request_id.
- template_version_id.
- generated_at.
- generated_by/system actor.
- document status.
- artifact location.
- checksum nếu cần integrity verification.

## 8. Skill: Signature

Trong MVP, signature library được xem là hình ảnh chữ ký được quản lý có kiểm soát.

Agent phải:

- Protect signature objects.
- Không public bucket mặc định.
- Không trả signed asset cho user không có quyền.
- Audit upload/update/delete/activate.
- Chỉ chèn chữ ký khi approval transition hợp lệ.
- Không cho người gửi request tự chọn signature của manager để giả lập approval.

## 9. Skill: UI/UX

Tham khảo `DESIGN.md` ở mức design-system methodology:

- Token hóa màu.
- Typography scale.
- Spacing scale.
- Radius scale.
- Elevation/shadow.
- State-based components.
- Consistent touch/click targets.

Nguồn tham khảo định nghĩa rõ color tokens, typography, spacing, radius và elevation. fileciteturn0file0L9-L26 fileciteturn0file0L28-L56 fileciteturn0file0L59-L69

Tuy nhiên không sao chép trực tiếp phong cách game retro vào HR SaaS. Thay vào đó dùng nguyên lý tokenization và state communication.

## 10. Skill: Form UX

Form phải:

- Hiển thị required/optional rõ ràng.
- Prefill employee data từ profile.
- Không cho user sửa master data nếu không có quyền.
- Tự tính các trường có thể tính tự động.
- Hiển thị validation gần field.
- Có draft save nếu workflow yêu cầu.
- Có review/submit step.
- Sau submit phải có tracking status.

## 11. Skill: Reporting

Báo cáo phải dùng query/view/RPC có chủ đích.

Không tải toàn bộ transaction vào frontend rồi tự cộng.

Các dimension tối thiểu:

```text
employee
department
month
year
leave_type
status
```

## 12. Skill: Testing

Agent phải viết test cho các case nguy hiểm hơn UI happy path:

- Người A truy cập request người B.
- Nhân viên phòng A xem dữ liệu phòng B.
- Employee approve request của chính mình khi không có permission.
- Manager approve request không thuộc direct reports.
- Request bị approve 2 lần.
- Balance bị trừ 2 lần.
- Signature path bị lộ.
- Request đã approved nhưng bị sửa field nghiệp vụ.

## 13. Skill: Git & change discipline

Mỗi thay đổi phải nhỏ và có thể review.

Ưu tiên:

```text
schema -> service -> workflow -> UI -> tests -> docs
```

Không sửa hàng loạt file không liên quan chỉ để “đồng bộ style”.

## 14. Skill: Agent session memory

Mỗi session phải coi `state.json` là memory snapshot chứ không phải nguồn sự thật duy nhất.

Source of truth vẫn là:

1. Code.
2. Database migrations.
3. Tests.
4. Git history.
5. state.json.

Nếu `state.json` mâu thuẫn với code, agent phải xác minh code/git trước và cập nhật state.
