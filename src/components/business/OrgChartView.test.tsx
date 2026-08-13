import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { OrgChartView } from './OrgChartView'
import type { DepartmentRow, EmployeeWithRelations } from '@/services/employee.service'

afterEach(cleanup)

const mockDepartments: DepartmentRow[] = [
  {
    id: 'dept-bgd',
    code: 'BGD',
    name: 'Ban Giám Đốc',
    parent_id: null,
    department_head_id: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-tech',
    code: 'TECH',
    name: 'Phòng Công nghệ',
    parent_id: null,
    department_head_id: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-hr',
    code: 'HR',
    name: 'Phòng Nhân sự',
    parent_id: null,
    department_head_id: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

const mockEmployees: EmployeeWithRelations[] = [
  {
    id: 'emp-1',
    employee_code: 'LPVN-0001',
    full_name: 'Nguyen Van A',
    email: 'nva@company.com',
    avatar_url: null,
    department_id: 'dept-bgd',
    position_id: 'pos-1',
    status: 'ACTIVE',
    join_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    department: mockDepartments[0],
    position: {
      id: 'pos-1',
      code: 'CEO',
      title: 'Tổng Giám đốc',
      level: 5,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  },
  {
    id: 'emp-2',
    employee_code: 'LPVN-0002',
    full_name: 'Tran Thi B',
    email: 'ttb@company.com',
    avatar_url: null,
    department_id: 'dept-tech',
    position_id: 'pos-2',
    status: 'ACTIVE',
    join_date: '2025-02-01',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    department: mockDepartments[1],
    position: {
      id: 'pos-2',
      code: 'DEV',
      title: 'Kỹ sư phần mềm',
      level: 2,
      created_at: '2025-02-01T00:00:00Z',
      updated_at: '2025-02-01T00:00:00Z',
    },
  },
]

describe('OrgChartView', () => {
  it('renders department cards with department code badge and member count', () => {
    render(<OrgChartView departments={mockDepartments} employees={mockEmployees} />)

    expect(screen.getByText('Ban Giám Đốc')).toBeInTheDocument()
    expect(screen.getByText('BGD')).toBeInTheDocument()

    expect(screen.getByText('Phòng Công nghệ')).toBeInTheDocument()
    expect(screen.getByText('TECH')).toBeInTheDocument()

    const oneMemberBadges = screen.getAllByText('1 nhân sự')
    expect(oneMemberBadges.length).toBe(2)

    expect(screen.getByText('Phòng Nhân sự')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
    expect(screen.getByText('0 nhân sự')).toBeInTheDocument()
  })

  it('renders department members with full name, employee code, and position title', () => {
    render(<OrgChartView departments={mockDepartments} employees={mockEmployees} />)

    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('(LPVN-0001)')).toBeInTheDocument()
    expect(screen.getByText('Tổng Giám đốc')).toBeInTheDocument()

    expect(screen.getByText('Tran Thi B')).toBeInTheDocument()
    expect(screen.getByText('(LPVN-0002)')).toBeInTheDocument()
    expect(screen.getByText('Kỹ sư phần mềm')).toBeInTheDocument()
  })

  it('renders empty state notice for departments with zero members', () => {
    render(<OrgChartView departments={mockDepartments} employees={mockEmployees} />)

    expect(screen.getByText('Chưa có nhân sự')).toBeInTheDocument()
  })

  it('renders loading state when loading prop is true', () => {
    render(<OrgChartView departments={[]} employees={[]} loading={true} />)

    expect(screen.getByText('Đang tải sơ đồ tổ chức...')).toBeInTheDocument()
  })

  it('renders empty message when department list is empty', () => {
    render(<OrgChartView departments={[]} employees={[]} />)

    expect(screen.getByText('Không có dữ liệu phòng ban.')).toBeInTheDocument()
  })

  it('renders unassigned section for employees without department_id', () => {
    const unassignedEmployee: EmployeeWithRelations = {
      id: 'emp-3',
      employee_code: 'LPVN-0003',
      full_name: 'Le Van C',
      email: 'lvc@company.com',
      avatar_url: null,
      department_id: null,
      position_id: null,
      status: 'ACTIVE',
      join_date: '2025-03-01',
      created_at: '2025-03-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z',
    }

    render(
      <OrgChartView
        departments={mockDepartments}
        employees={[...mockEmployees, unassignedEmployee]}
      />
    )

    expect(screen.getByText('Chưa phân phòng ban')).toBeInTheDocument()
    expect(screen.getByText('Le Van C')).toBeInTheDocument()
    expect(screen.getByText('(LPVN-0003)')).toBeInTheDocument()
  })

  it('triggers onSelectEmployee callback when employee card is clicked', () => {
    const handleSelectEmployee = vi.fn()
    render(
      <OrgChartView
        departments={mockDepartments}
        employees={mockEmployees}
        onSelectEmployee={handleSelectEmployee}
      />
    )

    const empCard = screen.getByText('Nguyen Van A')
    fireEvent.click(empCard)

    expect(handleSelectEmployee).toHaveBeenCalledTimes(1)
    expect(handleSelectEmployee).toHaveBeenCalledWith(mockEmployees[0])
  })

  it('triggers onSelectDepartment callback when department card is clicked', () => {
    const handleSelectDept = vi.fn()
    render(
      <OrgChartView
        departments={mockDepartments}
        employees={mockEmployees}
        onSelectDepartment={handleSelectDept}
      />
    )

    const deptHeader = screen.getByText('Ban Giám Đốc')
    fireEvent.click(deptHeader)

    expect(handleSelectDept).toHaveBeenCalledTimes(1)
    expect(handleSelectDept).toHaveBeenCalledWith(mockDepartments[0])
  })
})
