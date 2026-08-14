import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: ReactNode }) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isDashboard = currentPath === '/'

  if (isDashboard) {
    return <div className="min-h-screen w-full">{children}</div>
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-8">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
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

