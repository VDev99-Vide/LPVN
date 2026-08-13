# Phase 02 — Supabase Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Supabase backend foundation (Auth, Postgres schema, RLS policies, audit logs, seed data) and wire into React frontend via `@supabase/supabase-js`, `AuthContext`, `useAuth` hook, and `LoginPage`.

**Architecture:** Install `@supabase/supabase-js`; create typed client in `src/lib/supabase.ts`; generate DB schema in `supabase/migrations/`; create `AuthContext` with mock fallback for offline dev/test; build responsive `LoginPage` in `src/pages/LoginPage.tsx`.

**Tech Stack:** React 19, TypeScript strict, `@supabase/supabase-js`, Vitest + React Testing Library, Tailwind CSS v4 + shadcn/ui primitives.

**Spec:** `docs/superpowers/specs/2026-08-13-phase-02-supabase-foundation.md`

## Global Constraints

- Prettier: no semicolons, single quotes, printWidth 100 (`.prettierrc.json`).
- TS strict, `noUnusedLocals`, `noUnusedParameters` — no `any`.
- Quality gate passing required: `npm run typecheck && npm run lint && npm test && npm run build`.
- Environment variables configured safely via `.env.local` and `src/env.ts`.

---

### Task 1: Supabase Dependencies, Env Config & Database Types

**Files:**
- Modify: `package.json`, `src/env.ts`
- Create: `src/lib/supabase.ts`, `src/types/database.types.ts`
- Test: `src/lib/supabase.test.ts`

