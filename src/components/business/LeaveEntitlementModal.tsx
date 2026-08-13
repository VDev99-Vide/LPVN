import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface LeaveEntitlementFormData {
  base_days: number
  seniority_days: number
  bonus_days: number
}

export interface LeaveEntitlementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LeaveEntitlementFormData) => void | Promise<void>
  initialData?: Partial<LeaveEntitlementFormData> | null
  isSubmitting?: boolean
  employeeName?: string
}

export function LeaveEntitlementModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  employeeName,
}: LeaveEntitlementModalProps) {
  const [formData, setFormData] = React.useState<LeaveEntitlementFormData>({
    base_days: 12,
    seniority_days: 0,
    bonus_days: 0,
  })

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        base_days: initialData?.base_days ?? 12,
        seniority_days: initialData?.seniority_days ?? 0,
        bonus_days: initialData?.bonus_days ?? 0,
      })
    }
  }, [isOpen, initialData])

  const handleChange = (field: keyof LeaveEntitlementFormData, value: string) => {
    const numVal = value === '' ? 0 : parseFloat(value)
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(numVal) ? 0 : numVal,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Điều Chỉnh Quỹ Phép Năm</DialogTitle>
          <DialogDescription>
            {employeeName
              ? `Điều chỉnh quota ngày phép cho nhân viên ${employeeName}.`
              : 'Điều chỉnh quota ngày phép năm cho nhân viên.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="base_days">Phép Gốc Quy Định</Label>
            <Input
              id="base_days"
              type="number"
              min={0}
              step={0.5}
              value={formData.base_days}
              onChange={(e) => handleChange('base_days', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniority_days">Phép Thâm Niên</Label>
            <Input
              id="seniority_days"
              type="number"
              min={0}
              step={0.5}
              value={formData.seniority_days}
              onChange={(e) => handleChange('seniority_days', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonus_days">Phép Thưởng Cộng Thêm</Label>
            <Input
              id="bonus_days"
              type="number"
              min={0}
              step={0.5}
              value={formData.bonus_days}
              onChange={(e) => handleChange('bonus_days', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-2 flex justify-between items-center text-sm font-medium text-muted-foreground border-t">
            <span>Tổng cộng:</span>
            <span className="text-base font-bold text-foreground">
              {formData.base_days + formData.seniority_days + formData.bonus_days} ngày
            </span>
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
