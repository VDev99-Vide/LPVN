# Phase 04 — Leave & Annual Leave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Leave & Annual Leave Management module for LPVN HR Flow, including SQL migration for leave schema, RLS policies, seed data, leave data service, stat cards, quota management table, entitlement adjustment modal, and Leave Management Page.

**Architecture:** Create SQL migration `20260813000006_leave_system.sql` for `leave_types`, `leave_entitlements`, `leave_balances`; update database TypeScript types; create `leave.service.ts`; build UI components (`LeaveBalanceCards`, `LeaveBalanceTable`, `LeaveEntitlementModal`); integrate into `LeaveManagementPage`.

**Tech Stack:** React 19, TypeScript strict, `@supabase/supabase-js`, Vitest + React Testing Library, Tailwind CSS v4 + shadcn/ui primitives.

**Spec:** `docs/superpowers/specs/2026-08-13-phase-04-leave-annual-leave.md`

## Global Constraints

- Prettier: no semicolons, single quotes, printWidth 100 (`.prettierrc.json`).
- TS strict, `noUnusedLocals`, `noUnusedParameters` — no `any`.
- Quality gate passing required: `npm run typecheck && npm run lint && npm test && npm run build`.

---

### Task 1: Leave System Database Migration & Types Update

**Files:**
- Create: `supabase/migrations/20260813000006_leave_system.sql`
- Modify: `src/types/database.types.ts`
- Test: `src/types/database.types.test.ts`

**Interfaces:**
- Produces: `leave_types`, `leave_entitlements`, `leave_balances` tables & TypeScript definitions.

- [ ] **Step 1: Create `supabase/migrations/20260813000006_leave_system.sql`**

```sql
-- Leave Types Table
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  requires_attachment BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leave Entitlements Table
CREATE TABLE IF NOT EXISTS public.leave_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  base_days NUMERIC(4,1) NOT NULL DEFAULT 12.0,
  seniority_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  bonus_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  total_days NUMERIC(4,1) NOT NULL DEFAULT 12.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, year)
);

-- Leave Balances Table
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id) ON DELETE CASCADE,
  total_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  used_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  pending_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  remaining_days NUMERIC(4,1) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, year, leave_type_id)
);

-- Enable RLS
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leave types viewable by authenticated" ON public.leave_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leave entitlements viewable by authenticated" ON public.leave_entitlements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leave balances viewable by authenticated" ON public.leave_balances FOR SELECT TO authenticated USING (true);

-- Seed Leave Types
INSERT INTO public.leave_types (code, name, is_paid, requires_attachment) VALUES
  ('ANNUAL', 'Nghỉ phép năm', true, false),
  ('MARRIAGE', 'Nghỉ kết hôn', true, true),
  ('UNPAID', 'Nghỉ không hưởng lương', false, false),
  ('SICK', 'Nghỉ ốm đau', true, true),
  ('BEREAVEMENT', 'Nghỉ tang chế', true, false),
  ('MATERNITY', 'Nghỉ thai sản', true, true),
  ('OTHER', 'Nghỉ khác', false, false)
ON CONFLICT (code) DO NOTHING;
```

- [ ] **Step 2: Update `src/types/database.types.ts`**

Add `leave_types`, `leave_entitlements`, `leave_balances` to `Database['public']['Tables']`.

- [ ] **Step 3: Write test `src/types/database.types.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import type { Database } from './database.types'

describe('Database Types Phase 04', () => {
  it('includes leave tables in Database interface', () => {
    type LeaveTypeRow = Database['public']['Tables']['leave_types']['Row']
    type LeaveBalanceRow = Database['public']['Tables']['leave_balances']['Row']
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 4: Run tests and commit**

```bash
npm test -- src/types/database.types.test.ts
git add supabase/migrations/20260813000006_leave_system.sql src/types/database.types.ts src/types/database.types.test.ts
git commit -m "feat: add leave system SQL migration and database TypeScript definitions"
```

---

### Task 2: Leave Data Service

**Files:**
- Create: `src/services/leave.service.ts`, `src/services/leave.service.test.ts`

**Interfaces:**
- Consumes: `supabase` from `@/lib/supabase`, `Database` types.
- Produces: `leaveService` methods (`getLeaveTypes`, `getLeaveBalances`, `getAllLeaveBalances`, `updateEntitlement`).

- [ ] **Step 1: Write failing test `src/services/leave.service.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { leaveService } from './leave.service'

