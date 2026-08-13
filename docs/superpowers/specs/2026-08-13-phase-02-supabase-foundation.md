# Phase 02 — Supabase Foundation Design Specification

## 1. Goal & Context

Phase 02 establishes the backend foundation for **LPVN HR Workflow SaaS** on Supabase Cloud. It covers:
- Core HR & Organization Schema (`departments`, `positions`, `profiles`, `manager_assignments`).
- Role-Based Access Control (RBAC) System (`roles`, `permissions`, `role_permissions`, `user_roles`).
- Security Hardening: Row Level Security (RLS) policies for tenant data isolation.
- Governance & Compliance: Immutable `audit_logs` tracking all table modifications.
- Automatic User Sync: PostgreSQL trigger syncing `auth.users` → `public.profiles`.
- Frontend Integration: Supabase JS client, TypeScript database types, `AuthContext` provider, and login UI.

---

## 2. Technical Architecture & Database Schema

### 2.1. Entity Relationship Diagram (Conceptual)

```text
auth.users (Supabase Auth)
    │ 1:1
    ▼
public.profiles ───► public.departments (department_head_id)
    │               ▲
    │ M:1           │ M:1
    ├───────────────┴─── public.departments
    │ M:1
    ├─────────────────── public.positions
    │ 1:M
    ├─────────────────── public.manager_assignments (employee_id / manager_id)
    │ 1:M
    └─────────────────── public.user_roles ───► public.roles ───► public.role_permissions ───► public.permissions
```

### 2.2. Detailed Table Specifications

#### 1. `public.departments`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `code` (varchar(50), UNIQUE, NOT NULL) — e.g. `BGD`, `NS`, `TCKT`, `IT`, `SX`
- `name` (varchar(255), NOT NULL) — e.g. "Phòng Nhân sự"
- `parent_id` (uuid, FK `departments.id`, NULLABLE) — hỗ trợ phân cấp phòng ban
- `department_head_id` (uuid, NULLABLE) — Trưởng phòng
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)

#### 2. `public.positions`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `code` (varchar(50), UNIQUE, NOT NULL) — e.g. `CEO`, `HRM`, `TL_IT`, `DEV_SR`, `STAFF`
- `title` (varchar(255), NOT NULL) — e.g. "Trưởng phòng Nhân sự"
- `level` (int, default 1) — Cấp bậc (1: Nhân viên, 2: Trưởng nhóm, 3: Trưởng phòng, 4: Giám đốc)
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)

#### 3. `public.profiles`
- `id` (uuid, PK, FK `auth.users.id` ON DELETE CASCADE)
- `employee_code` (varchar(50), UNIQUE, NOT NULL) — e.g. `LPVN-0001`
- `full_name` (varchar(255), NOT NULL)
- `email` (varchar(255), NOT NULL)
- `avatar_url` (text, NULLABLE)
- `department_id` (uuid, FK `departments.id`, NULLABLE)
- `position_id` (uuid, FK `positions.id`, NULLABLE)
- `status` (varchar(20), default `'ACTIVE'`, CHECK `status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')`)
- `join_date` (date, default `CURRENT_DATE`)
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)

#### 4. `public.manager_assignments`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `employee_id` (uuid, FK `profiles.id` ON DELETE CASCADE, NOT NULL)
- `manager_id` (uuid, FK `profiles.id` ON DELETE CASCADE, NOT NULL)
- `is_primary` (boolean, default `true`)
- `effective_date` (date, default `CURRENT_DATE`)
- `end_date` (date, NULLABLE)
- `created_at` (timestamptz, default `now()`)

#### 5. `public.roles` & `public.permissions`
- `roles`: `id` (uuid), `code` (varchar(50), UNIQUE), `name` (varchar(100)), `description` (text)
  - Pre-seeded roles: `ADMIN`, `HR_MANAGER`, `DEPARTMENT_HEAD`, `DIRECT_MANAGER`, `EMPLOYEE`
- `permissions`: `id` (uuid), `code` (varchar(100), UNIQUE), `name` (varchar(100)), `module` (varchar(50))
  - Modules: `EMPLOYEE`, `LEAVE`, `GATE_PASS`, `ATTENDANCE`, `APPROVAL`, `REPORTING`
- `role_permissions`: `role_id` (uuid), `permission_id` (uuid), PRIMARY KEY (`role_id`, `permission_id`)
- `user_roles`: `user_id` (uuid, FK `profiles.id`), `role_id` (uuid, FK `roles.id`), PRIMARY KEY (`user_id`, `role_id`)

#### 6. `public.audit_logs`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `table_name` (varchar(100), NOT NULL)
- `record_id` (uuid, NOT NULL)
- `action` (varchar(20), NOT NULL) — `INSERT`, `UPDATE`, `DELETE`
- `old_data` (jsonb, NULLABLE)
- `new_data` (jsonb, NULLABLE)
- `actor_id` (uuid, NULLABLE) — `auth.uid()`
- `created_at` (timestamptz, default `now()`)

---

## 3. Database Triggers & RLS Policies

### 3.1. Automatic User Profile Creation Trigger
```sql
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3.2. Audit Logging Trigger Function
Generates audit entries automatically on any mutation to monitored tables.

### 3.3. Row Level Security (RLS)
- **`departments` / `positions` / `roles` / `permissions`**:
  - `SELECT`: Enabled for all `authenticated` users.
  - `INSERT / UPDATE / DELETE`: Restricted to users with `ADMIN` or `HR_MANAGER` role.
- **`profiles`**:
  - `SELECT`:
    - Users can view their own profile (`id = auth.uid()`).
    - Managers can view their direct subordinates (`id IN (SELECT employee_id FROM manager_assignments WHERE manager_id = auth.uid())`).
    - Department Heads can view employees in their department.
    - Admins & HR Managers can view all profiles.
  - `UPDATE`: Self update limited to non-critical fields (avatar, etc.); HR/Admin can update all.
- **`audit_logs`**:
  - `SELECT`: Admins and HR Managers only.
  - `INSERT`: System triggers only (Security Definer).

---

## 4. Frontend Integration Layer

1. **Supabase Client Helper (`src/lib/supabase.ts`)**:
   - Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Exports typed `supabase` client instance.

2. **Database Types (`src/types/database.types.ts`)**:
   - Strongly typed Database interfaces covering tables, enums, functions, and helper types.

3. **React Auth Context (`src/contexts/AuthContext.tsx` & `src/hooks/useAuth.ts`)**:
   - Tracks current `user`, `session`, `profile`, `roles`, `permissions`, and `isLoading`.
   - Exposes `signIn`, `signOut`, and `hasPermission` methods.

4. **Login Page UI (`src/pages/LoginPage.tsx`)**:
   - Professional clean login screen styled with LPVN Design Tokens (Teal palette, responsive, dark/light theme).

---

## 5. Verification & Definition of Done

- Migration files created cleanly in `supabase/migrations/`:
  - `20260813000001_initial_schema.sql`
  - `20260813000002_rbac_system.sql`
  - `20260813000003_rls_policies.sql`
  - `20260813000004_audit_logs.sql`
  - `20260813000005_seed_data.sql`
- Frontend code created in `src/`:
  - `src/lib/supabase.ts`
  - `src/types/database.types.ts`
  - `src/contexts/AuthContext.tsx`
  - `src/hooks/useAuth.ts`
  - `src/pages/LoginPage.tsx`
  - Tests covering `supabase.ts`, `AuthContext`, and `LoginPage`.
- Quality Gate: `npm run typecheck && npm run lint && npm test && npm run build` exit code 0.
