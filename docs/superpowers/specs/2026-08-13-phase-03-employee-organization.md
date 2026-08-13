# Phase 03 — Employee & Organization Design Specification

## 1. Goal & Context

Phase 03 implements the core HR Employee & Organization Management domain for **LPVN HR Workflow SaaS**:
- Full CRUD operations for Employee Profiles (Create, Read, Update, Status toggle).
- Direct Manager Mapping (`manager_assignments` table integration).
- Department Head Assignment (`department_head_id` in `departments` table).
- Interactive Visual Org Chart View (Hierarchical Tree representation).
- Search, Department Filter, Position Filter, and Pagination.
- Full integration with Supabase Database Services & React AuthContext.

---

## 2. Technical Architecture & Component Breakdown

### 2.1. File Structure & Component Design

```text
src/
├── services/
│   └── employee.service.ts         # Supabase API queries for profiles, departments, positions, manager_assignments
├── components/
│   └── business/
│       ├── EmployeeTable.tsx       # Paginated table with status badge & quick actions
│       ├── EmployeeFormDrawer.tsx  # Create / Edit Employee Drawer form
│       ├── ManagerSelect.tsx       # Async searchable Manager dropdown
│       └── OrgChartView.tsx        # Interactive tree diagram of departments & hierarchy
├── pages/
│   └── EmployeesPage.tsx           # Page component with Tabs (List View / Org Chart View)
```

### 2.2. Data Services (`src/services/employee.service.ts`)

- `getEmployees(params)`: Fetch profiles with joined `departments`, `positions`, and primary `manager_assignments`. Supports searching by code/name/email and filtering by department/status.
- `getEmployeeById(id)`: Fetch single profile details including assigned manager history.
- `createEmployee(data)`: Create user profile & optional initial manager assignment.
- `updateEmployee(id, data)`: Update profile fields, status, department, position, or direct manager assignment.
- `getOrgChartData()`: Fetch department tree with department heads and nested employee nodes.

---

## 3. UI/UX Design & Workflows

### 3.1. Page Layout (`EmployeesPage.tsx`)
- Header with Page Title ("Quản lý Nhân sự & Cơ cấu Tổ chức") and action button `[ + Thêm Nhân Viên ]`.
- Tabs Switcher:
  - **Tab 1: Danh sách Nhân viên (`EmployeeTable`)**
    - Search bar (Filter by Name, Employee Code, Email).
    - Select Filters: Department dropdown, Position dropdown, Status (Tất cả / Active / Inactive).
    - Table columns: Code (`LPVN-0001`), Full Name, Email, Department, Position, Direct Manager, Status (`StatusBadge`), Actions (`[ Sửa ]`, `[ Đổi Trạng Thái ]`).
    - Pagination controls (Items per page, Previous/Next page buttons).
  - **Tab 2: Sơ đồ Tổ chức (`OrgChartView`)**
    - Visual hierarchy card tree displaying Departments, Department Heads, and Team Members.

### 3.2. Employee Form Drawer (`EmployeeFormDrawer.tsx`)
- Slide-over Drawer containing form fields:
  - Employee Code (e.g. `LPVN-0001`, required, auto-generated or manual).
  - Full Name (required).
  - Email (required).
  - Department (Select dropdown from `departments`).
  - Position (Select dropdown from `positions`).
  - Direct Manager (Select dropdown from `profiles`).
  - Status (Active / Inactive).
- Form validation via Zod or React state with clear error feedback.

---

## 4. Verification & Definition of Done

- Service layer tests (`src/services/employee.service.test.ts`).
- Component tests (`src/components/business/EmployeeTable.test.tsx`, `OrgChartView.test.tsx`, `src/pages/EmployeesPage.test.tsx`).
- All 9 existing test files + new Phase 03 test files passing.
- Quality Gate: `npm run typecheck && npm run lint && npm test && npm run build` exit code 0.
