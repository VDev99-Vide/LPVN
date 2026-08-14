import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  DoorOpen,
  FileCheck,
  FileText,
  GitMerge,
  KeyRound,
  LayoutDashboard,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Trung Tâm Duyệt', href: '/approvals', icon: CheckSquare },
  { label: 'Thông Báo', href: '/notifications', icon: Bell },
  { label: 'Quản lý Phép năm', href: '/leave', icon: CalendarDays },
  { label: 'Gate Pass', href: '/gate-pass', icon: DoorOpen },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Chữ Ký Số', href: '/signatures', icon: FileCheck },
  { label: 'Biểu Mẫu ISO', href: '/documents', icon: FileText },
  { label: 'Pipeline ISO', href: '/pipeline', icon: GitMerge },
  { label: 'Nhân sự & Tổ chức', href: '/employees', icon: Users },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Entra ID SSO', href: '/settings/entra-id', icon: KeyRound },
  { label: 'Outlook Actionable', href: '/settings/outlook-advanced', icon: Zap },
]

export function Sidebar() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#1E8C86]/20 bg-gradient-to-b from-[#1E8C86] to-[#2BA8A2] text-white shadow-md">
      <div className="flex h-16 items-center gap-3 border-b border-white/15 px-4">
        <img
          src="/images/leggett-logo.jpg"
          alt="Leggett & Platt Logo"
          className="h-8 w-auto max-w-[110px] object-contain rounded-sm bg-white p-0.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-tight text-white tracking-wide">HR Flow</span>
          <span className="text-[10px] text-white/75">Leggett &amp; Platt · Vietnam</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition-all duration-150',
                isActive
                  ? 'bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]'
                  : 'hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-white" />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>

      {/* Footer User Chip */}
      <div className="p-3 border-t border-white/15 bg-black/10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-[#FFD23F] text-[#3A2B00] font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            LP
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">LPVN Admin</span>
            <span className="text-[10px] text-white/75 truncate">Quản trị HR · Nhà máy</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
