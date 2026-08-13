# Phase 01 — Design System & UX Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây design system cho LPVN HR Workflow SaaS: Tailwind v4 + shadcn/ui, token 3 lớp (teal trung tính hóa, light+dark), core components, AppShell (sidebar + topbar + theme toggle) và DashboardPage demo.

**Architecture:** Tailwind CSS v4 qua `@tailwindcss/vite` (không `tailwind.config.js`); token bằng CSS variables trong `src/styles/globals.css` + `@theme inline` map sang utilities; dark mode class strategy (`.dark` trên `documentElement`); shadcn/ui components trong `src/components/ui`; business component `StatusBadge`; layout components trong `src/components/layout`; alias `@/` → `src/`.

**Tech Stack:** Tailwind CSS v4, shadcn/ui (Radix primitives, new-york style), lucide-react, clsx + tailwind-merge, @fontsource-variable/inter, Vite 8 + React 19 + TS strict + Vitest + RTL (sẵn có).

**Spec:** `docs/superpowers/specs/2026-08-13-phase-01-design-system.md`

## Global Constraints

- Prettier: no semicolons, single quotes, printWidth 100 (`.prettierrc.json`) — mọi code block phải theo.
- TS strict, `noUnusedLocals`, `noUnusedParameters` — không dùng `any` bừa bãi.
- No code comments trừ khi bắt buộc.
- Quality gate bắt buộc pass: `npm run typecheck && npm run lint && npm test && npm run build`.
- Component CHỈ dùng semantic tokens (`bg-primary`, `text-foreground`...), không hít primitive trực tiếp.
- Teal trung tính hóa: giảm saturation so với `#2BA8A2`; KHÔNG sao chép visual game UI (pill 999rpx, glow shadow, cream).
- Không sửa file governance gốc: `agent.md`, `plan.md`, `rule.md`, `skill.md`, `DESIGN.md` (trừ tick Phase 01 ở Task 7).
- Toàn bộ code mới nằm trong branch `feature/phase-01-design-system` (tạo trước Task 1).

---

### Task 1: Tailwind v4 + alias + cn() + components.json

**Files:**
- Create: `src/lib/utils.ts`, `components.json`, `src/styles/globals.css`
- Modify: `vite.config.ts`, `tsconfig.app.json`
- Install: `npm install tailwindcss @tailwindcss/vite @fontsource-variable/inter clsx tailwind-merge`

**Interfaces:**
- Consumes: phase-00 scaffold (`vite.config.ts`, `tsconfig.app.json`, npm).
- Produces: `cn(...inputs)` trong `src/lib/utils.ts`; alias `@/*` dùng được trong TS + Vite; `components.json` + `globals.css` sẵn sàng cho shadcn CLI (Task 3); Tailwind hoạt động với `npm run dev`.

- [ ] **Step 1: Cài dependencies**

```bash
npm install tailwindcss @tailwindcss/vite @fontsource-variable/inter clsx tailwind-merge
```

Expected: exit 0.

- [ ] **Step 2: Thêm Tailwind plugin + alias vào `vite.config.ts`**

Toàn bộ nội dung mới của file:

```ts
/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 3: Thêm paths vào `tsconfig.app.json`**

Thêm vào `compilerOptions` (sau `"strict": true`):

```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
```

- [ ] **Step 4: Tạo `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Tạo `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 6: Tạo `src/styles/globals.css` (scaffold tối thiểu)**

```css
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));
```

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: cả 3 exit 0 (globals.css chưa dùng nhưng phải build được).

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts tsconfig.app.json src/lib/utils.ts components.json src/styles/globals.css package.json package-lock.json
git commit -m "feat: add tailwind v4, path alias and cn utility"
```

---

### Task 2: Design tokens — 3 lớp, light + dark

**Files:**
- Modify: `src/styles/globals.css` (toàn bộ token system)

