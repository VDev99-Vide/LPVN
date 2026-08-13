import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { EmployeeFormDrawer } from './EmployeeFormDrawer'
import type { DepartmentRow, PositionRow, ProfileRow } from '@/services/employee.service'

afterEach(cleanup)

const mockDepartments: DepartmentRow[] = [
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

const mockPositions: PositionRow[] = [
  {
    id: 'pos-1',
    code: 'DEV',
    title: 'Kỹ sư phần mềm',
    level: 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'pos-2',
    code: 'HRM',
    title: 'Chuyên viên Nhân sự',
    level: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
]

const mockEmployee: ProfileRow = {
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
}

describe('EmployeeFormDrawer', () => {
  it('renders drawer when open with title "Thêm Nhân Viên Mới" and input label "Họ và Tên"', () => {
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        departments={mockDepartments}
        positions={mockPositions}
      />
    )

    expect(screen.getByText('Thêm Nhân Viên Mới')).toBeInTheDocument()
    expect(screen.getByLabelText('Mã Nhân Viên')).toBeInTheDocument()
    expect(screen.getByLabelText('Họ và Tên')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Công Ty')).toBeInTheDocument()
    expect(screen.getByLabelText('Phòng Ban')).toBeInTheDocument()
    expect(screen.getByLabelText('Chức Danh')).toBeInTheDocument()
  })

  it('does not render drawer content when open state is false', () => {
    render(
      <EmployeeFormDrawer
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        departments={mockDepartments}
        positions={mockPositions}
      />
    )

    expect(screen.queryByText('Thêm Nhân Viên Mới')).not.toBeInTheDocument()
  })

  it('pre-fills form fields when initialData is provided for editing', () => {
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        departments={mockDepartments}
        positions={mockPositions}
        initialData={mockEmployee}
      />
    )

    expect(screen.getByText('Chỉnh Sửa Nhân Viên')).toBeInTheDocument()
    expect(screen.getByLabelText('Mã Nhân Viên')).toHaveValue('LPVN-0001')
    expect(screen.getByLabelText('Họ và Tên')).toHaveValue('Nguyen Van A')
    expect(screen.getByLabelText('Email Công Ty')).toHaveValue('nva@company.com')
    expect(screen.getByLabelText('Phòng Ban')).toHaveValue('dept-1')
    expect(screen.getByLabelText('Chức Danh')).toHaveValue('pos-1')
  })

  it('handles form submission with entered data', async () => {
    const handleSubmit = vi.fn()
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
        departments={mockDepartments}
        positions={mockPositions}
      />
    )

    fireEvent.change(screen.getByLabelText('Mã Nhân Viên'), {
      target: { value: 'LPVN-0099' },
    })
    fireEvent.change(screen.getByLabelText('Họ và Tên'), {
      target: { value: 'Le Van C' },
    })
    fireEvent.change(screen.getByLabelText('Email Công Ty'), {
      target: { value: 'lvc@company.com' },
    })
    fireEvent.change(screen.getByLabelText('Phòng Ban'), {
      target: { value: 'dept-2' },
    })
    fireEvent.change(screen.getByLabelText('Chức Danh'), {
      target: { value: 'pos-2' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith({
      employee_code: 'LPVN-0099',
      full_name: 'Le Van C',
      email: 'lvc@company.com',
      department_id: 'dept-2',
      position_id: 'pos-2',
      status: 'ACTIVE',
    })
  })

  it('shows loading state and disables actions when isSubmitting is true', () => {
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        departments={mockDepartments}
        positions={mockPositions}
        isSubmitting={true}
      />
    )

    const submitBtn = screen.getByRole('button', { name: 'Đang lưu...' })
    const cancelBtn = screen.getByRole('button', { name: 'Hủy' })

    expect(submitBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
  })

  it('calls onClose when Hủy button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <EmployeeFormDrawer
        isOpen={true}
        onClose={handleClose}
        onSubmit={vi.fn()}
        departments={mockDepartments}
        positions={mockPositions}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
