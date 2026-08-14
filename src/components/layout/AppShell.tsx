import { type ReactNode } from 'react'
import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  Clock,
  FileCheck,
  FilePlus2,
  FileText,
  GitMerge,
  Glasses,
  LayoutDashboard,
  Receipt,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  TestTube2,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { useAuth, type AppUserRole } from '@/contexts/AuthContext'
import { NotificationBell } from '@/components/business/NotificationBell'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NavDockItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  roles: AppUserRole[]
  badge?: number
}

const ALL_DOCK_ITEMS: NavDockItem[] = [
  { label: 'Dashboard', href: '/', icon: Glasses, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Tạo đơn mới', href: '/new-request', icon: FilePlus2, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Đơn của tôi', href: '/my-requests', icon: ClipboardList, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Duyệt đơn', href: '/approvals', icon: CheckSquare, roles: ['TEAM_LEADER', 'SUPERVISOR', 'ADMIN'], badge: 3 },
  { label: 'Quản lý phép', href: '/leave', icon: Wallet, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Chấm công', href: '/attendance', icon: Clock, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Ra cổng (Gate Pass)', href: '/gate-pass', icon: ShieldCheck, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Thư viện chữ ký', href: '/signatures', icon: FileCheck, roles: ['EMPLOYEE', 'TEAM_LEADER', 'SUPERVISOR', 'ADMIN'] },
  { label: 'Biểu mẫu ISO', href: '/documents', icon: FileText, roles: ['ADMIN'] },
  { label: 'Pipeline tự động', href: '/pipeline', icon: GitMerge, roles: ['ADMIN'] },
  { label: 'Báo cáo & Phân tích', href: '/reports', icon: BarChart3, roles: ['SUPERVISOR', 'ADMIN'] },
  { label: 'Nhân sự & Tổ chức', href: '/employees', icon: Users, roles: ['ADMIN'] },
  { label: 'An ninh & RLS', href: '/settings/security', icon: Settings, roles: ['ADMIN'] },
  { label: 'Kiểm thử & QA', href: '/qa', icon: TestTube2, roles: ['ADMIN'] },
  { label: 'Triển khai Go-Live', href: '/settings/deployment', icon: Rocket, roles: ['ADMIN'] },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { currentRole, activeUser, switchDemoUser } = useAuth()
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  const visibleDockItems = ALL_DOCK_ITEMS.filter((item) => item.roles.includes(currentRole))

  const navigateTo = (href: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = href
    }
  }

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

  const sampleNotifications = [
    {
      id: 'notif-1',
      recipient_id: activeUser.id || 'admin',
      event_type: 'REQUEST_ASSIGNED' as const,
      title: 'Yêu cầu phê duyệt Đơn nghỉ phép',
      message: 'Trần Văn An gửi đơn xin nghỉ phép 2 ngày chờ bạn phê duyệt.',
      action_url: '/approvals',
      is_read: false,
      read_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      recipient_id: activeUser.id || 'admin',
      event_type: 'DOCUMENT_GENERATED' as const,
      title: 'Đã xuất bản Biểu mẫu ISO',
      message: 'Biểu mẫu LPVN-HR-F-0014 đã được đóng dấu chữ ký và lưu trữ hash SHA-256.',
      action_url: '/documents',
      is_read: false,
      read_at: null,
      metadata: {},
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  return (
    <div className="vision-spatial-root">
      
      {/* Top Global Header Bar (Leggett Transparent Logo + Search + Role Switcher + Notifs + Profile) */}
      <header className="w-full max-w-[1360px] flex items-center justify-between py-2.5 px-3 mb-3 z-20 flex-wrap gap-3">
        
        {/* Left: Transparent Leggett Logo & LPVN Hub Badge */}
        <div className="flex items-center gap-3">
          <a href="/" className="h-9 flex items-center gap-2 group">
            <img
              src="/leggett-transparent.png"
              alt="Leggett & Platt Logo"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] brightness-110 group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = '/images/leggett-transparent.png'
              }}
            />
          </a>
          <div className="flex flex-col border-l border-white/20 pl-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">LPVN Flow</span>
              <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/25 text-emerald-300 border border-emerald-400/35 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                visionOS
              </span>
            </div>
            <span className="text-[10px] text-white/65">Supply Chain Hub · Leggett &amp; Platt</span>
          </div>
        </div>

        {/* Center: Frosted Glass Search Input */}
        <div className="relative flex-1 max-w-xs min-w-[200px] hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-white/50" />
          <Input
            type="search"
            placeholder="Tìm kiếm nhanh đơn từ, nhân sự..."
            className="pl-8.5 pr-3 h-8 text-xs bg-black/35 border-white/15 text-white placeholder:text-white/45 rounded-full backdrop-blur-md focus-visible:ring-white/30"
          />
        </div>

        {/* Right Controls: Role Switcher, Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          
          {/* Demo Role Switcher Pill */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl border border-white/15 px-3 py-1 rounded-full shadow-lg">
            <span className="text-[11px] text-white/70 font-medium hidden sm:inline">Vai trò:</span>
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
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="emp1" className="text-black bg-white">Nhân viên (Nguyễn Văn A)</option>
              <option value="tl1" className="text-black bg-white">Team Leader (Lê Văn C)</option>
              <option value="sup1" className="text-black bg-white">Supervisor (Trần Thị B)</option>
              <option value="admin" className="text-black bg-white">Admin (Aaron Zhang)</option>
            </select>
          </div>

          {/* In-App Notification Bell */}
          <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-full p-0.5">
            <NotificationBell
              notifications={sampleNotifications}
              unreadCount={2}
              onMarkAllRead={() => {}}
            />
          </div>

          {/* User Profile Glass Avatar */}
          <a
            href="/signatures"
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 hover:border-white/30 transition-all cursor-pointer"
            title={`${activeUser.name} · ${roleTitleMap[currentRole]}`}
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-neutral-900 font-extrabold flex items-center justify-center text-[11px] shadow-sm">
              {getInitials(activeUser.name)}
            </div>
            <div className="flex flex-col text-left hidden sm:flex max-w-[110px]">
              <span className="text-xs font-bold text-white truncate leading-tight">{activeUser.name}</span>
              <span className="text-[9px] text-white/60 truncate leading-tight">{roleTitleMap[currentRole]}</span>
            </div>
          </a>
        </div>
      </header>

      {/* Spatial Workspace Shell */}
      <div className="spatial-workspace">
        
        {/* Floating Left App Dock */}
        <aside className="floating-left-dock" aria-label="Global Vision Pro Navigation Dock">
          {visibleDockItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <button
                key={item.href}
                onClick={() => navigateTo(item.href)}
                className={cn('dock-icon-btn relative', isActive && 'active')}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-coral-dark text-white text-[9px] font-extrabold px-1 rounded-full shadow-[0_0_8px_rgba(239,108,74,0.8)]">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Main VisionOS Glass Container */}
        <main className="vision-container">
          {children}

          {/* Bottom Floating Navigation Dock */}
          <nav className="bottom-nav-dock" aria-label="Bottom Navigation">
            <button
              onClick={() => navigateTo('/')}
              className={cn('nav-tab-btn', currentPath === '/' && 'active')}
            >
              <Glasses className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => navigateTo('/new-request')}
              className={cn('nav-tab-btn', currentPath === '/new-request' && 'active')}
            >
              <FilePlus2 className="w-4 h-4" /> Tạo đơn
            </button>
            <button
              onClick={() => navigateTo('/leave')}
              className={cn('nav-tab-btn', currentPath === '/leave' && 'active')}
            >
              <Receipt className="w-4 h-4" /> Quản lý phép
            </button>
            <button
              onClick={() => navigateTo('/attendance')}
              className={cn('nav-tab-btn', currentPath === '/attendance' && 'active')}
            >
              <Clock className="w-4 h-4" /> Chấm công
            </button>
            <button
              onClick={() => navigateTo('/approvals')}
              className={cn('nav-tab-btn', currentPath === '/approvals' && 'active')}
            >
              <UserCheck className="w-4 h-4" /> Duyệt đơn
            </button>
            <button
              onClick={() => navigateTo('/reports')}
              className={cn('nav-tab-btn', currentPath === '/reports' && 'active')}
            >
              <BarChart3 className="w-4 h-4" /> Báo cáo
            </button>
            <button
              onClick={() => navigateTo('/settings/security')}
              className={cn('nav-tab-btn', currentPath.startsWith('/settings') && 'active')}
            >
              <Settings className="w-4 h-4" /> Cài đặt
            </button>
          </nav>
        </main>

      </div>

      {/* Fixed Frosted Glass Bottom Badge: By Vinh © 2026 */}
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-[11px] font-medium text-white/70 shadow-lg tracking-wider flex items-center gap-1.5 hover:text-white hover:border-white/30 transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
          <span>By Vinh © 2026</span>
        </div>
      </footer>

    </div>
  )
}
