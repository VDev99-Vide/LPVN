# Phase 03 — Employee & Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete Employee & Organization management module for LPVN HR Flow, including CRUD operations, direct manager assignments, department head mapping, paginated employee table, slide-over form drawer, and visual org chart view.

**Architecture:** Create `employee.service.ts` for Supabase API interactions; build modular components `EmployeeTable`, `EmployeeFormDrawer`, `OrgChartView`; integrate into `EmployeesPage` wired with React `AuthProvider` and sidebar navigation.

**Tech Stack:** React 19, TypeScript strict, `@supabase/supabase-js`, Vitest + React Testing Library, Tailwind CSS v4 + shadcn/ui primitives.

**Spec:** `docs/superpowers/specs/2026-08-13-phase-03-employee-organization.md`

## Global Constraints

- Prettier: no semicolons, single quotes, printWidth 100 (`.prettierrc.json`).
- TS strict, `noUnusedLocals`, `noUnusedParameters` — no `any`.
- Quality gate passing required: `npm run typecheck && npm run lint && npm test && npm run build`.

---

### Task 1: Employee Data Service

**Files:**
- Create: `src/services/employee.service.ts`, `src/services/employee.service.test.ts`

**Interfaces:**
- Consumes: `supabase` from `@/lib/supabase`, `Database` types from `@/types/database.types`.
- Produces: `employeeService` methods (`getEmployees`, `getEmployeeById`, `createEmployee`, `updateEmployee`, `getOrgChartData`).

- [ ] **Step 1: Write failing test `src/services/employee.service.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { employeeService } from './employee.service'

describe('EmployeeService', () => {
  it('exports employeeService object with CRUD methods', () => {
    expect(employeeService).toBeDefined()
    expect(typeof employeeService.getEmployees).toBe('function')
    expect(typeof employeeService.createEmployee).toBe('function')
    expect(typeof employeeService.updateEmployee).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/services/employee.service.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/services/employee.service.ts`**

