import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DepartmentRow, PositionRow, ProfileRow } from '@/services/employee.service'

export interface EmployeeFormData {
  employee_code: string
  full_name: string
  email: string
  department_id?: string | null
  position_id?: string | null
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export interface EmployeeFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => Promise<void> | void
  departments?: DepartmentRow[]
  positions?: PositionRow[]
  initialData?: Partial<ProfileRow> | null
  isSubmitting?: boolean
}

export function EmployeeFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  departments = [],
  positions = [],
  initialData = null,
  isSubmitting = false,
}: EmployeeFormDrawerProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_code: '',
    full_name: '',
    email: '',
    department_id: '',
    position_id: '',
    status: 'ACTIVE',
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          employee_code: initialData.employee_code || '',
          full_name: initialData.full_name || '',
          email: initialData.email || '',
          department_id: initialData.department_id || '',
          position_id: initialData.position_id || '',
          status: initialData.status || 'ACTIVE',
        })
      } else {
        setFormData({
          employee_code: '',
          full_name: '',
          email: '',
          department_id: '',
          position_id: '',
          status: 'ACTIVE',
        })
      }
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="employee_code">Mã Nhân Viên</Label>
            <Input
              id="employee_code"
              name="employee_code"
              value={formData.employee_code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, employee_code: e.target.value }))
              }
              placeholder="VD: LPVN-0001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và Tên</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Công Ty</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="VD: nva@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Phòng Ban</Label>
            <select
              id="department_id"
              name="department_id"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.department_id || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  department_id: e.target.value || null,
                }))
              }
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position_id">Chức Danh</Label>
            <select
              id="position_id"
              name="position_id"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.position_id || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  position_id: e.target.value || null,
                }))
              }
            >
              <option value="">-- Chọn chức danh --</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
