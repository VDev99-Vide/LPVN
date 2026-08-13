# RULE.md — Agent Operating Rules

## RULE-001 — Đọc context trước khi code

BẮT BUỘC đọc:

- `agent.md`
- `skill.md`
- `plan.md`
- `state.json`
- tài liệu/template liên quan task

Không bắt đầu coding khi chưa xác định scope của phase.

## RULE-002 — Không phá kiến trúc đang tồn tại

Không tự ý:

- đổi framework.
- đổi backend.
- đổi database.
- thay authentication provider.
- thay hosting provider.
- thay design language.

trừ khi có requirement/decision rõ ràng.

## RULE-003 — Security first

Agent không được coi frontend là security boundary.

Không được:

- bypass RLS.
- nhúng service role key vào browser.
- public signature storage nếu chưa được duyệt.
- tin tưởng role gửi từ client.
- cho phép user tự truyền manager_id để quyết định người duyệt mà không kiểm tra server-side.
- dùng request_id/employee_id trực tiếp như authorization.

## RULE-004 — Không sửa lịch sử nghiệp vụ bằng mutation tùy tiện

Approved/rejected records phải được bảo vệ theo state machine.

Nếu cần correction, tạo correction/audit flow thay vì silent overwrite.

## RULE-005 — Không fake completion

Agent KHÔNG được đánh dấu task DONE khi:

- code chưa chạy.
- test chưa chạy.
- migration chưa áp dụng/kiểm chứng.
- RLS chưa được test.
- document chưa được kiểm tra output.

## RULE-006 — Không bỏ qua lỗi để chạy tiếp

Không được dùng:

- `any` bừa bãi.
- disable TypeScript strict.
- bỏ qua lint bằng comment.
- swallow exception.
- catch rồi không log/handle.

chỉ để làm build xanh.

## RULE-007 — Không đoán nghiệp vụ

Nếu template hoặc requirement không nói rõ:

- policy nghỉ phép.
- ai là manager.
- quyền HR.
- quyền Security.
- cách tính ngày phép.
- giá trị pháp lý của chữ ký.

Agent phải để lại explicit decision point hoặc configuration point, không tự bịa business rule quan trọng.

## RULE-008 — Mẫu ISO là contract trình bày

Không thay đổi label/field/ý nghĩa của mẫu gốc khi chưa có yêu cầu.

Web form có thể UX tốt hơn nhưng phải mapping được về template.

## RULE-009 — Không cho user điền trực tiếp template

Template Word/PDF chỉ dùng cho rendering.

## RULE-010 — Audit everything important

Bắt buộc audit:

- authentication-sensitive actions.
- approval transitions.
- leave balance adjustments.
- employee master changes.
- manager changes.
- signature changes.
- document generation.

## RULE-011 — Idempotency

Action gửi duyệt, approve, reject, generate document, notification phải có chiến lược chống duplicate.

## RULE-012 — Database first for business logic

Logic critical phải được enforce server/database, không chỉ frontend.

## RULE-013 — Không refactor ngoài scope

Task A không phải lý do để refactor B nếu B không cản trở A.

## RULE-014 — Mỗi session phải checkpoint

Sau thay đổi quan trọng:

- cập nhật `state.json`.
- cập nhật next task.
- cập nhật changed files.
- ghi validation.

## RULE-015 — Kết thúc session phải sạch

Trước khi dừng:

- git status rõ ràng.
- không để file tạm ngoài scope.
- state cập nhật.
- blocker được ghi rõ.

## RULE-016 — Thứ tự ưu tiên khi có xung đột

```text
Security
> Data integrity
> Business correctness
> User experience
> Performance
> Convenience
```

## RULE-017 — Không tự nhận “chữ ký số pháp lý”

Chỉ mô tả MVP là signature image/managed signature nếu chưa tích hợp CA/PKI/e-signature provider.

## RULE-018 — Không tiết lộ secrets

Không commit:

- Supabase service role key.
- JWT secret.
- API keys.
- Cloudflare tokens.
- private storage URLs nếu không intended.

## RULE-019 — Review sau mỗi phase

Mỗi phase kết thúc cần review:

- schema.
- security.
- workflow.
- tests.
- UX.
- docs.

## RULE-020 — Có thể dừng

Agent phải dừng implementation và chuyển sang analysis nếu phát hiện requirement xung đột có thể gây sai dữ liệu, sai quyền hoặc sai biểu mẫu chính thức.
