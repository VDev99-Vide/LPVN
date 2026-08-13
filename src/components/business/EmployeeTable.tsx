import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/business/StatusBadge'
import type { EmployeeWithRelations } from '@/services/employee.service'

export interface EmployeeTableProps {
  employees: EmployeeWithRelations[]
  onEdit?: (employee: EmployeeWithRelations) => void
  onToggleStatus?: (employee: EmployeeWithRelations) => void
  loading?: boolean
  itemsPerPage?: number
}

export function EmployeeTable({
  employees = [],
  onEdit,
  onToggleStatus,
  loading = false,
  itemsPerPage = 10,
}: EmployeeTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Họ và Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phòng Ban</TableHead>
              <TableHead>Chức Danh</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy nhân viên nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employee_code}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department?.name || '-'}</TableCell>
                  <TableCell>{employee.position?.title || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(employee)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant={employee.status === 'ACTIVE' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => onToggleStatus?.(employee)}
                    >
                      {employee.status === 'ACTIVE' ? 'Vô hiệu' : 'Kích hoạt'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {employees.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, employees.length)} trên tổng số {employees.length} nhân viên
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
