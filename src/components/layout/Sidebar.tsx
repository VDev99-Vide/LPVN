import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  DoorOpen,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Trung Tâm Duyệt', href: '/approvals', icon: CheckSquare },
  { label: 'Quản lý Phép năm', href: '/leave', icon: CalendarDays },
  { label: 'Gate Pass', href: '/gate-pass', icon: DoorOpen },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Nhân sự & Tổ chức', href: '/employees', icon: Users },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <img
          src="/images/leggett-logo.jpg"
          alt="Leggett & Platt Logo"
          className="h-8 w-auto max-w-[110px] object-contain rounded-sm bg-white p-0.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-tight text-foreground">LPVN HR</span>
          <span className="text-[10px] text-muted-foreground">Workflow SaaS</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
