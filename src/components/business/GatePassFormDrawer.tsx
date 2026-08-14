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
import type { CreateGatePassInput } from '@/services/gate-pass.service'

export interface GatePassFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateGatePassInput) => Promise<void>
  currentUserId?: string
  currentUserName?: string
  currentUserCode?: string
}

export function GatePassFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  currentUserId = '',
  currentUserName = '',
  currentUserCode = '',
}: GatePassFormDrawerProps) {
  const today = new Date().toISOString().split('T')[0]
  const [reasonType, setReasonType] = useState<'BUSINESS' | 'PERSONAL_OR_RESIGNED'>('BUSINESS')
  const [reasonDetails, setReasonDetails] = useState('')
  const [passDate, setPassDate] = useState(today)
  const [fromTime, setFromTime] = useState('13:30')
  const [toTime, setToTime] = useState('16:30')
  const [accompaniedItems, setAccompaniedItems] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        employee_id: currentUserId,
        reason_type: reasonType,
        reason_details: reasonDetails,
        pass_date: passDate,
        from_time: fromTime,
        to_time: toTime,
        accompanied_items: accompaniedItems,
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
          <DialogTitle>Đăng Ký Giấy Phép Ra Cổng (LPVN-HR-F-0014)</DialogTitle>
          <DialogDescription>
            Điền thông tin khung giờ và lý do ra cổng công ty trong ca làm việc.
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

          {/* Reason Type */}
          <div className="space-y-2">
            <Label>Loại lý do ra cổng *</Label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-xs font-medium transition-colors ${
                  reasonType === 'BUSINESS'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="reason_type"
                  checked={reasonType === 'BUSINESS'}
                  onChange={() => setReasonType('BUSINESS')}
                  className="accent-primary"
                />
                <div>
                  <div>Công tác (Business)</div>
                  <div className="text-[10px] opacity-75">Đi gặp khách hàng / sự kiện</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-xs font-medium transition-colors ${
                  reasonType === 'PERSONAL_OR_RESIGNED'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="reason_type"
                  checked={reasonType === 'PERSONAL_OR_RESIGNED'}
                  onChange={() => setReasonType('PERSONAL_OR_RESIGNED')}
                  className="accent-primary"
                />
                <div>
                  <div>Việc riêng / Về sớm</div>
                  <div className="text-[10px] opacity-75">Personal / Resigned</div>
                </div>
              </label>
            </div>
          </div>

          {/* Detailed Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason_details">Chi tiết lý do / Địa điểm công tác</Label>
            <Input
              id="reason_details"
              placeholder="VD: Gặp khách hàng đối tác tại KCN VSIP 1..."
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
            />
          </div>

          {/* Date & Time Window */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pass_date">Ngày ra cổng</Label>
              <Input
                id="pass_date"
                type="date"
                value={passDate}
                onChange={(e) => setPassDate(e.target.value)}
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

          {/* Accompanied Items */}
          <div className="space-y-1.5">
            <Label htmlFor="accompanied_items">
              Tài liệu, vật dụng hoặc tài sản công ty mang theo (nếu có)
            </Label>
            <Input
              id="accompanied_items"
              placeholder="VD: 01 Laptop Dell XPS, 01 Cặp hồ sơ hợp đồng..."
              value={accompaniedItems}
              onChange={(e) => setAccompaniedItems(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi Trình Duyệt'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
