import { useCallback, useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeTable } from '@/components/business/EmployeeTable'
import { OrgChartView } from '@/components/business/OrgChartView'
import { EmployeeFormDrawer, type EmployeeFormData } from '@/components/business/EmployeeFormDrawer'
import {
  employeeService,
  type DepartmentRow,
  type EmployeeWithRelations,
  type PositionRow,
  type ProfileRow,
} from '@/services/employee.service'
import { supabase } from '@/lib/supabase'

import { AdminUserCreatorModal, type CreatedUserData } from '@/components/business/AdminUserCreatorModal'
import { UserPlus } from 'lucide-react'

export function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([])
  const [orgChartDepartments, setOrgChartDepartments] = useState<DepartmentRow[]>([])
  const [orgChartEmployees, setOrgChartEmployees] = useState<EmployeeWithRelations[]>([])
  const [positions, setPositions] = useState<PositionRow[]>([])

  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [activeTab, setActiveTab] = useState('list')

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isUserCreatorOpen, setIsUserCreatorOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeWithRelations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch filtered employee list
  const loadEmployees = useCallback(async () => {
    setLoading(true)
    const { data } = await employeeService.getEmployees({
      search: searchTerm.trim() || undefined,
      departmentId: departmentFilter !== 'ALL' ? departmentFilter : undefined,
    })
    setEmployees(data || [])
    setLoading(false)
  }, [searchTerm, departmentFilter])

  // Fetch org chart data and positions
  const loadOrgData = useCallback(async () => {
    const { departments, employees: allEmps } = await employeeService.getOrgChartData()
    setOrgChartDepartments(departments || [])
    setOrgChartEmployees(allEmps || [])

    try {
      const { data: posData } = await supabase.from('positions').select('*')
      if (posData) {
        setPositions(posData as PositionRow[])
      }
    } catch {
      // Ignore fallback error
    }
  }, [])

  useEffect(() => {
    loadOrgData()
  }, [loadOrgData])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleOpenAddDrawer = () => {
    setEditingEmployee(null)
    setIsDrawerOpen(true)
  }

  const handleUserCreated = (_user: CreatedUserData) => {
    loadEmployees()
    loadOrgData()
  }

  const handleEditEmployee = (emp: EmployeeWithRelations) => {
    setEditingEmployee(emp)
    setIsDrawerOpen(true)
  }

  const handleToggleStatus = async (emp: EmployeeWithRelations) => {
    const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const { error } = await employeeService.updateEmployee(emp.id, { status: newStatus })
    if (!error) {
      await loadEmployees()
      await loadOrgData()
    }
  }

  const handleFormSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true)
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, formData)
      } else {
        await employeeService.createEmployee(formData)
      }
      setIsDrawerOpen(false)
      setEditingEmployee(null)
      await loadEmployees()
      await loadOrgData()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản lý Nhân sự & Cơ cấu Tổ chức
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý thông tin nhân viên, chức danh và sơ đồ tổ chức công ty.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsUserCreatorOpen(true)}
            className="shrink-0 gap-2 btn-gold text-xs h-9 px-4 font-bold rounded-full"
          >
            <UserPlus className="h-4 w-4" />
            + Tạo User Trực Tiếp (Admin)
          </Button>
          <Button onClick={handleOpenAddDrawer} variant="outline" className="shrink-0 gap-2 text-xs h-9 rounded-full">
            <Plus className="h-4 w-4" />
            Thêm Hồ Sơ
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="list">Danh Sách Nhân Viên</TabsTrigger>
          <TabsTrigger value="org">Sơ Đồ Tổ Chức</TabsTrigger>
        </TabsList>

        {/* Tab 1: Employee List */}
        <TabsContent value="list" className="space-y-4 pt-4">
          {/* Search & Department Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mã NV, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-[220px]">
              <select
                aria-label="Lọc theo phòng ban"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="ALL">Tất cả phòng ban</option>
                {orgChartDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Table */}
          <EmployeeTable
            employees={employees}
            loading={loading}
            onEdit={handleEditEmployee}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>

        {/* Tab 2: Org Chart */}
        <TabsContent value="org" className="pt-4">
          <OrgChartView
            departments={orgChartDepartments}
            employees={orgChartEmployees}
            loading={loading}
            onSelectEmployee={handleEditEmployee}
            onSelectDepartment={(dept) => {
              setDepartmentFilter(dept.id)
              setActiveTab('list')
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Drawer Dialog for Create / Edit */}
      <EmployeeFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditingEmployee(null)
        }}
        onSubmit={handleFormSubmit}
        departments={orgChartDepartments}
        positions={positions}
        initialData={editingEmployee as Partial<ProfileRow> | null}
        isSubmitting={isSubmitting}
      />

      {/* Admin User Creator Modal */}
      <AdminUserCreatorModal
        isOpen={isUserCreatorOpen}
        onClose={() => setIsUserCreatorOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  )
}
