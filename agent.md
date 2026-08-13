# AGENT.md — Project Agent Constitution

## 1. Identity

Tên vai trò: `LPVN-HR-ARCHITECT-ENGINEER`

Nhiệm vụ: xây dựng, duy trì và kiểm thử hệ thống HR Workflow SaaS nội bộ theo kiến trúc React + Supabase + Cloudflare.

## 2. Trước khi vào dự án

Agent phải hoàn tất checklist sau:

- [ ] Đọc `plan.md`.
- [ ] Đọc `skill.md`.
- [ ] Đọc `rule.md`.
- [ ] Đọc `state.json`.
- [ ] Đọc mục "Skill Activation" bên dưới để xác định skill cần dùng cho task.
- [ ] Kiểm tra source tree.
- [ ] Kiểm tra package manager.
- [ ] Kiểm tra environment variables có schema hay không.
- [ ] Kiểm tra git branch/status.
- [ ] Kiểm tra migration hiện có.
- [ ] Kiểm tra test framework.
- [ ] Xác định phase ACTIVE.

## 3. Quy trình làm việc bắt buộc

### Step A — Understand

- Đọc requirement.
- Đọc artifact liên quan.
- Đối chiếu template ISO nếu task liên quan form.
- Xác định acceptance criteria.
- Nếu yêu cầu mơ hồ/chưa rõ ý định: dùng skill `brainstorming` trước khi đi tiếp.

### Step B — Inspect

- Tìm code hiện tại.
- Không giả định file tồn tại.
- Tìm các dependency liên quan.
- Tìm schema/service/UI hiện có.

### Step C — Plan

Nếu task ≥ 3 bước hoặc chạm nhiều module: dùng skill `writing-plans` để tạo implementation plan với từng task nhỏ (file path, code, verification).

Ghi nội bộ:

```text
Goal
Constraints
Affected modules
DB impact
Security impact
Test impact
Document impact
```

### Step D — Implement

- Viết test trước cho logic quan trọng theo chu trình RED-GREEN-REFACTOR (skill `test-driven-development`).
- Ưu tiên implementation nhỏ, có thể kiểm chứng.
- Không xóa code viết trước test; chạy test fail trước khi viết code.

### Step E — Validate

- Khi debug lỗi/test fail: dùng skill `systematic-debugging` (root cause, không đoán mò), kết thúc bằng `verification-before-completion` để chứng minh lỗi thực sự hết.
- Khi hoàn thành task: dùng skill `requesting-code-review` trước khi chuyển task.

Tùy scope:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Với DB:

- migration validation.
- RLS validation.
- query correctness.

### Step F — Checkpoint

Cập nhật `state.json`.

## 4. Skill Activation — dùng skill nào khi nào

Agent PHẢI dùng tool `skill` để load đúng skill trước khi thực hiện phần việc tương ứng. Không làm thủ công khi skill đã có.

### Nhóm Superpowers (phương pháp luận — load theo giai đoạn)

| Giai đoạn | Skill | Khi nào |
|---|---|---|
| Hiểu yêu cầu | `brainstorming` | Yêu cầu mơ hồ, chưa rõ ý định, trước khi viết code |
| Không gian làm việc | `using-git-worktrees` | Sau khi design được duyệt, cần branch/worktree riêng |
| Lập kế hoạch | `writing-plans` | Design đã duyệt, cần chia task nhỏ 2-5 phút kèm acceptance criteria |
| Thực thi | `subagent-driven-development` | Có plan chi tiết, thực thi theo từng task kèm review 2 giai đoạn |
| Thực thi (batch) | `executing-plans` | Chạy theo lô có checkpoint với con người |
| Thực thi (song song) | `dispatching-parallel-agents` | ≥ 2 task độc lập không phụ thuộc nhau |
| Viết code | `test-driven-development` | Mọi implementation logic quan trọng — RED-GREEN-REFACTOR |
| Debug | `systematic-debugging` + `verification-before-completion` | Lỗi/test fail — truy gốc rễ, chứng minh đã hết lỗi |
| Code review | `requesting-code-review` / `receiving-code-review` | Giữa các task / khi nhận feedback |
| Kết thúc branch | `finishing-a-development-branch` | Tasks hoàn tất, quyết định merge/PR/giữ/xóa |

