import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateAttendanceInput } from '@/services/attendance.service'

export interface AttendanceFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAttendanceInput) => Promise<void>
  currentUserId?: string
  currentUserName?: string
  currentUserCode?: string
}

const REASON_PRESETS = [
  'Quên quẹt thẻ lúc vào ca (Morning Check-in missed)',
  'Quên quẹt thẻ lúc tan ca (Evening Check-out missed)',
  'Lỗi máy chấm công / Không nhận vân tay (Biometric reader failure)',
  'Đi công tác ngoài hiện trường (Field business trip)',
]

export function AttendanceFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  currentUserId = '',
  currentUserName = '',
  currentUserCode = '',
}: AttendanceFormDrawerProps) {
  const today = new Date().toISOString().split('T')[0]
  const [confirmationDate, setConfirmationDate] = useState(today)
  const [fromTime, setFromTime] = useState('08:00')
  const [toTime, setToTime] = useState('17:00')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        employee_id: currentUserId,
        confirmation_date: confirmationDate,
        from_time: fromTime,
        to_time: toTime,
        reason,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Đăng Ký Xác Nhận Ngày Công (LPVN-HR-F-0008)</DialogTitle>
          <DialogDescription>
            Đề nghị cấp quản lý và Phòng Nhân Sự xác nhận lại thời gian làm việc thực tế.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Employee Preview Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg text-xs">
            <div>
              <span className="text-muted-foreground">Nhân viên:</span>{' '}
              <span className="font-semibold text-foreground">{currentUserName || 'Tôi'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mã NV:</span>{' '}
              <span className="font-mono font-semibold text-foreground">
                {currentUserCode || 'LPVN-0001'}
              </span>
            </div>
          </div>

          {/* Date & Time Window */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="confirmation_date">Ngày cần xác nhận</Label>
              <Input
                id="confirmation_date"
                type="date"
                value={confirmationDate}
                onChange={(e) => setConfirmationDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="from_time">Từ (giờ)</Label>
              <Input
                id="from_time"
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="to_time">Đến (giờ)</Label>
              <Input
                id="to_time"
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Reason Presets */}
          <div className="space-y-1.5">
            <Label>Lý do xác nhận công *</Label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {REASON_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReason(preset)}
                  className="text-[11px] bg-secondary hover:bg-secondary/80 text-secondary-foreground px-2 py-1 rounded transition-colors"
                >
                  + {preset.split('(')[0].trim()}
                </button>
              ))}
            </div>
            <Input
              placeholder="Nhập chi tiết lý do..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Xác Nhận'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
