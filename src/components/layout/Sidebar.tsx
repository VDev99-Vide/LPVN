import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  DoorOpen,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Leave', href: '/leave', icon: CalendarDays },
  { label: 'Gate Pass', href: '/gate-pass', icon: DoorOpen },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Nhân sự & Tổ chức', href: '/employees', icon: Users },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
          L
        </div>
        <span className="font-semibold">LPVN HR</span>
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