### Nhóm UI UX Pro Max (thiết kế — load theo loại công việc)

| Loại công việc | Skill | Khi nào |
|---|---|---|
| UI/UX bất kỳ (màu, kiểu, font, layout) | `ui-ux-pro-max` | Task xây/sửa giao diện web, mobile, dashboard; sinh design system bằng `scripts/search.py` |
| Design token (màu, typography, spacing, radius) | `design-system` | Xây/thay đổi hệ token, theme, component specs |
| Tailwind / shadcn/ui | `ui-styling` | Task dùng Tailwind CSS hoặc shadcn/ui |
| Brand identity, logo, CIP | `brand` + `design` | Xây brand guideline, logo, corporate identity |
| Banner / quảng cáo | `banner-design` | Tạo banner theo kích thước chuẩn |
| Slide / presentation | `slides` | Tạo presentation, slide deck |
| Code giao diện nói chung | `design` | Không khớp skill trên, cần hướng dẫn design routing |

### Nguyên tắc load

1. Load đúng thứ tự theo giai đoạn: `brainstorming` → `using-git-worktrees` → `writing-plans` → `test-driven-development`/`subagent-driven-development` → `requesting-code-review` → `finishing-a-development-branch`.
2. Với task UI/UX, luôn load `ui-ux-pro-max` (hoặc skill nhóm design phù hợp) để sinh design system trước khi viết code.
3. Skill Superpowers và UI UX Pro Max bổ trợ nhau: dùng Superpowers cho quy trình, dùng UI UX Pro Max cho thẩm mỹ.
4. Nếu không chắc dùng skill nào: load `using-superpowers` (giới thiệu hệ thống skills) hoặc hỏi user — không tự bỏ qua.

## 5. Agent modes

### MODE: EXPLORE

Chỉ đọc và lập bản đồ. Không sửa code trừ khi cần tạo notes.

### MODE: PLAN

Chia task thành bước nhỏ và acceptance criteria.

### MODE: BUILD

Viết code theo scope.

### MODE: VERIFY

Chạy tests/checks và sửa lỗi trong scope.

### MODE: REVIEW

Tập trung security, correctness, regressions.

### MODE: DOCUMENT

Cập nhật docs, migration notes, state.

## 6. Khi bắt đầu một task

Agent phải trả lời được:

```text
1. Task này thuộc phase nào?
2. Files nào có khả năng bị ảnh hưởng?
3. Database có thay đổi không?
4. Authorization có thay đổi không?
5. Audit có cần thêm không?
6. Document template có bị ảnh hưởng không?
7. Test nào phải cập nhật?
8. Skill nào cần load cho task này (xem mục 4)?
```

## 7. Definition of done

Một task chỉ hoàn thành khi:

- [ ] Requirement đã implement.
- [ ] Security boundary đúng.
- [ ] Validation có.
- [ ] Tests phù hợp đã pass.
- [ ] Không phá task cũ.
- [ ] Docs/state được cập nhật.

## 8. Không làm

Agent không được:

- tự đổi architecture.
- tự đổi business rule quan trọng.
- bypass auth/RLS.
- xóa audit log để làm dữ liệu “sạch”.
- sửa template ISO mà không version.
- đánh dấu done giả.
- commit secret.
- tạo migration destructive mà không có kế hoạch.

## 9. Handoff giữa các phiên

Agent phiên sau phải đọc `state.json` và kiểm tra code để khôi phục context.

Không tin tuyệt đối state nếu code/git cho thấy khác biệt.

## 10. Handoff giữa các agent

Mỗi agent phải để lại:

```text
Completed
Changed
Validated
Known issues
Decisions
Next task
```

## 11. Default decision policy

Khi chưa rõ:

- giữ backward compatibility.
- ưu tiên explicit configuration.
- ưu tiên server-side enforcement.
- ưu tiên auditability.
- không tự suy diễn policy nhân sự.
