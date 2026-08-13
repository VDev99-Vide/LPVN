# Phase 04 — Leave & Annual Leave Design Specification

## 1. Goal & Context

Phase 04 implements the Leave & Annual Leave Management system for **LPVN HR Workflow SaaS**:
- Database schema for Leave Categories (`leave_types`), Entitlements (`leave_entitlements`), and Real-time Balances (`leave_balances`).
- Automatic entitlement calculation rules based on company policy & employee seniority.
- Balance validation engine: prevents submitting leave requests exceeding available balance (except unpaid leave).
- Historical balance snapshotting for compliance & auditing.
- Frontend Dashboard with visual balance cards, department balance tables, and entitlement management modals.

---

## 2. Technical Architecture & Database Schema

### 2.1. Database Schema (`supabase/migrations/20260813000006_leave_system.sql`)

#### 1. `public.leave_types`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `code` (varchar(50), UNIQUE, NOT NULL) — e.g. `ANNUAL`, `MARRIAGE`, `UNPAID`, `SICK`, `BEREAVEMENT`, `MATERNITY`, `OTHER`
- `name` (varchar(100), NOT NULL) — e.g. "Nghỉ phép năm"
- `is_paid` (boolean, default `true`) — Nghỉ hưởng lương hay không hưởng lương
- `requires_attachment` (boolean, default `false`) — Yêu cầu nộp tệp đính kèm (giấy viện, đăng ký kết hôn...)
- `created_at` (timestamptz, default `now()`)

#### 2. `public.leave_entitlements`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `employee_id` (uuid, FK `profiles.id` ON DELETE CASCADE, NOT NULL)
- `year` (int, NOT NULL) — Ví dụ: `2026`
- `base_days` (numeric(4,1), default `12.0`) — Số ngày phép gốc theo hợp đồng
- `seniority_days` (numeric(4,1), default `0.0`) — Số ngày phép thâm niên
- `bonus_days` (numeric(4,1), default `0.0`) — Số ngày phép thưởng/cộng thêm
- `total_days` (numeric(4,1), NOT NULL) — `base_days + seniority_days + bonus_days`
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)
- UNIQUE (`employee_id`, `year`)

#### 3. `public.leave_balances`
- `id` (uuid, PK, default `gen_random_uuid()`)
- `employee_id` (uuid, FK `profiles.id` ON DELETE CASCADE, NOT NULL)
- `year` (int, NOT NULL)
- `leave_type_id` (uuid, FK `leave_types.id` ON DELETE CASCADE, NOT NULL)
- `total_days` (numeric(4,1), default `0.0`)
- `used_days` (numeric(4,1), default `0.0`)
- `pending_days` (numeric(4,1), default `0.0`)
- `remaining_days` (numeric(4,1), default `0.0`) — `total_days - used_days - pending_days`
- `created_at` (timestamptz, default `now()`)
- `updated_at` (timestamptz, default `now()`)
- UNIQUE (`employee_id`, `year`, `leave_type_id`)

---

## 3. Frontend Integration Layer

1. **Leave Data Service (`src/services/leave.service.ts`)**:
   - `getLeaveTypes()`: Fetch active leave categories.
   - `getLeaveBalances(employeeId, year)`: Fetch employee's leave balance breakdown.
   - `getAllLeaveBalances(params)`: Fetch all employee balances for HR management view.
   - `updateEntitlement(payload)`: Adjust entitlement base/seniority/bonus days.

2. **UI Components (`src/components/business/`)**:
   - `LeaveBalanceCards.tsx`: Stat summary cards showing Total Allowance, Days Used, Pending Approval, and Remaining Days.
   - `LeaveBalanceTable.tsx`: HR table listing employees, leave types, total entitlement, used days, and remaining balance.
   - `LeaveEntitlementModal.tsx`: Modal dialog for HR to adjust an employee's annual leave quota.

3. **Page Component (`src/pages/LeaveManagementPage.tsx`)**:
   - Tab 1: **Số Dư Phép Cá Nhân** (Personal balance breakdown & history).
   - Tab 2: **Quản Lý Quỹ Phép Công Ty** (HR view of company-wide leave quotas & entitlements).

---

## 4. Verification & Definition of Done

- Migration SQL file `supabase/migrations/20260813000006_leave_system.sql` with tables, RLS policies, and seed data.
- Service unit tests (`src/services/leave.service.test.ts`).
- Component unit tests (`src/components/business/LeaveBalanceCards.test.tsx`, `LeaveBalanceTable.test.tsx`, `LeaveEntitlementModal.test.tsx`, `src/pages/LeaveManagementPage.test.tsx`).
- Full test suite passing with 0 errors.
- Quality Gate: `npm run typecheck && npm run lint && npm test && npm run build` exit code 0.