**Interfaces:**
- Consumes: `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Produces: `supabase` client in `src/lib/supabase.ts`, `Database` interface in `src/types/database.types.ts`.

- [ ] **Step 1: Install `@supabase/supabase-js`**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 2: Update `src/env.ts` for Supabase variables**

```ts
export const env = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const
```

- [ ] **Step 3: Create `src/types/database.types.ts`**

```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string
          code: string
          name: string
          parent_id: string | null
          department_head_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          parent_id?: string | null
          department_head_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          parent_id?: string | null
          department_head_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          code: string
          title: string
          level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          level?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          employee_code: string
          full_name: string
          email: string
          avatar_url: string | null
          department_id: string | null
          position_id: string | null
          status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_code: string
          full_name: string
          email: string
          avatar_url?: string | null
          department_id?: string | null
          position_id?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_code?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          department_id?: string | null
          position_id?: string | null
          status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
          join_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      manager_assignments: {
        Row: {
          id: string
          employee_id: string
          manager_id: string
          is_primary: boolean
          effective_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          manager_id: string
          is_primary?: boolean
          effective_date?: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          manager_id?: string
          is_primary?: boolean
          effective_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          code: string
          name: string
          module: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          module: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          module?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          role_id: string
          permission_id: string
        }
        Insert: {
          role_id: string
          permission_id: string
        }
        Update: {
          role_id?: string
          permission_id?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role_id: string
          assigned_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          assigned_at?: string
        }
        Update: {
          user_id?: string
          role_id?: string
          assigned_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: string
          old_data: Json | null
          new_data: Json | null
          actor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          actor_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
```

- [ ] **Step 4: Create `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'
import type { Database } from '@/types/database.types'

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 5: Write unit test `src/lib/supabase.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { supabase } from './supabase'

describe('Supabase Client', () => {
  it('initializes supabase client object properly', () => {
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })
})
```

- [ ] **Step 6: Run tests and commit**

```bash
npm test -- src/lib/supabase.test.ts
git add package.json package-lock.json src/env.ts src/types/database.types.ts src/lib/supabase.ts src/lib/supabase.test.ts
git commit -m "feat: setup Supabase client and TypeScript database definitions"
```

---

### Task 2: Core HR & RBAC SQL Migrations

**Files:**
- Create: `supabase/migrations/20260813000001_initial_schema.sql`, `supabase/migrations/20260813000002_rbac_system.sql`

**Interfaces:**
- Produces: PostgreSQL tables (`departments`, `positions`, `profiles`, `manager_assignments`, `roles`, `permissions`, `role_permissions`, `user_roles`) + `on_auth_user_created` trigger.

- [ ] **Step 1: Create `supabase/migrations/20260813000001_initial_schema.sql`**

```sql
-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  department_head_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Positions table
CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add Foreign Key for department_head_id after profiles table creation
ALTER TABLE public.departments
  ADD CONSTRAINT fk_departments_head
  FOREIGN KEY (department_head_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Manager assignments table
CREATE TABLE IF NOT EXISTS public.manager_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  manager_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, employee_code, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'employee_code', 'EMP-' || SUBSTRING(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

- [ ] **Step 2: Create `supabase/migrations/20260813000002_rbac_system.sql`**

```sql
-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Role permissions link table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User roles link table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);
```

- [ ] **Step 3: Commit migration files**

```bash
git add supabase/migrations/20260813000001_initial_schema.sql supabase/migrations/20260813000002_rbac_system.sql
git commit -m "feat: add schema migrations for initial tables and RBAC"
```

---

### Task 3: RLS Policies, Audit Logs & Seed Data Migrations

**Files:**
- Create: `supabase/migrations/20260813000003_rls_policies.sql`, `supabase/migrations/20260813000004_audit_logs.sql`, `supabase/migrations/20260813000005_seed_data.sql`

**Interfaces:**
- Produces: RLS policies, audit_logs table + trigger, and seed data.

- [ ] **Step 1: Create `supabase/migrations/20260813000003_rls_policies.sql`**

```sql
-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Departments / Positions / Roles / Permissions read policy (authenticated users)
CREATE POLICY "Departments are viewable by authenticated users" ON public.departments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Positions are viewable by authenticated users" ON public.positions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Roles are viewable by authenticated users" ON public.roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permissions are viewable by authenticated users" ON public.permissions
  FOR SELECT TO authenticated USING (true);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Managers can view direct reports" ON public.profiles
  FOR SELECT TO authenticated USING (
    id IN (SELECT employee_id FROM public.manager_assignments WHERE manager_id = auth.uid())
  );
```

- [ ] **Step 2: Create `supabase/migrations/20260813000004_audit_logs.sql`**

```sql
-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs viewable by authenticated users" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);
```

- [ ] **Step 3: Create `supabase/migrations/20260813000005_seed_data.sql`**

```sql
-- Seed Departments
INSERT INTO public.departments (code, name) VALUES
  ('BGD', 'Ban Giám Đốc'),
  ('NS', 'Phòng Nhân Sự'),
  ('TCKT', 'Phòng Tài Chính Kế Toán'),
  ('IT', 'Phòng Công Nghệ Thông Tin'),
  ('SX', 'Khối Sản Xuất')
ON CONFLICT (code) DO NOTHING;

-- Seed Positions
INSERT INTO public.positions (code, title, level) VALUES
  ('CEO', 'Tổng Giám Đốc', 4),
  ('HRM', 'Trưởng Phòng Nhân Sự', 3),
  ('TL_IT', 'Trưởng Nhóm IT', 2),
  ('DEV_SR', 'Kỹ Sư Phần Mềm Cao Cấp', 1),
  ('STAFF', 'Nhân Viên', 1)
ON CONFLICT (code) DO NOTHING;

-- Seed Roles
INSERT INTO public.roles (code, name, description) VALUES
  ('ADMIN', 'Quản trị hệ thống', 'Toàn quyền quản trị LPVN HR Workflow'),
  ('HR_MANAGER', 'Quản lý nhân sự', 'Quản lý thông tin nhân sự và báo cáo phép'),
  ('DEPARTMENT_HEAD', 'Trưởng phòng', 'Duyệt các yêu cầu cấp phòng ban'),
  ('DIRECT_MANAGER', 'Quản lý trực tiếp', 'Duyệt các đơn nghỉ phép, ra cổng của nhân viên trực thuộc'),
  ('EMPLOYEE', 'Nhân viên', 'Tạo và theo dõi đơn xin phép, xác nhận công, ra cổng')
ON CONFLICT (code) DO NOTHING;
```

- [ ] **Step 4: Commit SQL migration files**

```bash
git add supabase/migrations/
git commit -m "feat: add RLS policies, audit logs table, and initial seed data"
```

---

### Task 4: React AuthContext & useAuth Hook

**Files:**
- Create: `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`, `src/contexts/AuthContext.test.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase.ts`, `Database` from `src/types/database.types.ts`.
- Produces: `AuthProvider`, `useAuth` hook providing `{ user, session, profile, roles, isLoading, signIn, signOut }`.

- [ ] **Step 1: Create `src/contexts/AuthContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: string[]
  isLoading: boolean
  signIn: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setRoles([])
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

- [ ] **Step 2: Create `src/hooks/useAuth.ts`**

```ts
export { useAuth } from '@/contexts/AuthContext'
```

- [ ] **Step 3: Write test `src/contexts/AuthContext.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function TestComponent() {
  const { isLoading, user } = useAuth()
  return (
    <div>
      <span data-testid="status">{isLoading ? 'Loading' : 'Ready'}</span>
      <span data-testid="user">{user ? user.email : 'No user'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  it('renders auth context values', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('status')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run test and commit**

```bash
npm test -- src/contexts/AuthContext.test.tsx
git add src/contexts/AuthContext.tsx src/hooks/useAuth.ts src/contexts/AuthContext.test.tsx
git commit -m "feat: add AuthProvider and useAuth hook"
```

---

### Task 5: LoginPage UI Component

**Files:**
- Create: `src/pages/LoginPage.tsx`, `src/pages/LoginPage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useAuth` hook.
- Produces: `LoginPage` screen styled with LPVN Design Tokens.

- [ ] **Step 1: Write test `src/pages/LoginPage.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders login form with title and email input', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    )
    expect(screen.getByRole('heading', { name: /Đăng nhập LPVN HR Flow/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/nhanvien@lpvn.com/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create `src/pages/LoginPage.tsx`**

```tsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    const { error } = await signIn(email)
    setIsSubmitting(false)
    if (error) {
      setStatusMessage('Đã có lỗi xảy ra: ' + error.message)
    } else {
      setStatusMessage('Mã xác thực Magic Link đã được gửi tới email của bạn!')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            LPVN HR Flow
          </CardTitle>
          <CardDescription>
            Đăng nhập hệ thống quản lý quy trình nhân sự LPVN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email công ty
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@lpvn.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi Magic Link Đăng Nhập'}
            </Button>
            {statusMessage && (
              <p className="text-center text-xs text-muted-foreground mt-2">{statusMessage}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Update `src/App.tsx` to wrap with `AuthProvider`**

```tsx
import { AuthProvider } from './contexts/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <AuthProvider>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </AuthProvider>
  )
}

export default App
```

- [ ] **Step 4: Run test and commit**

```bash
npm test -- src/pages/LoginPage.test.tsx
git add src/pages/LoginPage.tsx src/pages/LoginPage.test.tsx src/App.tsx
git commit -m "feat: add LoginPage component and wire AuthProvider into App"
```

---

### Task 6: Checkpoint & Quality Gate Verification

**Files:**
- Modify: `plan.md`, `state.json`

- [ ] **Step 1: Update `plan.md` (tick Phase 02 items)**

Tick Phase 02 items in `plan.md`.

- [ ] **Step 2: Update `state.json`**

Update `progress.phase-02` to `{"status": "DONE", "percent": 100}`, set `current_phase` to `phase-02`, `current_task` to `phase-03-employee-organization`.

- [ ] **Step 3: Run quality gate and check state**

```bash
./scripts/quality-gate.sh
./scripts/check-state.sh
```

- [ ] **Step 4: Commit checkpoint**

```bash
git add plan.md state.json
git commit -m "docs: complete phase-02 supabase foundation checkpoint"
```
