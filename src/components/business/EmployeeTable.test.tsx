import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { EmployeeTable } from './EmployeeTable'
import type { EmployeeWithRelations } from '@/services/employee.service'

afterEach(cleanup)

const mockEmployees: EmployeeWithRelations[] = [
  {
    id: 'emp-1',
    employee_code: 'LPVN-0001',
    full_name: 'Nguyen Van A',
    email: 'nva@company.com',
    avatar_url: null,
    department_id: 'dept-1',
    position_id: 'pos-1',
    status: 'ACTIVE',
    join_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    department: {
      id: 'dept-1',
      code: 'TECH',
      name: 'Phòng Công nghệ',
      parent_id: null,
      department_head_id: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    position: {
      id: 'pos-1',
      code: 'DEV',
      title: 'Kỹ sư phần mềm',
      level: 2,
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
    department_id: 'dept-2',
    position_id: 'pos-2',
    status: 'INACTIVE',
    join_date: '2025-02-01',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    department: {
      id: 'dept-2',
      code: 'HR',
      name: 'Phòng Nhân sự',
      parent_id: null,
      department_head_id: null,
      created_at: '2025-02-01T00:00:00Z',
      updated_at: '2025-02-01T00:00:00Z',
    },
    position: {
      id: 'pos-2',
      code: 'HRM',
      title: 'Chuyên viên Nhân sự',
      level: 1,
      created_at: '2025-02-01T00:00:00Z',
      updated_at: '2025-02-01T00:00:00Z',
    },
  },
]

describe('EmployeeTable', () => {
  it('renders table headers correctly', () => {
    render(<EmployeeTable employees={[]} />)
    expect(screen.getByText('Mã NV')).toBeInTheDocument()
    expect(screen.getByText('Họ và Tên')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phòng Ban')).toBeInTheDocument()
    expect(screen.getByText('Chức Danh')).toBeInTheDocument()
    expect(screen.getByText('Trạng Thái')).toBeInTheDocument()
    expect(screen.getByText('Thao Tác')).toBeInTheDocument()
  })

  it('renders row items with correct data including employee code, name, and department', () => {
    render(<EmployeeTable employees={mockEmployees} />)
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument()
    expect(screen.getByText('nva@company.com')).toBeInTheDocument()
    expect(screen.getByText('Phòng Công nghệ')).toBeInTheDocument()
    expect(screen.getByText('Kỹ sư phần mềm')).toBeInTheDocument()

    expect(screen.getByText('LPVN-0002')).toBeInTheDocument()
    expect(screen.getByText('Tran Thi B')).toBeInTheDocument()
    expect(screen.getByText('Phòng Nhân sự')).toBeInTheDocument()
  })

  it('triggers onEdit callback when Sửa button is clicked', () => {
    const handleEdit = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onEdit={handleEdit} />)

    const editButtons = screen.getAllByRole('button', { name: 'Sửa' })
    fireEvent.click(editButtons[0])

    expect(handleEdit).toHaveBeenCalledTimes(1)
    expect(handleEdit).toHaveBeenCalledWith(mockEmployees[0])
  })

  it('triggers onToggleStatus callback when status action button is clicked', () => {
    const handleToggleStatus = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onToggleStatus={handleToggleStatus} />)

    const deactivateButton = screen.getByRole('button', { name: 'Vô hiệu' })
    fireEvent.click(deactivateButton)
    expect(handleToggleStatus).toHaveBeenCalledWith(mockEmployees[0])

    const activateButton = screen.getByRole('button', { name: 'Kích hoạt' })
    fireEvent.click(activateButton)
    expect(handleToggleStatus).toHaveBeenCalledWith(mockEmployees[1])
  })

  it('renders loading state when loading prop is true', () => {
    render(<EmployeeTable employees={[]} loading={true} />)
    expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument()
  })

  it('renders empty message when employees list is empty', () => {
    render(<EmployeeTable employees={[]} />)
    expect(screen.getByText('Không tìm thấy nhân viên nào.')).toBeInTheDocument()
  })

  it('supports pagination', () => {
    render(<EmployeeTable employees={mockEmployees} itemsPerPage={1} />)

    // Page 1 should show LPVN-0001 and not LPVN-0002
    expect(screen.getByText('LPVN-0001')).toBeInTheDocument()
    expect(screen.queryByText('LPVN-0002')).not.toBeInTheDocument()
    expect(screen.getByText('Trang 1 / 2')).toBeInTheDocument()

    // Click Next page
    const nextBtn = screen.getByRole('button', { name: 'Sau' })
    fireEvent.click(nextBtn)

    // Page 2 should show LPVN-0002 and not LPVN-0001
    expect(screen.getByText('LPVN-0002')).toBeInTheDocument()
    expect(screen.queryByText('LPVN-0001')).not.toBeInTheDocument()
    expect(screen.getByText('Trang 2 / 2')).toBeInTheDocument()
  })
})
