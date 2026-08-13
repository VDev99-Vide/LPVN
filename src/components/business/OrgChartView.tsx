import { useMemo } from 'react'
import type { DepartmentRow, EmployeeWithRelations } from '@/services/employee.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/business/StatusBadge'

export interface OrgChartViewProps {
  departments: DepartmentRow[]
  employees: EmployeeWithRelations[]
  loading?: boolean
  onSelectEmployee?: (employee: EmployeeWithRelations) => void
  onSelectDepartment?: (department: DepartmentRow) => void
}

export function OrgChartView({
  departments,
  employees,
  loading = false,
  onSelectEmployee,
  onSelectDepartment,
}: OrgChartViewProps) {
  // Group employees by department_id
  const employeesByDepartment = useMemo(() => {
    const map = new Map<string, EmployeeWithRelations[]>()

    departments.forEach((dept) => {
      map.set(dept.id, [])
    })

    employees.forEach((emp) => {
      if (emp.department_id && map.has(emp.department_id)) {
        map.get(emp.department_id)!.push(emp)
      }
    })

    return map
  }, [departments, employees])

  // Get unassigned employees if any
  const unassignedEmployees = useMemo(() => {
    const deptIds = new Set(departments.map((d) => d.id))
    return employees.filter((emp) => !emp.department_id || !deptIds.has(emp.department_id))
  }, [departments, employees])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Đang tải sơ đồ tổ chức...
      </div>
    )
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Không có dữ liệu phòng ban.
      </div>
    )
  }

  const getInitials = (name: string) => {
    if (!name) return 'NV'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptMembers = employeesByDepartment.get(dept.id) || []
          const memberCount = deptMembers.length

          return (
            <Card
              key={dept.id}
              className={`hover:shadow-md transition-shadow ${
                onSelectDepartment ? 'cursor-pointer' : ''
              }`}
              onClick={() => onSelectDepartment?.(dept)}
            >
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CardTitle className="text-base font-bold truncate">
                      {dept.name}
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {dept.code}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {memberCount} nhân sự
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {memberCount === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Chưa có nhân sự
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deptMembers.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={(e) => {
                          if (onSelectEmployee) {
                            e.stopPropagation()
                            onSelectEmployee(emp)
                          }
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                          onSelectEmployee ? 'cursor-pointer' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar size="sm">
                            {emp.avatar_url && (
                              <AvatarImage src={emp.avatar_url} alt={emp.full_name} />
                            )}
                            <AvatarFallback>{getInitials(emp.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-foreground truncate">
                                {emp.full_name}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground shrink-0">
                                ({emp.employee_code})
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {emp.position?.title || emp.email}
                            </div>
                          </div>
                        </div>
                        {emp.status && (
                          <div className="ml-2 shrink-0">
                            <StatusBadge status={emp.status} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {unassignedEmployees.length > 0 && (
        <Card className="border-dashed">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">
                  Chưa phân phòng ban
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  UNASSIGNED
                </Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {unassignedEmployees.length} nhân sự
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unassignedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee?.(emp)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                    onSelectEmployee ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar size="sm">
                      {emp.avatar_url && (
                        <AvatarImage src={emp.avatar_url} alt={emp.full_name} />
                      )}
                      <AvatarFallback>{getInitials(emp.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {emp.full_name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          ({emp.employee_code})
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {emp.position?.title || emp.email}
                      </div>
                    </div>
                  </div>
                  {emp.status && (
                    <div className="ml-2 shrink-0">
                      <StatusBadge status={emp.status} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