**Interfaces:**
- Consumes: Task 1 (`@import 'tailwindcss'`, `@custom-variant dark`).
- Produces: CSS variables `--background/--foreground/--card/--primary/--muted/--accent/--destructive/--border/--input/--ring/--radius` + LPVN `--success/--warning/--info` (cả light `:root` lẫn `.dark`); utilities `bg-success`, `text-warning-foreground`, `font-sans`... qua `@theme inline`; `--font-sans` = Inter Variable.

- [ ] **Step 1: Ghi toàn bộ nội dung `src/styles/globals.css`**

```css
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --font-sans:
    'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(0.985 0.004 220);
  --foreground: oklch(0.21 0.02 220);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.21 0.02 220);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.21 0.02 220);
  --primary: oklch(0.45 0.1 195);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.94 0.008 220);
  --secondary-foreground: oklch(0.3 0.02 220);
  --muted: oklch(0.955 0.006 220);
  --muted-foreground: oklch(0.5 0.015 220);
  --accent: oklch(0.93 0.02 195);
  --accent-foreground: oklch(0.35 0.06 195);
  --destructive: oklch(0.55 0.19 25);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.91 0.006 220);
  --input: oklch(0.91 0.006 220);
  --ring: var(--primary);
  --success: oklch(0.58 0.13 155);
  --success-foreground: oklch(0.99 0 0);
  --warning: oklch(0.78 0.12 75);
  --warning-foreground: oklch(0.3 0.06 75);
  --info: oklch(0.58 0.13 235);
  --info-foreground: oklch(0.99 0 0);
}

.dark {
  --background: oklch(0.18 0.015 220);
  --foreground: oklch(0.95 0.005 220);
  --card: oklch(0.22 0.015 220);
  --card-foreground: oklch(0.95 0.005 220);
  --popover: oklch(0.22 0.015 220);
  --popover-foreground: oklch(0.95 0.005 220);
  --primary: oklch(0.72 0.09 195);
  --primary-foreground: oklch(0.18 0.03 195);
  --secondary: oklch(0.28 0.015 220);
  --secondary-foreground: oklch(0.95 0.005 220);
  --muted: oklch(0.27 0.015 220);
  --muted-foreground: oklch(0.72 0.01 220);
  --accent: oklch(0.3 0.03 195);
  --accent-foreground: oklch(0.85 0.04 195);
  --destructive: oklch(0.62 0.17 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.3 0.015 220);
  --input: oklch(0.3 0.015 220);
  --ring: var(--primary);
  --success: oklch(0.7 0.12 155);
  --success-foreground: oklch(0.2 0.05 155);
  --warning: oklch(0.76 0.11 75);
  --warning-foreground: oklch(0.24 0.05 75);
  --info: oklch(0.68 0.12 235);
  --info-foreground: oklch(0.2 0.05 235);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: cả 3 exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: add three-layer design tokens with light and dark themes"
```

---

### Task 3: Thêm shadcn/ui components

**Files:**
- Create: `src/components/ui/*` — button, input, label, textarea, select, checkbox, card, badge, alert, table, tabs, dialog, dropdown-menu, tooltip, avatar (qua shadcn CLI)
- Install: radix deps + lucide-react (tự động qua CLI)

**Interfaces:**
- Consumes: Task 1 `components.json` + `src/styles/globals.css` + `@/lib/utils`.
- Produces: `@/components/ui/button` (export `Button`, `buttonVariants`), `input`, `label`, `textarea`, `select`, `checkbox`, `card`, `badge` (export `Badge`, `badgeVariants`), `alert`, `table` (export `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`), `tabs`, `dialog`, `dropdown-menu`, `tooltip`, `avatar` — dùng trong Task 4–6.

- [ ] **Step 1: Chạy shadcn CLI thêm 15 components**

```bash
npx shadcn@latest add button input label textarea select checkbox card badge alert table tabs dialog dropdown-menu tooltip avatar --yes --overwrite
```

Expected: các file tạo trong `src/components/ui/`, package.json có radix + lucide-react.