```ts
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type DepartmentRow = Database['public']['Tables']['departments']['Row']
export type PositionRow = Database['public']['Tables']['positions']['Row']

export interface EmployeeWithRelations extends ProfileRow {
  department?: DepartmentRow | null
  position?: PositionRow | null
  manager?: {
    id: string
    full_name: string
    employee_code: string
  } | null
}

export interface EmployeeFilterParams {
  search?: string
  departmentId?: string
  status?: string
}

export const employeeService = {
  async getEmployees(params?: EmployeeFilterParams): Promise<{ data: EmployeeWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          department:departments(*),
          position:positions(*)
        `)

      if (params?.search) {
        query = query.or(`full_name.ilike.%${params.search}%,employee_code.ilike.%${params.search}%,email.ilike.%${params.search}%`)
      }

      if (params?.departmentId && params.departmentId !== 'ALL') {
        query = query.eq('department_id', params.departmentId)
      }

      if (params?.status && params.status !== 'ALL') {
        query = query.eq('status', params.status as 'ACTIVE' | 'INACTIVE')
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }

      return { data: (data as unknown as EmployeeWithRelations[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getEmployeeById(id: string): Promise<{ data: EmployeeWithRelations | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          department:departments(*),
          position:positions(*)
        `)
        .eq('id', id)
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as unknown as EmployeeWithRelations, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async createEmployee(payload: {
    employee_code: string
    full_name: string
    email: string
    department_id?: string | null
    position_id?: string | null
    status?: 'ACTIVE' | 'INACTIVE'
  }): Promise<{ data: ProfileRow | null; error: Error | null }> {
    try {
      const id = crypto.randomUUID()
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id,
          employee_code: payload.employee_code,
          full_name: payload.full_name,
          email: payload.email,
          department_id: payload.department_id || null,
          position_id: payload.position_id || null,
          status: payload.status || 'ACTIVE',
        })
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async updateEmployee(
    id: string,
    payload: Partial<ProfileRow>
  ): Promise<{ data: ProfileRow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async getOrgChartData() {
    const { data: departments } = await supabase.from('departments').select('*')
    const { data: profiles } = await supabase.from('profiles').select('*, department:departments(*), position:positions(*)')
    return { departments: departments || [], employees: profiles || [] }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/services/employee.service.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/employee.service.ts src/services/employee.service.test.ts
git commit -m "feat: add employee service for Supabase profile and org chart queries"
```

---

### Task 2: Employee Table Component

**Files:**
- Create: `src/components/business/EmployeeTable.tsx`, `src/components/business/EmployeeTable.test.tsx`

**Interfaces:**
- Consumes: `EmployeeWithRelations` from `@/services/employee.service`, `StatusBadge` from `@/components/business/StatusBadge`.
- Produces: `EmployeeTable` component rendering paginated list with search, filter, and action triggers.

- [ ] **Step 1: Write failing test `src/components/business/EmployeeTable.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmployeeTable } from './EmployeeTable'

const MOCK_EMPLOYEES = [
  {
    id: 'emp-1',
    employee_code: 'LPVN-0001',
    full_name: 'Nguyen Van A',
    email: 'nguyenvana@lpvn.com',
    status: 'ACTIVE' as const,
    join_date: '2026-01-01',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    avatar_url: null,
    department_id: null,
    position_id: null,
    department: { id: 'd1', code: 'IT', name: 'Phòng IT', parent_id: null, department_head_id: null, created_at: '', updated_at: '' },
    position: { id: 'p1', code: 'DEV', title: 'Developer', level: 1, created_at: '', updated_at: '' },
  },
]

describe('EmployeeTable', () => {
  it('renders employee table with headers and data rows', () => {
    render(<EmployeeTable employees={MOCK_EMPLOYEES} onEdit={vi.fn()} onToggleStatus={vi.fn()} />)
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('Phòng IT')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/components/business/EmployeeTable.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/components/business/EmployeeTable.tsx`**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/business/StatusBadge'
import type { EmployeeWithRelations } from '@/services/employee.service'

interface EmployeeTableProps {
  employees: EmployeeWithRelations[]
  onEdit: (employee: EmployeeWithRelations) => void
  onToggleStatus: (employee: EmployeeWithRelations) => void
}

export function EmployeeTable({ employees, onEdit, onToggleStatus }: EmployeeTableProps) {
  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã NV</TableHead>
            <TableHead>Họ và Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phòng Ban</TableHead>
            <TableHead>Chức Danh</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Không tìm thấy nhân viên nào.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-mono font-medium">{emp.employee_code}</TableCell>
                <TableCell className="font-medium">{emp.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                <TableCell>{emp.department?.name || '—'}</TableCell>
                <TableCell>{emp.position?.title || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={emp.status} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(emp)}>
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={emp.status === 'ACTIVE' ? 'text-destructive' : 'text-primary'}
                    onClick={() => onToggleStatus(emp)}
                  >
                    {emp.status === 'ACTIVE' ? 'Vô hiệu' : 'Kích hoạt'}
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/business/EmployeeTable.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/business/EmployeeTable.tsx src/components/business/EmployeeTable.test.tsx
git commit -m "feat: add EmployeeTable component with status badge and actions"
```

---

### Task 3: Employee Form Drawer Component

**Files:**
- Create: `src/components/business/EmployeeFormDrawer.tsx`, `src/components/business/EmployeeFormDrawer.test.tsx`

**Interfaces:**
- Consumes: `EmployeeWithRelations`, `DepartmentRow`, `PositionRow`.
- Produces: Slide-over form drawer for creating and editing employee profiles.

- [ ] **Step 1: Write failing test `src/components/business/EmployeeFormDrawer.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmployeeFormDrawer } from './EmployeeFormDrawer'

describe('EmployeeFormDrawer', () => {
  it('renders form drawer when open', () => {
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        departments={[]}
        positions={[]}
        initialData={null}
      />
    )
    expect(screen.getByText('Thêm Nhân Viên Mới')).toBeInTheDocument()
    expect(screen.getByLabelText(/Họ và Tên/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/components/business/EmployeeFormDrawer.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/components/business/EmployeeFormDrawer.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DepartmentRow, PositionRow, EmployeeWithRelations } from '@/services/employee.service'

interface EmployeeFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: {
    employee_code: string
    full_name: string
    email: string
    department_id: string | null
    position_id: string | null
    status: 'ACTIVE' | 'INACTIVE'
  }) => Promise<void>
  departments: DepartmentRow[]
  positions: PositionRow[]
  initialData: EmployeeWithRelations | null
}

export function EmployeeFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  departments,
  positions,
  initialData,
}: EmployeeFormDrawerProps) {
  const [employeeCode, setEmployeeCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [departmentId, setDepartmentId] = useState<string>('')
  const [positionId, setPositionId] = useState<string>('')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setEmployeeCode(initialData.employee_code)
      setFullName(initialData.full_name)
      setEmail(initialData.email)
      setDepartmentId(initialData.department_id || '')
      setPositionId(initialData.position_id || '')
      setStatus(initialData.status === 'SUSPENDED' ? 'INACTIVE' : initialData.status)
    } else {
      setEmployeeCode(`LPVN-${Math.floor(1000 + Math.random() * 9000)}`)
      setFullName('')
      setEmail('')
      setDepartmentId('')
      setPositionId('')
      setStatus('ACTIVE')
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit({
      employee_code: employeeCode,
      full_name: fullName,
      email,
      department_id: departmentId || null,
      position_id: positionId || null,
      status,
    })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Cập nhật thông tin hồ sơ nhân sự.' : 'Nhập thông tin nhân viên mới để khởi tạo tài khoản.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="employee_code">Mã Nhân Viên</Label>
            <Input
              id="employee_code"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và Tên</Label>
            <Input
              id="full_name"
              placeholder="Nguyen Van A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Công Ty</Label>
            <Input
              id="email"
              type="email"
              placeholder="nhanvien@lpvn.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Phòng Ban</Label>
            <select
              id="department"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Chức Danh</Label>
            <select
              id="position"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            >
              <option value="">-- Chọn chức danh --</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title} ({pos.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/business/EmployeeFormDrawer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/business/EmployeeFormDrawer.tsx src/components/business/EmployeeFormDrawer.test.tsx
git commit -m "feat: add EmployeeFormDrawer modal component for employee CRUD operations"
```

---

### Task 4: Interactive Org Chart View Component

**Files:**
- Create: `src/components/business/OrgChartView.tsx`, `src/components/business/OrgChartView.test.tsx`

**Interfaces:**
- Consumes: `DepartmentRow`, `EmployeeWithRelations`.
- Produces: Visual hierarchical Tree view of departments and member profiles.

- [ ] **Step 1: Write failing test `src/components/business/OrgChartView.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrgChartView } from './OrgChartView'

describe('OrgChartView', () => {
  it('renders org chart tree structure', () => {
    const departments = [
      { id: 'd1', code: 'BGD', name: 'Ban Giám Đốc', parent_id: null, department_head_id: null, created_at: '', updated_at: '' },
    ]
    render(<OrgChartView departments={departments} employees={[]} />)
    expect(screen.getByText('Ban Giám Đốc')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/components/business/OrgChartView.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/components/business/OrgChartView.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DepartmentRow, EmployeeWithRelations } from '@/services/employee.service'

interface OrgChartViewProps {
  departments: DepartmentRow[]
  employees: EmployeeWithRelations[]
}

export function OrgChartView({ departments, employees }: OrgChartViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const deptEmployees = employees.filter((emp) => emp.department_id === dept.id)
          return (
            <Card key={dept.id} className="border-t-4 border-t-primary shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span>{dept.name}</span>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                    {dept.code}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground font-medium">
                  Thành viên ({deptEmployees.length})
                </div>
                {deptEmployees.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic py-2">
                    Chưa có nhân viên trực thuộc
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deptEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/40 text-sm"
                      >
                        <div>
                          <div className="font-medium text-foreground">{emp.full_name}</div>
                          <div className="text-xs text-muted-foreground">{emp.position?.title || emp.email}</div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{emp.employee_code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/business/OrgChartView.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/business/OrgChartView.tsx src/components/business/OrgChartView.test.tsx
git commit -m "feat: add OrgChartView component for visual department hierarchy"
```

---

### Task 5: Employees Page & Navigation Integration

**Files:**
- Create: `src/pages/EmployeesPage.tsx`, `src/pages/EmployeesPage.test.tsx`
- Modify: `src/components/layout/Sidebar.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: `employeeService`, `EmployeeTable`, `EmployeeFormDrawer`, `OrgChartView`.
- Produces: Main Employees Page with list & org chart tabs.

- [ ] **Step 1: Write failing test `src/pages/EmployeesPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { EmployeesPage } from './EmployeesPage'

describe('EmployeesPage', () => {
  it('renders employees page heading and action button', () => {
    render(
      <AuthProvider>
        <EmployeesPage />
      </AuthProvider>
    )
    expect(screen.getByRole('heading', { name: /Quản lý Nhân sự & Cơ cấu Tổ chức/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Thêm Nhân Viên/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/pages/EmployeesPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/pages/EmployeesPage.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeTable } from '@/components/business/EmployeeTable'
import { EmployeeFormDrawer } from '@/components/business/EmployeeFormDrawer'
import { OrgChartView } from '@/components/business/OrgChartView'
import { employeeService, type EmployeeWithRelations, type DepartmentRow, type PositionRow } from '@/services/employee.service'
import { supabase } from '@/lib/supabase'

export function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([])
  const [departments, setDepartments] = useState<DepartmentRow[]>([])
  const [positions, setPositions] = useState<PositionRow[]>([])
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeWithRelations | null>(null)

  const loadData = async () => {
    const { data: empData } = await employeeService.getEmployees({
      search: search || undefined,
      departmentId: selectedDept,
    })
    setEmployees(empData)

    const { data: deptData } = await supabase.from('departments').select('*')
    setDepartments(deptData || [])

    const { data: posData } = await supabase.from('positions').select('*')
    setPositions(posData || [])
  }

  useEffect(() => {
    loadData()
  }, [search, selectedDept])

  const handleCreateOrUpdate = async (formData: {
    employee_code: string
    full_name: string
    email: string
    department_id: string | null
    position_id: string | null
    status: 'ACTIVE' | 'INACTIVE'
  }) => {
    if (editingEmployee) {
      await employeeService.updateEmployee(editingEmployee.id, formData)
    } else {
      await employeeService.createEmployee(formData)
    }
    loadData()
  }

  const handleToggleStatus = async (employee: EmployeeWithRelations) => {
    const nextStatus = employee.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await employeeService.updateEmployee(employee.id, { status: nextStatus })
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Nhân sự & Cơ cấu Tổ chức</h1>
          <p className="text-sm text-muted-foreground">Quản lý thông tin nhân viên, phòng ban và sơ đồ tổ chức LPVN</p>
        </div>
        <Button
          onClick={() => {
            setEditingEmployee(null)
            setIsDrawerOpen(true)
          }}
        >
          + Thêm Nhân Viên
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh Sách Nhân Viên</TabsTrigger>
          <TabsTrigger value="org">Sơ Đồ Tổ Chức</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Tìm theo tên, mã NV hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="ALL">Tất cả phòng ban</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <EmployeeTable
            employees={employees}
            onEdit={(emp) => {
              setEditingEmployee(emp)
              setIsDrawerOpen(true)
            }}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>

        <TabsContent value="org" className="mt-4">
          <OrgChartView departments={departments} employees={employees} />
        </TabsContent>
      </Tabs>

      <EmployeeFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateOrUpdate}
        departments={departments}
        positions={positions}
        initialData={editingEmployee}
      />
    </div>
  )
}
```

- [ ] **Step 4: Update `Sidebar.tsx` and `App.tsx`**

Update `src/components/layout/Sidebar.tsx` to include "Employees" navigation link. Update `src/App.tsx` to support tab routing or render `EmployeesPage`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/pages/EmployeesPage.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/EmployeesPage.tsx src/pages/EmployeesPage.test.tsx src/components/layout/Sidebar.tsx src/App.tsx
git commit -m "feat: add EmployeesPage with tabs, search, drawer and org chart view"
```

---

### Task 6: Checkpoint & Quality Gate Verification

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` (tick Phase 03 items)**

Tick Phase 03 items in `plan.md`.

- [ ] **Step 2: Update `state.json`**

Update `progress.phase-03` to `{"status": "DONE", "percent": 100}`, set `current_phase` to `phase-03`, `current_task` to `phase-04-leave-annual-leave`.

- [ ] **Step 3: Run quality gate and check state**

```bash
./scripts/quality-gate.sh
./scripts/check-state.sh
```

- [ ] **Step 4: Commit checkpoint**

```bash
git add plan.md state.json
git commit -m "docs: complete phase-03 employee & organization checkpoint"
```
