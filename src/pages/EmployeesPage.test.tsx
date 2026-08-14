import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmployeesPage } from './EmployeesPage'
import { employeeService } from '@/services/employee.service'

vi.mock('@/services/employee.service', () => ({
  employeeService: {
    getEmployees: vi.fn(),
    getOrgChartData: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
  },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}))

const mockDepartments = [
  {
    id: 'dept-1',
    code: 'TECH',
    name: 'Phòng Công nghệ',
    parent_id: null,
    department_head_id: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'dept-2',
    code: 'HR',
    name: 'Phòng Nhân sự',
    parent_id: null,
    department_head_id: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

const mockEmployees = [
  {
    id: 'emp-1',
    employee_code: 'LPVN-0001',
    full_name: 'Nguyen Van A',
    email: 'nva@company.com',
    avatar_url: null,
    department_id: 'dept-1',
    position_id: 'pos-1',
    status: 'ACTIVE' as const,
    join_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    department: mockDepartments[0],
    position: {
      id: 'pos-1',
      code: 'DEV',
      title: 'Kỹ sư phần mềm',
      level: 2,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  },
]

describe('EmployeesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(employeeService.getEmployees).mockResolvedValue({
      data: mockEmployees,
      error: null,
    })
    vi.mocked(employeeService.getOrgChartData).mockResolvedValue({
      departments: mockDepartments,
      employees: mockEmployees,
    })
    vi.mocked(employeeService.createEmployee).mockResolvedValue({
      data: mockEmployees[0],
      error: null,
    })
    vi.mocked(employeeService.updateEmployee).mockResolvedValue({
      data: mockEmployees[0],
      error: null,
    })
  })

  afterEach(cleanup)

  it('renders heading "Quản lý Nhân sự & Cơ cấu Tổ chức" and user creation buttons', async () => {
    render(<EmployeesPage />)

    expect(
      screen.getByRole('heading', { name: 'Quản lý Nhân sự & Cơ cấu Tổ chức' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Tạo User Trực Tiếp/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thêm Hồ Sơ/i })).toBeInTheDocument()
  })

  it('renders tabs and loads employee table content by default', async () => {
    render(<EmployeesPage />)

    expect(screen.getByRole('tab', { name: 'Danh Sách Nhân Viên' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sơ Đồ Tổ Chức' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
      expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    })
  })

  it('switches tabs to "Sơ Đồ Tổ Chức" and renders org chart view', async () => {
    const user = userEvent.setup()
    render(<EmployeesPage />)

    const orgTab = screen.getByRole('tab', { name: 'Sơ Đồ Tổ Chức' })
    await user.click(orgTab)

    await waitFor(() => {
      expect(screen.getByText('Phòng Công nghệ')).toBeInTheDocument()
      expect(screen.getByText('Phòng Nhân sự')).toBeInTheDocument()
    })
  })

  it('opens add drawer when "Thêm Hồ Sơ" button is clicked', async () => {
    render(<EmployeesPage />)

    const addButton = screen.getByRole('button', { name: /Thêm Hồ Sơ/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Thêm Nhân Viên Mới')).toBeInTheDocument()
    })
  })

  it('filters employees when searching or selecting department', async () => {
    render(<EmployeesPage />)

    const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, mã NV, email...')
    fireEvent.change(searchInput, { target: { value: 'Nguyen' } })

    await waitFor(() => {
      expect(employeeService.getEmployees).toHaveBeenCalledWith({
        search: 'Nguyen',
        departmentId: undefined,
      })
    })

    const deptSelect = screen.getByLabelText('Lọc theo phòng ban')
    fireEvent.change(deptSelect, { target: { value: 'dept-1' } })

    await waitFor(() => {
      expect(employeeService.getEmployees).toHaveBeenCalledWith({
        search: 'Nguyen',
        departmentId: 'dept-1',
      })
    })
  })

  it('handles toggling employee status', async () => {
    render(<EmployeesPage />)

    await waitFor(() => {
      expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    })

    const deactivateBtn = screen.getByRole('button', { name: 'Vô hiệu' })
    fireEvent.click(deactivateBtn)

    await waitFor(() => {
      expect(employeeService.updateEmployee).toHaveBeenCalledWith('emp-1', {
        status: 'INACTIVE',
      })
    })
  })
})
