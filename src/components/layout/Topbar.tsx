import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 pl-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>LA</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">LPVN Admin</span>
        </div>
      </div>
    </header>
  )
}
