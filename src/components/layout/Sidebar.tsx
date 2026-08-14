import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileCheck,
  FilePlus2,
  FileText,
  GitMerge,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth, type AppUserRole } from '@/contexts/AuthContext'

interface NavItemDef {
  label: string
  href: string
  icon: typeof LayoutDashboard
  roles: AppUserRole[]
  badge?: number | string
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  // Dashboard for Supervisor and Admin
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['SUPERVISOR', 'ADMIN'] },

  // Core actions for all
  { label: 'Tạo đơn mới', href: '/new-request', icon: FilePlus2, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Đơn của tôi', href: '/my-requests', icon: ClipboardList, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Duyệt đơn', href: '/approvals', icon: CheckSquare, roles: ['TEAM_LEADER', 'SUPERVISOR', 'ADMIN'], badge: 3 },
  { label: 'Thư viện chữ ký', href: '/signatures', icon: FileCheck, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },

  // Supervisor & Admin reporting
  { label: 'Báo cáo nghỉ phép', href: '/reports', icon: BarChart3, roles: ['SUPERVISOR', 'ADMIN'] },

  // Admin exclusive management
  { label: 'Nhân sự & Tạo User', href: '/employees', icon: Users, roles: ['ADMIN'] },
  { label: 'Quản lý Phép năm', href: '/leave', icon: CalendarDays, roles: ['ADMIN'] },
  { label: 'Biểu Mẫu ISO', href: '/documents', icon: FileText, roles: ['ADMIN'] },
  { label: 'Pipeline Tự Động', href: '/pipeline', icon: GitMerge, roles: ['ADMIN'] },
  { label: 'An Ninh & RLS', href: '/settings/security', icon: ShieldCheck, roles: ['ADMIN'] },
  { label: 'Entra ID & Email', href: '/settings/entra-id', icon: KeyRound, roles: ['ADMIN'] },
  { label: 'Outlook Actionable', href: '/settings/outlook-advanced', icon: Zap, roles: ['ADMIN'] },
]

export function Sidebar() {
  const { currentRole, activeUser, switchDemoUser } = useAuth()
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  const visibleItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(currentRole))

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(-2)
      .join('')
      .toUpperCase()
  }

  const roleTitleMap: Record<AppUserRole, string> = {
    EMPLOYEE: 'Nhân Viên',
    TEAM_LEADER: 'Trưởng Nhóm',
    SUPERVISOR: 'Giám Sát',
    ADMIN: 'Quản Trị Viên',
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#1E8C86]/20 bg-gradient-to-b from-[#1E8C86] to-[#2BA8A2] text-white shadow-md">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-white/15 px-4">
        <img
          src="/images/leggett-logo.jpg"
          alt="Leggett & Platt Logo"
          className="h-8 w-auto max-w-[105px] object-contain rounded-sm bg-white p-0.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-tight text-white tracking-wide">LPVN</span>
          <span className="text-[10px] text-white/75">Supply Chain · Nhà máy</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]'
                  : 'text-white/85 hover:bg-white/10 hover:text-white',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-white" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-[#EF6C4A] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Role Switcher & User Profile Footer */}
      <div className="p-3 border-t border-white/15 bg-black/15 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-white/70">
          <span>Chuyển vai trò thử nghiệm:</span>
        </div>
        <select
          value={
            currentRole === 'EMPLOYEE'
              ? 'emp1'
              : currentRole === 'TEAM_LEADER'
                ? 'tl1'
                : currentRole === 'SUPERVISOR'
                  ? 'sup1'
                  : 'admin'
          }
          onChange={(e) => switchDemoUser(e.target.value)}
          className="w-full text-[11px] h-7 px-2 rounded-md bg-white/15 text-white font-medium border border-white/20 focus:outline-none"
        >
          <option value="emp1" className="text-black">Nhân viên (Nguyễn Văn A)</option>
          <option value="tl1" className="text-black">Team Leader (Lê Văn C)</option>
          <option value="sup1" className="text-black">Supervisor (Trần Thị B)</option>
          <option value="admin" className="text-black">Admin (Aaron Zhang)</option>
        </select>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="h-9 w-9 rounded-full bg-[#FFD23F] text-[#3A2B00] font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {getInitials(activeUser.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">{activeUser.name}</span>
            <span className="text-[10px] text-[#FFE47A] font-semibold truncate">
              {roleTitleMap[currentRole]} · {activeUser.dept}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