- [ ] **Step 2: Verify components tồn tại**

Run: `ls src/components/ui`
Expected: `alert.tsx avatar.tsx badge.tsx button.tsx card.tsx checkbox.tsx dialog.tsx dropdown-menu.tsx input.tsx label.tsx select.tsx table.tsx tabs.tsx textarea.tsx tooltip.tsx`

- [ ] **Step 3: Verify build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: cả 3 exit 0. (Nếu oxlint báo unused export từ Radix — không fix, không xóa code component của CLI.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui package.json package-lock.json
git commit -m "feat: add shadcn/ui component library (button, form, data, overlay)"
```

---

### Task 4: StatusBadge (business component, TDD)

**Files:**
- Create: `src/components/business/StatusBadge.tsx`
- Test: `src/components/business/StatusBadge.test.tsx`

**Interfaces:**
- Consumes: Task 3 `Badge` từ `@/components/ui/badge`, `cn` từ `@/lib/utils`.
- Produces: `StatusBadge({ status: string; className?: string })` — render `Badge` với màu theo status. Mapping:
  `DRAFT → bg-muted`, `SUBMITTED → bg-info`, `PENDING_APPROVAL → bg-warning`, `APPROVED → bg-success`, `REJECTED → bg-destructive`, `DOCUMENT_GENERATED → bg-primary`, `COMPLETED → bg-success`, unknown → `bg-muted`.

- [ ] **Step 1: Viết test fail**

`src/components/business/StatusBadge.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it.each(['DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DOCUMENT_GENERATED', 'COMPLETED'])(
    'renders %s text for status %s',
    (status) => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(status)).toBeInTheDocument()
    },
  )

  it('maps APPROVED to success style', () => {
    render(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('APPROVED')).toHaveClass('bg-success')
  })

  it('maps PENDING_APPROVAL to warning style', () => {
    render(<StatusBadge status="PENDING_APPROVAL" />)
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })

  it('falls back to muted for unknown status', () => {
    render(<StatusBadge status="UNKNOWN" />)
    expect(screen.getByText('UNKNOWN')).toHaveClass('bg-muted')
  })
})
```

- [ ] **Step 2: Chạy test verify fail**

Run: `npm test -- StatusBadge`
Expected: FAIL — không tìm thấy module `./StatusBadge`.

- [ ] **Step 3: Implement `StatusBadge`**

`src/components/business/StatusBadge.tsx`:

```tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground hover:bg-muted',
  SUBMITTED: 'bg-info text-info-foreground hover:bg-info',
  PENDING_APPROVAL: 'bg-warning text-warning-foreground hover:bg-warning',
  APPROVED: 'bg-success text-success-foreground hover:bg-success',
  REJECTED: 'bg-destructive text-destructive-foreground hover:bg-destructive',
  DOCUMENT_GENERATED: 'bg-primary text-primary-foreground hover:bg-primary',
  COMPLETED: 'bg-success text-success-foreground hover:bg-success',
}

