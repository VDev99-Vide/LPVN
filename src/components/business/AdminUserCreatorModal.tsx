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
import { UserPlus, Mail, CheckCircle2, Sparkles } from 'lucide-react'

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
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-6 bg-[#12151e]/95 backdrop-blur-3xl border border-white/20 text-white shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-teal-300">
            <UserPlus className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold text-white">
              Thêm Nhân Viên &amp; Tạo Tài Khoản Trực Tiếp
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-white/60">
            Quản trị viên tạo trực tiếp tài khoản đăng nhập, mật khẩu và cấu hình email thông báo phê duyệt.
          </DialogDescription>
        </DialogHeader>

        {successMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Mã Nhân Viên</Label>
              <Input
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Họ và Tên</Label>
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
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Tài Khoản / Email Đăng Nhập</Label>
              <Input
                type="email"
                placeholder="hoang.vane@leggett.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Mật Khẩu Khởi Tạo</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Phòng Ban</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-2xl bg-black/40 border border-white/15 text-white font-medium focus:outline-none"
              >
                <option value="Phòng Supply Chain" className="bg-[#141722] text-white">Phòng Supply Chain (Ưu tiên áp dụng)</option>
                <option value="Ban Giám Đốc" className="bg-[#141722] text-white">Ban Giám Đốc</option>
                <option value="Phòng Nhân Sự" className="bg-[#141722] text-white">Phòng Nhân Sự</option>
                <option value="Khối Sản Xuất" className="bg-[#141722] text-white">Khối Sản Xuất</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Chức Vụ</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Cấp Bậc &amp; Phân Quyền (Role)</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-xs h-9 px-3 rounded-2xl bg-black/40 border border-white/15 text-white font-bold focus:outline-none"
              >
                <option value="EMPLOYEE" className="bg-[#141722] text-white">Nhân Viên (EMPLOYEE)</option>
                <option value="TEAM_LEADER" className="bg-[#141722] text-white">Trưởng Nhóm (TEAM_LEADER)</option>
                <option value="SUPERVISOR" className="bg-[#141722] text-white">Giám Sát (SUPERVISOR)</option>
                <option value="ADMIN" className="bg-[#141722] text-white">Quản Trị Viên (ADMIN)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white/80">Tiêu Chuẩn Phép Năm</Label>
              <Input
                type="number"
                value={leaveEntitlement}
                onChange={(e) => setLeaveEntitlement(Number(e.target.value))}
                min={0}
                max={30}
                required
                className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
              />
            </div>
          </div>

          {/* External Notification Email Requirement for Approvers */}
          <div className="space-y-1 p-3 rounded-2xl bg-teal-500/10 border border-teal-400/25">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Nhận Thông Báo Ngoài Ứng Dụng (Outlook / Gmail)</span>
              {isApproverRole && <span className="text-coral-light font-extrabold">*</span>}
            </div>
            <Input
              type="email"
              placeholder="VD: manager.supplychain@outlook.com hoặc gmail.com"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              required={isApproverRole}
              className="text-xs h-9 rounded-2xl bg-black/40 border-white/15 text-white"
            />
            <p className="text-[10px] text-white/60">
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
              className="text-xs h-9 rounded-2xl px-4 bg-white/10 hover:bg-white/20 text-white border-white/15 cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 rounded-2xl px-6 font-bold bg-[#0066fe] hover:bg-[#0056d6] text-white shadow-[0_2px_10px_rgba(0,102,254,0.4)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản Người Dùng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
