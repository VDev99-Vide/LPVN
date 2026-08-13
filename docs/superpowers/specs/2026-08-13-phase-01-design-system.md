# Phase 01 — Design System & UX Foundation (Spec)

> Ngày: 2026-08-13 · Trạng thái: APPROVED (user review pending)

## 1. Goal

Xây nền tảng design system cho LPVN HR Workflow SaaS: token 3 lớp (primitive → semantic → component), Tailwind CSS v4 + shadcn/ui, core components, dashboard shell (sidebar + topbar) và một trang dashboard demo. Hoàn thành Phase 01 trong `plan.md`.

## 2. Context & ràng buộc

- Stack hiện tại: React 19 + TypeScript strict + Vite + Vitest + oxlint + Prettier (phase 00).
- `DESIGN.md` là tài liệu tham khảo *methodology* (token hóa, state communication) — KHÔNG sao chép visual game UI (teal-coral-gold retro, pill, glow shadow).
- Người dùng nghiệp vụ là HR SaaS nội bộ: ưu tiên chuyên nghiệp, rõ ràng, accessible.
- Quyết định user (ADR sắp bổ sung):
  1. Hướng thẩm mỹ: **teal trung tính hóa** — giữ màu teal của file tham khảo nhưng giảm saturation, trung tính hóa cho môi trường doanh nghiệp.
  2. Nền tảng: **Tailwind CSS v4 + shadcn/ui** (Radix primitives) — thay đổi toolchain, cần ADR.
  3. Scope: token 3 lớp + core components + dashboard shell + 1 trang demo dashboard.
  4. Theme: **light + dark** ngay từ đầu (shadcn `.dark` class strategy).

## 3. Kiến trúc token (3 lớp)

### Lớp 1 — Primitive tokens

- **Teal scale** (11 bậc `teal-50 → teal-950`): teal trung tính hóa, giảm saturation so với `#2BA8A2` gốc. Đây là brand primary.
- **Neutral scale** xám lạnh (11 bậc): thay thế cream/surface game-style cho nền, text, border.
- **Status scales**: success (green), warning (amber), destructive (red), info (blue) — phục vụ trạng thái duyệt đơn, alert, badge.
- **Typography**: scale 12 → 36px, hệ số 1.25; font **Inter variable** cài qua `@fontsource-variable/inter`, fallback system UI stack (`system-ui, -apple-system, Segoe UI, sans-serif`).
- **Spacing**: base 4px (`0.25rem`).
- **Radius**: `sm (0.375rem), md (0.5rem), lg (0.625rem), xl (0.75rem), 2xl (1rem), full`.
- **Elevation**: shadow trung tính (`shadow-sm/md/lg`), bỏ colored glow của game UI; focus ring dùng token `ring`.

### Lớp 2 — Semantic tokens

Map theo ngữ cảnh, tự đổi giá trị theo theme light/dark:

- Nền/text: `background`, `foreground`, `card`, `card-foreground`, `muted`, `muted-foreground`, `popover`, `popover-foreground`.
- Cạnh/nhập liệu: `border`, `input`, `ring`, `ring-offset`.
- Hành động: `primary` (+`-foreground`), `secondary` (+`-foreground`), `accent` (+`-foreground`), `destructive` (+`-foreground`).
- Trạng thái nghiệp vụ (component của LPVN): `success`, `warning`, `info` (+ foreground tương ứng).

### Lớp 3 — Component tokens

Convention shadcn: component CHỈ dùng semantic (`bg-primary`, `text-foreground`, `border-border`...), không hít primitive trực tiếp. Tên biến CSS theo shadcn convention (`--primary`, `--background`, ...).

## 4. Triển khai kỹ thuật

- Cài Tailwind v4 qua `@tailwindcss/vite` (không cần `tailwind.config.js`).
- Token khai báo bằng CSS variables trong `src/styles/tokens.css` + `@theme inline` map sang Tailwind utilities (Tailwind v4 chuẩn).
- Dark mode: `class` strategy — class `.dark` trên `documentElement`.
- Setup shadcn/ui (components.json, `cn()` trong `src/lib/utils.ts`).
- Không đổi toolchain hiện tại khác (oxlint, Prettier, Vitest giữ nguyên).

## 5. Component library

**Core (shadcn/ui, tùy chỉnh theo token):**

- Cơ bản: `Button`, `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `Card`.
- Trạng thái: `Badge`, `Alert`.
- Dữ liệu: `Table`, `Tabs`.
- Overlay: `Dialog`, `DropdownMenu`, `Tooltip`, `Avatar`.

**Business (riêng LPVN):**

- `StatusBadge` — wrapper map approval status → variant màu. Controlled vocabulary: `DRAFT, SUBMITTED, PENDING_APPROVAL, APPROVED, REJECTED, DOCUMENT_GENERATED, COMPLETED` (từ plan.md §1.3). Fallback cho status lạ → neutral.

## 6. Dashboard shell & demo page

- `AppShell` = Sidebar (trái) + Topbar (trên) + content outlet.
- Sidebar: logo + navigation theo module (Dashboard, Leave, Gate Pass, Attendance, Employees, Reports) — placeholder items, role-based routing để phase 03+.
- Topbar: search, notification bell, user menu (avatar + tên) + **theme toggle** (light/dark).
- `DashboardPage` (demo): header + 4 KPI cards (Pending approvals, Leave used, Team size, Requests this month — dữ liệu mock) + bảng "Pending approvals" dùng `StatusBadge` + `Badge`.

**Cấu trúc thư mục:**

```
src/
  components/
    ui/          # shadcn components
    layout/      # AppShell, Sidebar, Topbar
    business/    # StatusBadge
  lib/           # utils.ts (cn)
  pages/         # DashboardPage (demo)
  styles/        # tokens.css, globals.css
```

## 7. Testing

- `StatusBadge`: map trạng thái → variant đúng; status lạ → neutral.
- `AppShell`: render sidebar + topbar + content.
- Theme toggle: click đổi class `.dark` trên `documentElement`.
- `DashboardPage`: render KPI + bảng pending approvals.
- Quality gate giữ nguyên: `npm run typecheck && npm run lint && npm test && npm run build` (qua `scripts/quality-gate.sh`).

## 8. Git & process

- Theo ADR-005: Phase 01 là real feature → branch `feature/phase-01-design-system`, commit từng task, PR về main.
- Test trước cho logic (TDD) theo agent.md; debug bằng systematic-debugging; review trước khi merge.
- Cuối phase: cập nhật `plan.md` (tick Phase 01), `state.json` (progress, ADR mới: Tailwind+shadcn, teal direction, light/dark), `next_actions`.

## 9. ADR mới (bổ sung vào state.json)

- `ADR-006`: Design direction — teal trung tính hóa từ DESIGN.md, không sao chép visual game UI; professional HR SaaS.
- `ADR-007`: Phase-01 UI stack — Tailwind CSS v4 + shadcn/ui (Radix primitives), CSS variables tokens, dark mode class strategy.

## 10. Định nghĩa hoàn thành

- [ ] Tailwind v4 + shadcn hoạt động, build xanh.
- [ ] Token 3 lớp + light/dark hoạt động.
- [ ] Core components + StatusBadge có test pass.
- [ ] AppShell + DashboardPage render, demo chạy `npm run dev`.
- [ ] Quality gate pass (typecheck/lint/test/build).
- [ ] state.json + plan.md cập nhật.
