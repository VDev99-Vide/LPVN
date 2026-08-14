import { useState, type ReactNode } from 'react'
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
  LogOut,
  Rocket,
  Settings,
  ShieldCheck,
  TestTube2,
  Users,
  Wallet,
  ChevronDown,
  Check,
  User,
  Shield,
} from 'lucide-react'
import { useAuth, type AppUserRole } from '@/contexts/AuthContext'
import { NotificationBell } from '@/components/business/NotificationBell'
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
  const { currentRole, activeUser, switchDemoUser, logout } = useAuth()
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  const visibleDockItems = ALL_DOCK_ITEMS.filter((item) => item.roles.includes(currentRole))

  const navigateTo = (href: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const roleTitleMap: Record<AppUserRole, string> = {
    ADMIN: 'Admin',
    SUPERVISOR: 'Supervisor',
    TEAM_LEADER: 'Team Leader',
    EMPLOYEE: 'Nhân viên',
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase()
  }

  const sampleNotifications = [
    {
      id: 'notif-1',
      recipient_id: activeUser.id,
      event_type: 'REQUEST_SUBMITTED' as const,
      title: 'Đơn nghỉ phép mới cần duyệt',
      message: 'Nguyễn Văn A (LPVN-0231) vừa gửi đơn xin nghỉ phép 1 ngày (10/08/2026).',
      action_url: '/approvals',
      read_at: null,
      metadata: {},
      is_read: false,
      created_at: '2026-08-14T08:00:00Z',
    },
    {
      id: 'notif-2',
      recipient_id: activeUser.id,
      event_type: 'REQUEST_APPROVED' as const,
      title: 'Giấy phép ra cổng đã duyệt',
      message: 'Trưởng nhóm Lê Văn C đã phê duyệt giấy phép ra cổng công tác số GP-2026-014.',
      action_url: '/gate-pass',
      read_at: null,
      metadata: {},
      is_read: false,
      created_at: '2026-08-14T07:30:00Z',
    },
  ]

  const roleOptions = [
    { key: 'admin', label: 'Admin (Aaron Zhang)', desc: 'Tổng Quản Trị Hệ Thống', role: 'ADMIN' as AppUserRole, icon: ShieldCheck },
    { key: 'sup1', label: 'Supervisor (Trần Thị B)', desc: 'Giám sát Chuỗi Cung Ứng', role: 'SUPERVISOR' as AppUserRole, icon: Shield },
    { key: 'tl1', label: 'Team Leader (Lê Văn C)', desc: 'Trưởng nhóm Cung ứng & Kho', role: 'TEAM_LEADER' as AppUserRole, icon: Users },
    { key: 'emp1', label: 'Nhân viên (Nguyễn Văn A)', desc: 'Nhân viên Điều độ Cung ứng', role: 'EMPLOYEE' as AppUserRole, icon: User },
  ]

  return (
    <div className="vision-spatial-root">
      
      {/* Top Right Controls Glass Panel */}
      <header className="w-full max-w-[1360px] mx-auto flex items-center justify-end px-2 py-1.5 mb-2 z-30" role="banner">
        
        {/* Right Controls: Role Switcher, Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          
          {/* Custom VisionOS Glass Role Switcher Dropdown (No native white background) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/15 hover:border-white/30 px-3 py-1 rounded-full shadow-lg text-white text-xs font-semibold cursor-pointer transition-all"
            >
              <span className="text-[11px] text-white/60 font-medium hidden sm:inline">Vai trò:</span>
              <span className="text-teal-300 font-bold">{roleTitleMap[currentRole]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRoleDropdownOpen(false)} 
                />
                
                {/* Frosted Glass Dropdown Menu */}
                <div className="absolute top-full mt-2 right-0 w-64 p-2 rounded-2xl bg-[#12151e]/95 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in space-y-1 text-white">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    Chuyển đổi vai trò Demo
                  </div>
                  {roleOptions.map((item) => {
                    const isCurrent = currentRole === item.role
                    const Icon = item.icon
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          switchDemoUser(item.key)
                          setIsRoleDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30 font-bold shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-lg ${isCurrent ? 'bg-teal-400/20 text-teal-300' : 'bg-white/5 text-white/60'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white">{item.label}</div>
                            <div className="text-[10px] text-white/50">{item.desc}</div>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-teal-300 shrink-0 ml-1" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
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
          <button
            onClick={() => navigateTo('/signatures')}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 hover:border-white/30 transition-all cursor-pointer text-left"
            title={`${activeUser.name} · ${roleTitleMap[currentRole]}`}
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-neutral-900 font-extrabold flex items-center justify-center text-[11px] shadow-sm">
              {getInitials(activeUser.name)}
            </div>
            <div className="flex flex-col text-left hidden sm:flex max-w-[110px]">
              <span className="text-xs font-bold text-white truncate leading-tight">{activeUser.name}</span>
              <span className="text-[9px] text-white/60 truncate leading-tight">{roleTitleMap[currentRole]}</span>
            </div>
          </button>

          {/* Quick Logout to Demo Gateway */}
          <button
            onClick={logout}
            className="p-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 hover:border-red-400/40 text-white/60 hover:text-red-400 transition-all cursor-pointer"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Spatial Workspace Shell */}
      <div className="spatial-workspace">
        
        {/* Floating Left App Dock (Icons Only with Animated Hover Tooltip Appearing on LEFT side) */}
        <aside className="floating-left-dock" aria-label="Global Vision Pro Navigation Dock">
          {visibleDockItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <div key={item.href} className="relative group flex items-center justify-center">
                
                {/* Animated VisionOS Hover Tooltip appearing on the LEFT side (Never blocks main container) */}
                <div className="absolute right-full mr-3 px-3 py-1.5 rounded-2xl bg-[#141722]/95 backdrop-blur-2xl border border-white/20 text-white text-xs font-semibold whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.7)] opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out z-50">
                  {item.label}
                  {/* Subtle right arrow pointer */}
                  <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#141722] border-t border-r border-white/20 rotate-45"></span>
                </div>

                <button
                  onClick={() => navigateTo(item.href)}
                  className={cn(
                    'dock-icon-btn relative hover:scale-110 active:scale-95 transition-all duration-200',
                    isActive && 'active'
                  )}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  
                  {/* Active glowing indicator pill */}
                  {isActive && (
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral-dark text-white text-[9px] font-extrabold flex items-center justify-center border border-white/30 shadow-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </aside>

        {/* Main Content Area */}
        <main className="spatial-main-content">
          <div className="vision-container pb-16">
            {children}
          </div>
        </main>
      </div>

      {/* Fixed Bottom-Right Pinned Logo & Badge */}
      <footer className="fixed bottom-3 right-4 z-40 flex items-center gap-2.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-white/30 transition-all">
          <img
            src="/Logo.jpg"
            alt="Leggett & Platt Logo"
            className="h-6 w-auto object-contain rounded"
            onError={(e) => {
              e.currentTarget.src = '/Leggett.jpg'
            }}
          />
        </div>
        <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[10.5px] font-medium text-white/60 shadow-md tracking-wider flex items-center gap-1.5 hover:text-white hover:opacity-100 hover:border-white/25 transition-all duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
          <span>By Vinh © 2026</span>
        </div>
      </footer>
    </div>
  )
}