const FALLBACK_STYLE = 'bg-muted text-muted-foreground hover:bg-muted'

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] ?? FALLBACK_STYLE
  return (
    <Badge className={cn(style, className)}>{status}</Badge>
  )
}
```

- [ ] **Step 4: Chạy test verify pass**

Run: `npm test -- StatusBadge`
Expected: PASS (7 tests).

- [ ] **Step 5: Verify toàn bộ + commit**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: tất cả exit 0.

```bash
git add src/components/business/StatusBadge.tsx src/components/business/StatusBadge.test.tsx
git commit -m "feat: add StatusBadge with approval status color mapping"
```

---

### Task 5: AppShell + Sidebar + Topbar + ThemeToggle (TDD)

**Files:**
- Create: `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/ThemeToggle.test.tsx`, `src/components/layout/AppShell.test.tsx`

**Interfaces:**
- Consumes: Task 3 (`Button`, `Input`, `Avatar`), Task 1 `cn`.
- Produces:
  - `ThemeToggle()` — button toggle `.dark` trên `documentElement`, lưu `localStorage.theme`.
  - `Sidebar()` — nav items: Dashboard `/`, Leave `/leave`, Gate Pass `/gate-pass`, Attendance `/attendance`, Employees `/employees`, Reports `/reports` (lucide icons: `LayoutDashboard`, `CalendarDays`, `DoorOpen`, `ClipboardCheck`, `Users`, `BarChart3`).
  - `Topbar({ children })` — trái: search input placeholder; phải: `ThemeToggle` + nút bell `aria-label="Notifications"` + `Avatar` + tên "LPVN Admin".
  - `AppShell({ children })` — flex container: `Sidebar` trái + cột phải (`Topbar` + `<main className="flex-1 p-6">{children}</main>`).

- [ ] **Step 1: Viết test fail cho ThemeToggle**

`src/components/layout/ThemeToggle.test.tsx`:

```tsx
import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders a toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('adds dark class on documentElement after click', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when clicked again', async () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
```

- [ ] **Step 2: Chạy test verify fail**

Run: `npm test -- ThemeToggle`
Expected: FAIL — module `./ThemeToggle` không tồn tại.

- [ ] **Step 3: Implement `ThemeToggle`**

`src/components/layout/ThemeToggle.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getInitialDark(): boolean {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark((d) => !d)}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
```

- [ ] **Step 4: Chạy test verify pass**

Run: `npm test -- ThemeToggle`
Expected: PASS (3 tests).

- [ ] **Step 5: Viết test fail cho AppShell**

`src/components/layout/AppShell.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('renders sidebar navigation items', () => {
    render(<AppShell>content</AppShell>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Leave')).toBeInTheDocument()
    expect(screen.getByText('Gate Pass')).toBeInTheDocument()
    expect(screen.getByText('Attendance')).toBeInTheDocument()
    expect(screen.getByText('Employees')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('renders topbar with theme toggle and user', () => {
    render(<AppShell>content</AppShell>)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByText('LPVN Admin')).toBeInTheDocument()
  })

  it('renders children in the content area', () => {
    render(<AppShell><p>dashboard content</p></AppShell>)
    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Chạy test verify fail**

Run: `npm test -- AppShell`
Expected: FAIL — module `./AppShell` không tồn tại.

- [ ] **Step 7: Implement Sidebar, Topbar, AppShell**

`src/components/layout/Sidebar.tsx`:

```tsx
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  DoorOpen,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Leave', href: '/leave', icon: CalendarDays },
  { label: 'Gate Pass', href: '/gate-pass', icon: DoorOpen },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
          L
        </div>
        <span className="font-semibold">LPVN HR</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
```

`src/components/layout/Topbar.tsx`:

```tsx
import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 pl-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">LPVN Admin</span>
        </div>
      </div>
    </header>
  )
}
```

`src/components/layout/AppShell.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Chạy test verify pass**

Run: `npm test -- AppShell`
Expected: PASS (3 tests).

- [ ] **Step 9: Verify toàn bộ + commit**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: tất cả exit 0.

```bash
git add src/components/layout
git commit -m "feat: add app shell with sidebar, topbar and theme toggle"
```

---

### Task 6: DashboardPage demo + wiring App (TDD)

**Files:**
- Create: `src/pages/DashboardPage.tsx`, `src/pages/DashboardPage.test.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`, `src/main.tsx`, `index.html`
- Delete: `src/App.css`, `src/index.css`

**Interfaces:**
- Consumes: Task 5 `AppShell`, Task 4 `StatusBadge`, Task 3 (`Card`, `Table`, `Badge`).
- Produces: `DashboardPage()` — h1 "Dashboard", 4 KPI cards, bảng "Pending Approvals" với `StatusBadge`; `App` = `AppShell` + `DashboardPage`.

- [ ] **Step 1: Viết test fail cho DashboardPage**

`src/pages/DashboardPage.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  it('renders heading and KPI cards', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Pending approvals')).toBeInTheDocument()
    expect(screen.getByText('Leave used')).toBeInTheDocument()
    expect(screen.getByText('Team size')).toBeInTheDocument()
    expect(screen.getByText('Requests this month')).toBeInTheDocument()
  })

  it('renders pending approvals table with status badges', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument()
    expect(screen.getByText('LV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('PENDING_APPROVAL')).toHaveClass('bg-warning')
  })
})
```

- [ ] **Step 2: Chạy test verify fail**

Run: `npm test -- DashboardPage`
Expected: FAIL — module `./DashboardPage` không tồn tại.

- [ ] **Step 3: Implement `DashboardPage`**

`src/pages/DashboardPage.tsx`:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusBadge } from '@/components/business/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const KPIS = [
  { label: 'Pending approvals', value: '12' },
  { label: 'Leave used', value: '86 days' },
  { label: 'Team size', value: '248' },
  { label: 'Requests this month', value: '31' },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Nguyen Van A', type: 'Annual Leave', date: '2026-08-10', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Tran Thi B', type: 'Gate Pass', date: '2026-08-11', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Le Van C', type: 'Attendance', date: '2026-08-12', status: 'REJECTED' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">HR workflow overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">This month</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Latest requests waiting for action</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PENDING_REQUESTS.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Chạy test verify pass**

Run: `npm test -- DashboardPage`
Expected: PASS (2 tests).

- [ ] **Step 5: Cập nhật test App hiện có**

`src/App.test.tsx` — toàn bộ nội dung mới:

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the dashboard inside the app shell', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Leave')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Cập nhật App, main, index.html; xóa css cũ**

`src/App.tsx` — toàn bộ nội dung mới:

```tsx
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  )
}

export default App
```

`src/main.tsx` — thay `import './index.css'` bằng:

```tsx
import '@fontsource-variable/inter'
import './styles/globals.css'
```

`index.html` — sửa `<title>` thành `LPVN HR Workflow`.

Xóa file: `src/App.css`, `src/index.css`.

- [ ] **Step 7: Chạy toàn bộ test + verify**

Run: `npm test && npm run typecheck && npm run lint && npm run build`
Expected: tất cả exit 0, không còn tham chiếu `App.css`/`index.css`.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/main.tsx index.html src/pages src/assets/hero.png 2>/dev/null
git add -u
git commit -m "feat: add dashboard demo page wired into app shell"
```

(Nếu `src/assets/hero.png` tồn tại và không còn dùng, thêm vào commit xóa; `git add -u` bắt các file xóa.)

---

### Task 7: Checkpoint — docs, state, quality gate, PR

**Files:**
- Modify: `plan.md` (tick Phase 01 items), `state.json` (progress, ADR-006/007, files_created, next_actions, last_session)

**Interfaces:**
- Consumes: Task 1–6 deliverables + `scripts/quality-gate.sh` + `scripts/check-state.sh` (phase 00).

- [ ] **Step 1: Tick Phase 01 trong `plan.md`**

Tick `[x]` cho các item Phase 01 đã hoàn thành:
`Tạo design tokens riêng cho hệ thống HR SaaS`, `Thiết lập typography, spacing, radius, elevation, states`, `Thiết kế dashboard layout`, `Thiết kế navigation theo role` (sidebar placeholder), `Thiết kế form components chuẩn` (Button/Input/Select... trong ui library), `Thiết kế approval status components` (StatusBadge), `Thiết kế table/filter/pagination` (Table component; filter/pagination để phase sau), `Thiết kế modal/drawer/confirmation patterns` (Dialog + Alert + DropdownMenu).

Giữ `[ ]` cho các item chưa xong: navigation theo role thật (đang placeholder), pagination, drawer/confirmation pattern đầy đủ — nếu chưa implement, không tick.

- [ ] **Step 2: Cập nhật `state.json`**

- `current_phase`: `phase-01`, `current_task`: `phase-02-supabase-foundation`.
- `progress.phase-01`: `{"status": "IN_PROGRESS", "percent": 80}` (khi demo + test chạy) — hoặc `DONE/100` nếu toàn bộ tick.
- Thêm ADR:
  - `{"id": "ADR-006", "decision": "Design direction: teal trung tính hóa từ DESIGN.md, không sao chép visual game UI; professional HR SaaS, light + dark.", "status": "accepted"}`
  - `{"id": "ADR-007", "decision": "Phase-01 UI stack: Tailwind CSS v4 + shadcn/ui (Radix primitives), CSS variables tokens, dark mode class strategy.", "status": "accepted"}`
- `files_created` thêm: `src/styles/globals.css`, `src/lib/utils.ts`, `components.json`, `src/components/ui/*`, `src/components/layout/*`, `src/components/business/StatusBadge.tsx`, `src/pages/DashboardPage.tsx`, `docs/superpowers/specs/2026-08-13-phase-01-design-system.md`.
- `next_actions`: `Tạo Supabase project và cấu hình Auth`, `Tạo schema + profiles/departments/positions/employees`, `Thiết lập RLS policies và audit log`.
- `validation`: `code_validation: "passing"`, thêm `"phase_01_quality_gate": "passing"`.

- [ ] **Step 3: Chạy quality gate + check-state**

Run: `./scripts/quality-gate.sh`
Expected: OK cho typecheck/lint/test/build, exit 0.

Run: `./scripts/check-state.sh`
Expected: exit 0.

- [ ] **Step 4: Commit + push + tạo PR**

```bash
git add plan.md state.json
git commit -m "docs: complete phase-01 design system checkpoint, update state"
git push -u origin feature/phase-01-design-system
gh pr create --title "feat: phase-01 design system & UX foundation" --body "Design tokens 3 lớp (teal trung tính hóa, light+dark), Tailwind v4 + shadcn/ui, StatusBadge, AppShell + DashboardPage demo. Quality gate pass. Spec: docs/superpowers/specs/2026-08-13-phase-01-design-system.md"
```

Expected: PR mở từ `feature/phase-01-design-system` → `main`.

- [ ] **Step 5: Review PR (skill requesting-code-review)**

Verify: Security (không có secret), correctness (test pass, không phá phase-00), scope (không sửa file governance ngoài tick/state), docs/state nhất quán với code.
Expected: PR sẵn sàng merge sau khi được review; nếu cần sửa, sửa + commit vào cùng branch.

---

## Self-Review Notes

- **Spec coverage:** §4 triển khai kỹ thuật → Task 1–2 (Tailwind v4, `@theme inline`, dark class strategy); §3 token 3 lớp → Task 2; §5 components → Task 3 + Task 4 (StatusBadge); §6 shell + demo → Task 5–6; §7 testing → TDD từng task + Task 7 gate; §8 git → Task 1 (branch) + Task 7 (PR); §9 ADR → Task 7; §10 definition of done → Task 7 steps.
- **Placeholder scan:** mọi step có code/command cụ thể; không có TBD/TODO; `DashboardPage.test.tsx` dùng `LV-2026-001` trùng dữ liệu mock trong implementation (đã khớp).
- **Type consistency:** `StatusBadge({ status: string; className?: string })` khai báo Task 4, dùng Task 6 đúng; `AppShell({ children: ReactNode })` khai báo Task 5, dùng Task 6 đúng; `cn` định nghĩa Task 1 dùng ở Task 4–5; export `Badge`/`Table*` từ Task 3 dùng đúng tên trong Task 4/6; alias `@/` khai báo Task 1, dùng từ Task 3 trở đi.
- **Rủi ro đã xử lý:** oxlint có thể báo unused import trong shadcn components — Task 3 bước 3 đã ghi rõ không fix; shadcn CLI non-interactive với `--yes --overwrite`.