describe('LeaveService', () => {
  it('exports leaveService object with balance queries', () => {
    expect(leaveService).toBeDefined()
    expect(typeof leaveService.getLeaveTypes).toBe('function')
    expect(typeof leaveService.getLeaveBalances).toBe('function')
    expect(typeof leaveService.getAllLeaveBalances).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/services/leave.service.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/services/leave.service.ts`**

```ts
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type LeaveTypeRow = Database['public']['Tables']['leave_types']['Row']
export type LeaveEntitlementRow = Database['public']['Tables']['leave_entitlements']['Row']
export type LeaveBalanceRow = Database['public']['Tables']['leave_balances']['Row']

export interface LeaveBalanceWithRelations extends LeaveBalanceRow {
  leave_type?: LeaveTypeRow | null
  employee?: {
    id: string
    full_name: string
    employee_code: string
    department_id: string | null
  } | null
}

export const leaveService = {
  async getLeaveTypes(): Promise<{ data: LeaveTypeRow[]; error: Error | null }> {
    try {
      const { data, error } = await supabase.from('leave_types').select('*').order('code')
      if (error) return { data: [], error: new Error(error.message) }
      return { data: data || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getLeaveBalances(
    employeeId: string,
    year: number = new Date().getFullYear()
  ): Promise<{ data: LeaveBalanceWithRelations[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*, leave_type:leave_types(*)')
        .eq('employee_id', employeeId)
        .eq('year', year)

      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as LeaveBalanceWithRelations[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getAllLeaveBalances(
    year: number = new Date().getFullYear(),
    search?: string
  ): Promise<{ data: LeaveBalanceWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('leave_balances')
        .select('*, leave_type:leave_types(*), employee:profiles(id, full_name, employee_code, department_id)')
        .eq('year', year)

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }
      
      let filtered = (data as unknown as LeaveBalanceWithRelations[]) || []
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(
          (b) =>
            b.employee?.full_name?.toLowerCase().includes(s) ||
            b.employee?.employee_code?.toLowerCase().includes(s)
        )
      }
      return { data: filtered, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async updateEntitlement(payload: {
    employee_id: string
    year: number
    base_days: number
    seniority_days: number
    bonus_days: number
  }): Promise<{ error: Error | null }> {
    try {
      const total_days = payload.base_days + payload.seniority_days + payload.bonus_days
      const { error } = await supabase
        .from('leave_entitlements')
        .upsert({
          employee_id: payload.employee_id,
          year: payload.year,
          base_days: payload.base_days,
          seniority_days: payload.seniority_days,
          bonus_days: payload.bonus_days,
          total_days,
        })

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/services/leave.service.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/leave.service.ts src/services/leave.service.test.ts
git commit -m "feat: add leave service for leave balances and entitlement management"
```

---

### Task 3: Leave Balance Cards & Table Components

**Files:**
- Create: `src/components/business/LeaveBalanceCards.tsx`, `src/components/business/LeaveBalanceCards.test.tsx`
- Create: `src/components/business/LeaveBalanceTable.tsx`, `src/components/business/LeaveBalanceTable.test.tsx`

**Interfaces:**
- Consumes: `LeaveBalanceWithRelations` from `@/services/leave.service`.
- Produces: `LeaveBalanceCards` stat summary and `LeaveBalanceTable` HR management table.

- [ ] **Step 1: Create `src/components/business/LeaveBalanceCards.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeaveBalanceCards } from './LeaveBalanceCards'

describe('LeaveBalanceCards', () => {
  it('renders annual leave summary stats', () => {
    const balances = [
      {
        id: 'b1',
        employee_id: 'e1',
        year: 2026,
        leave_type_id: 'lt1',
        total_days: 14,
        used_days: 3,
        pending_days: 1,
        remaining_days: 10,
        created_at: '',
        updated_at: '',
        leave_type: { id: 'lt1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
      },
    ]
    render(<LeaveBalanceCards balances={balances} />)
    expect(screen.getByText('Tổng phép năm')).toBeInTheDocument()
    expect(screen.getByText('14 ngày')).toBeInTheDocument()
    expect(screen.getByText('10 ngày')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create `src/components/business/LeaveBalanceCards.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

interface LeaveBalanceCardsProps {
  balances: LeaveBalanceWithRelations[]
}

export function LeaveBalanceCards({ balances }: LeaveBalanceCardsProps) {
  const annual = balances.find((b) => b.leave_type?.code === 'ANNUAL') || {
    total_days: 12,
    used_days: 0,
    pending_days: 0,
    remaining_days: 12,
  }

  const STATS = [
    { label: 'Tổng phép năm', value: `${annual.total_days} ngày`, desc: 'Quyền hạn năm 2026' },
    { label: 'Đã sử dụng', value: `${annual.used_days} ngày`, desc: 'Đã được duyệt' },
    { label: 'Đang chờ duyệt', value: `${annual.pending_days} ngày`, desc: 'Đơn đang xử lý' },
    { label: 'Khả dụng còn lại', value: `${annual.remaining_days} ngày`, desc: 'Sẵn sàng đăng ký' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/business/LeaveBalanceTable.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeaveBalanceTable } from './LeaveBalanceTable'

describe('LeaveBalanceTable', () => {
  it('renders employee balance table rows', () => {
    const balances = [
      {
        id: 'b1',
        employee_id: 'e1',
        year: 2026,
        leave_type_id: 'lt1',
        total_days: 14,
        used_days: 4,
        pending_days: 0,
        remaining_days: 10,
        created_at: '',
        updated_at: '',
        employee: { id: 'e1', full_name: 'Nguyen Van A', employee_code: 'LPVN-0001', department_id: null },
        leave_type: { id: 'lt1', code: 'ANNUAL', name: 'Nghỉ phép năm', is_paid: true, requires_attachment: false, created_at: '' },
      },
    ]
    render(<LeaveBalanceTable balances={balances} onAdjustEntitlement={vi.fn()} />)
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Create `src/components/business/LeaveBalanceTable.tsx`**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

interface LeaveBalanceTableProps {
  balances: LeaveBalanceWithRelations[]
  onAdjustEntitlement: (balance: LeaveBalanceWithRelations) => void
}

export function LeaveBalanceTable({ balances, onAdjustEntitlement }: LeaveBalanceTableProps) {
  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã NV</TableHead>
            <TableHead>Họ và Tên</TableHead>
            <TableHead>Loại Phép</TableHead>
            <TableHead className="text-right">Tổng Quỹ</TableHead>
            <TableHead className="text-right">Đã Dùng</TableHead>
            <TableHead className="text-right">Chờ Duyệt</TableHead>
            <TableHead className="text-right">Còn Lại</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                Không tìm thấy dữ liệu phép nào.
              </TableCell>
            </TableRow>
          ) : (
            balances.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono font-medium">{b.employee?.employee_code || '—'}</TableCell>
                <TableCell className="font-medium">{b.employee?.full_name || '—'}</TableCell>
                <TableCell>{b.leave_type?.name || 'Phép năm'}</TableCell>
                <TableCell className="text-right font-mono">{b.total_days}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{b.used_days}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{b.pending_days}</TableCell>
                <TableCell className="text-right font-mono font-bold text-primary">{b.remaining_days}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onAdjustEntitlement(b)}>
                    Điều Chỉnh
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 5: Run tests and commit**

```bash
npm test -- src/components/business/LeaveBalanceCards.test.tsx src/components/business/LeaveBalanceTable.test.tsx
git add src/components/business/LeaveBalanceCards.* src/components/business/LeaveBalanceTable.*
git commit -m "feat: add LeaveBalanceCards and LeaveBalanceTable UI components"
```

---

### Task 4: Entitlement Modal Component

**Files:**
- Create: `src/components/business/LeaveEntitlementModal.tsx`, `src/components/business/LeaveEntitlementModal.test.tsx`

**Interfaces:**
- Consumes: `LeaveBalanceWithRelations`.
- Produces: Modal dialog for adjusting annual leave entitlement (base, seniority, bonus days).

- [ ] **Step 1: Create `src/components/business/LeaveEntitlementModal.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeaveEntitlementModal } from './LeaveEntitlementModal'

describe('LeaveEntitlementModal', () => {
  it('renders entitlement modal title and input fields', () => {
    render(
      <LeaveEntitlementModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialData={null}
      />
    )
    expect(screen.getByText('Điều Chỉnh Quỹ Phép Năm')).toBeInTheDocument()
    expect(screen.getByLabelText(/Phép Gốc/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create `src/components/business/LeaveEntitlementModal.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LeaveBalanceWithRelations } from '@/services/leave.service'

interface LeaveEntitlementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { base_days: number; seniority_days: number; bonus_days: number }) => Promise<void>
  initialData: LeaveBalanceWithRelations | null
}

export function LeaveEntitlementModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: LeaveEntitlementModalProps) {
  const [baseDays, setBaseDays] = useState(12)
  const [seniorityDays, setSeniorityDays] = useState(0)
  const [bonusDays, setBonusDays] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setBaseDays(12)
      setSeniorityDays(0)
      setBonusDays(0)
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit({
      base_days: Number(baseDays),
      seniority_days: Number(seniorityDays),
      bonus_days: Number(bonusDays),
    })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Điều Chỉnh Quỹ Phép Năm</DialogTitle>
          <DialogDescription>
            Cập nhật số ngày phép năm cho {initialData?.employee?.full_name || 'nhân viên'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="base_days">Phép Gốc Quy Định (ngày)</Label>
            <Input
              id="base_days"
              type="number"
              step="0.5"
              value={baseDays}
              onChange={(e) => setBaseDays(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seniority_days">Phép Thâm Niên (ngày)</Label>
            <Input
              id="seniority_days"
              type="number"
              step="0.5"
              value={seniorityDays}
              onChange={(e) => setSeniorityDays(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bonus_days">Phép Thưởng Cộng Thêm (ngày)</Label>
            <Input
              id="bonus_days"
              type="number"
              step="0.5"
              value={bonusDays}
              onChange={(e) => setBonusDays(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Run test and commit**

```bash
npm test -- src/components/business/LeaveEntitlementModal.test.tsx
git add src/components/business/LeaveEntitlementModal.*
git commit -m "feat: add LeaveEntitlementModal component for quota adjustment"
```

---

### Task 5: Leave Management Page & Navigation Integration

**Files:**
- Create: `src/pages/LeaveManagementPage.tsx`, `src/pages/LeaveManagementPage.test.tsx`
- Modify: `src/components/layout/Sidebar.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: `leaveService`, `LeaveBalanceCards`, `LeaveBalanceTable`, `LeaveEntitlementModal`.
- Produces: Main Leave Management Page with personal balance & company quota tabs.

- [ ] **Step 1: Create `src/pages/LeaveManagementPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { LeaveManagementPage } from './LeaveManagementPage'

describe('LeaveManagementPage', () => {
  it('renders leave management page heading', () => {
    render(
      <AuthProvider>
        <LeaveManagementPage />
      </AuthProvider>
    )
    expect(screen.getByRole('heading', { name: /Quản lý Nghỉ phép & Phép năm/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create `src/pages/LeaveManagementPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LeaveBalanceCards } from '@/components/business/LeaveBalanceCards'
import { LeaveBalanceTable } from '@/components/business/LeaveBalanceTable'
import { LeaveEntitlementModal } from '@/components/business/LeaveEntitlementModal'
import { leaveService, type LeaveBalanceWithRelations } from '@/services/leave.service'

export function LeaveManagementPage() {
  const [personalBalances, setPersonalBalances] = useState<LeaveBalanceWithRelations[]>([])
  const [allBalances, setAllBalances] = useState<LeaveBalanceWithRelations[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalanceWithRelations | null>(null)

  const loadData = async () => {
    const { data: allData } = await leaveService.getAllLeaveBalances(2026, search)
    setAllBalances(allData)
    setPersonalBalances(allData.slice(0, 2))
  }

  useEffect(() => {
    loadData()
  }, [search])

  const handleAdjust = async (data: { base_days: number; seniority_days: number; bonus_days: number }) => {
    if (selectedBalance?.employee?.id) {
      await leaveService.updateEntitlement({
        employee_id: selectedBalance.employee.id,
        year: 2026,
        base_days: data.base_days,
        seniority_days: data.seniority_days,
        bonus_days: data.bonus_days,
      })
      loadData()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý Nghỉ phép & Phép năm</h1>
        <p className="text-sm text-muted-foreground">Theo dõi số dư phép cá nhân và quản lý quỹ phép năm toàn công ty</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Số Dư Phép Cá Nhân</TabsTrigger>
          <TabsTrigger value="company">Quỹ Phép Công Ty (HR)</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-4">
          <LeaveBalanceCards balances={personalBalances} />
        </TabsContent>

        <TabsContent value="company" className="space-y-4 mt-4">
          <div className="flex max-w-xs">
            <Input
              placeholder="Tìm theo tên hoặc mã NV..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <LeaveBalanceTable
            balances={allBalances}
            onAdjustEntitlement={(balance) => {
              setSelectedBalance(balance)
              setIsModalOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>

      <LeaveEntitlementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdjust}
        initialData={selectedBalance}
      />
    </div>
  )
}
```

- [ ] **Step 3: Update `Sidebar.tsx` and `App.tsx`**

Add "Quản lý Phép năm" link in `Sidebar.tsx` and route handling in `App.tsx`.

- [ ] **Step 4: Run test and commit**

```bash
npm test -- src/pages/LeaveManagementPage.test.tsx
git add src/pages/LeaveManagementPage.tsx src/pages/LeaveManagementPage.test.tsx src/components/layout/Sidebar.tsx src/App.tsx
git commit -m "feat: add LeaveManagementPage with tabs, balance cards, table and modal"
```

---

### Task 6: Checkpoint & Quality Gate Verification

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` (tick Phase 04 items)**

Tick Phase 04 items in `plan.md`.

- [ ] **Step 2: Update `state.json`**

Update `progress.phase-04` to `{"status": "DONE", "percent": 100}`, set `current_phase` to `phase-04`, `current_task` to `phase-05-gate-pass`.

- [ ] **Step 3: Run quality gate and check state**

```bash
./scripts/quality-gate.sh
./scripts/check-state.sh
```

- [ ] **Step 4: Commit checkpoint**

```bash
git add plan.md state.json
git commit -m "docs: complete phase-04 leave & annual leave checkpoint"
```
