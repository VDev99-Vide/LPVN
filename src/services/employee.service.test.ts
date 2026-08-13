import { describe, expect, it, vi } from 'vitest'
import { employeeService } from './employee.service'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  }
})

describe('EmployeeService', () => {
  it('exports employeeService object with CRUD methods', () => {
    expect(employeeService).toBeDefined()
    expect(typeof employeeService.getEmployees).toBe('function')
    expect(typeof employeeService.getEmployeeById).toBe('function')
    expect(typeof employeeService.createEmployee).toBe('function')
    expect(typeof employeeService.updateEmployee).toBe('function')
    expect(typeof employeeService.getOrgChartData).toBe('function')
  })

  it('getEmployees queries profiles with filters', async () => {
    const mockOr = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockSelect = vi.fn().mockReturnValue({ or: mockOr })
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

    const res = await employeeService.getEmployees({ search: 'test' })
    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(res).toEqual({ data: [], error: null })
  })

  it('getEmployeeById fetches single profile', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'emp-1', full_name: 'Test' },
      error: null,
    })
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

    const res = await employeeService.getEmployeeById('emp-1')
    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(res.data).toEqual({ id: 'emp-1', full_name: 'Test' })
  })

  it('createEmployee inserts a new profile row', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'emp-1', employee_code: 'LPVN-0001', full_name: 'John Doe', email: 'john@lpvn.com' },
      error: null,
    })
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any)

    const res = await employeeService.createEmployee({
      employee_code: 'LPVN-0001',
      full_name: 'John Doe',
      email: 'john@lpvn.com',
    })

    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(res.data?.full_name).toBe('John Doe')
  })

  it('updateEmployee updates profile by id', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'emp-1', full_name: 'Updated Name' },
      error: null,
    })
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })
    vi.mocked(supabase.from).mockReturnValue({ update: mockUpdate } as any)

    const res = await employeeService.updateEmployee('emp-1', { full_name: 'Updated Name' })
    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(res.data?.full_name).toBe('Updated Name')
  })

  it('getOrgChartData retrieves departments and profiles', async () => {
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'departments') {
        return {
          select: vi.fn().mockResolvedValue({ data: [{ id: 'd1', name: 'IT' }], error: null }),
        } as any
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [{ id: 'e1', full_name: 'Alice' }], error: null }),
      } as any
    })

    const res = await employeeService.getOrgChartData()
    expect(res.departments.length).toBe(1)
    expect(res.employees.length).toBe(1)
  })
})
