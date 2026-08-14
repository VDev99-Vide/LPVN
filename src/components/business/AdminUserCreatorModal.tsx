import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UserPlus, Mail, CheckCircle2 } from 'lucide-react'

export interface CreatedUserData {
  employeeCode: string
  fullName: string
  username: string
  password?: string
  notificationEmail: string
  department: string
  position: string
  role: 'EMPLOYEE' | 'TEAM_LEADER' | 'SUPERVISOR' | 'ADMIN'
  leaveEntitlement: number
}

interface AdminUserCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: (user: CreatedUserData) => void
}

export function AdminUserCreatorModal({
  isOpen,
  onClose,
  onUserCreated,
}: AdminUserCreatorModalProps) {
  const [employeeCode, setEmployeeCode] = useState('LPVN-0450')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('Leggett@2026')
  const [notificationEmail, setNotificationEmail] = useState('')
  const [department, setDepartment] = useState('Phòng Supply Chain')
  const [position, setPosition] = useState('Nhân viên Cung ứng & Kho')
  const [role, setRole] = useState<'EMPLOYEE' | 'TEAM_LEADER' | 'SUPERVISOR' | 'ADMIN'>('EMPLOYEE')
  const [leaveEntitlement, setLeaveEntitlement] = useState(12)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isApproverRole = role !== 'EMPLOYEE'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !username.trim()) return

    setIsSubmitting(true)
    const newUser: CreatedUserData = {
      employeeCode,
      fullName,
      username,
      password,
      notificationEmail: notificationEmail || `${username.split('@')[0]}@leggett.com`,
      department,
      position,
      role,
      leaveEntitlement,
    }

    setTimeout(() => {
      onUserCreated(newUser)
      setIsSubmitting(false)
      setSuccessMsg(`Tạo tài khoản thành công cho nhân viên ${fullName} (${employeeCode})!`)
      setTimeout(() => {
        setSuccessMsg(null)
        onClose()
      }, 1200)
    }, 600)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#1E8C86] dark:text-[#3CC4BD]">
            <UserPlus className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              Thêm Nhân Viên &amp; Tạo Tài Khoản Trực Tiếp
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Quản trị viên tạo trực tiếp tài khoản đăng nhập, mật khẩu và cấu hình email thông báo phê duyệt.
          </DialogDescription>
        </DialogHeader>

        {successMsg && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Mã Nhân Viên</Label>
              <Input
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Họ và Tên</Label>
              <Input
                placeholder="VD: Hoàng Văn E"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (!username) {
                    const clean = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '.')
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                    setUsername(`${clean}@leggett.com`)
                  }
                }}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Tài Khoản / Email Đăng Nhập</Label>
              <Input
                type="email"
                placeholder="hoang.vane@leggett.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Mật Khẩu Khởi Tạo</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Phòng Ban</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED] dark:border-border text-foreground font-medium"
              >
                <option value="Phòng Supply Chain">Phòng Supply Chain (Ưu tiên áp dụng)</option>
                <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                <option value="Phòng Nhân Sự">Phòng Nhân Sự</option>
                <option value="Khối Sản Xuất">Khối Sản Xuất</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Chức Vụ</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Cấp Bậc &amp; Phân Quyền (Role)</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-xs h-9 px-3 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED] dark:border-border text-foreground font-bold"
              >
                <option value="EMPLOYEE">Nhân Viên (EMPLOYEE)</option>
                <option value="TEAM_LEADER">Trưởng Nhóm (TEAM_LEADER)</option>
                <option value="SUPERVISOR">Giám Sát (SUPERVISOR)</option>
                <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Tiêu Chuẩn Phép Năm</Label>
              <Input
                type="number"
                value={leaveEntitlement}
                onChange={(e) => setLeaveEntitlement(Number(e.target.value))}
                min={0}
                max={30}
                required
                className="text-xs h-9 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border border-[#E1EEED]"
              />
            </div>
          </div>

          {/* External Notification Email Requirement for Approvers */}
          <div className="space-y-1 p-3 rounded-xl bg-[#E8F6F5] dark:bg-muted/30 border border-[#3CC4BD]/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E8C86] dark:text-teal-300">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Nhận Thông Báo Ngoài Ứng Dụng (Outlook / Gmail)</span>
              {isApproverRole && <span className="text-destructive font-extrabold">*</span>}
            </div>
            <Input
              type="email"
              placeholder="VD: manager.supplychain@outlook.com hoặc gmail.com"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              required={isApproverRole}
              className="text-xs h-9 rounded-xl bg-white dark:bg-card border border-[#E1EEED]"
            />
            <p className="text-[10px] text-muted-foreground">
              {isApproverRole
                ? '⚠️ Bắt buộc đối với cấp duyệt (Team Leader / Supervisor / Admin) để nhận email thông báo duyệt đơn ra cổng & nghỉ phép tức thì.'
                : 'Tùy chọn: Nhận thông báo tiến độ xử lý đơn qua email cá nhân.'}
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 rounded-full px-4"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 rounded-full px-6 font-bold btn-gold"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản Người Dùng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
