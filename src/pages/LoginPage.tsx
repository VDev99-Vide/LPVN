import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth, DEMO_SUPPLY_CHAIN_USERS } from '@/contexts/AuthContext'
import { SSOLoginButton } from '@/components/business/SSOLoginButton'

const REMEMBER_EMAIL_KEY = 'lpvn_remember_email'
const REMEMBER_PASSWORD_KEY = 'lpvn_remember_pass'

export function LoginPage() {
  const { signIn, switchDemoUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('demo1234')
  const [selectedDemoUser, setSelectedDemoUser] = useState('admin')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
      const savedPass = localStorage.getItem(REMEMBER_PASSWORD_KEY)
      if (savedEmail) setEmail(savedEmail)
      if (savedPass) setPassword(savedPass)
    }
  }, [])

  const handleDemoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value
    setSelectedDemoUser(key)
    const demo = DEMO_SUPPLY_CHAIN_USERS[key]
    if (demo) {
      setEmail(demo.email)
      setPassword('demo1234')
      switchDemoUser(key)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    // Save credentials automatically after first login
    if (typeof window !== 'undefined') {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim())
      localStorage.setItem(REMEMBER_PASSWORD_KEY, password)
    }

    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Đã xảy ra lỗi khi đăng nhập.' })
      } else {
        setMessage({ type: 'success', text: 'Đăng nhập thành công.' })
        // If window location is /login or similar, redirect to /
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          window.location.href = '/'
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 login-gradient-bg rounded-2xl">
      <Card className="w-full max-w-[420px] shadow-2xl border-0 rounded-3xl bg-card text-foreground">
        <CardHeader className="flex flex-col items-center justify-center pb-2 pt-6 text-center">
          {/* Logo Leggett.jpg in the center */}
          <div className="mb-3">
            <img
              src="/images/leggett-logo.jpg"
              alt="Leggett & Platt Logo"
              className="h-12 w-auto object-contain rounded-md bg-white p-1 shadow-sm mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <h1 className="font-extrabold text-3xl tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
            LPVN
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hệ thống quản lý quy trình hành chính &amp; phê duyệt nội bộ
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {/* Quick Demo User Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="demoUserSelect" className="text-xs font-semibold text-muted-foreground">
                Tài khoản người dùng (Phòng Supply Chain)
              </Label>
              <select
                id="demoUserSelect"
                value={selectedDemoUser}
                onChange={handleDemoSelect}
                className="w-full text-xs h-10 px-3 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border-2 border-[#E1EEED] dark:border-border text-foreground font-medium"
              >
                <option value="emp1">Nguyễn Văn A — Nhân viên — Supply Chain</option>
                <option value="tl1">Lê Văn C — Trưởng nhóm (Team Leader) — Supply Chain</option>
                <option value="sup1">Trần Thị B — Giám sát (Supervisor) — Supply Chain</option>
                <option value="admin">Aaron Zhang — Quản trị viên (Admin)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                Tên đăng nhập / Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="nhanvien@leggett.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-xs h-10 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border-2 border-[#E1EEED] dark:border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-xs h-10 rounded-xl bg-[#FFF8E7] dark:bg-muted/40 border-2 border-[#E1EEED] dark:border-border text-foreground"
              />
            </div>

            {message && (
              <div
                role="status"
                className={`p-2.5 rounded-xl text-xs ${
                  message.type === 'error'
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-xs h-10 font-bold rounded-full btn-gold mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>
          </form>

          {/* Microsoft 365 SSO Option */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center mb-3">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-2 text-[10px] text-muted-foreground uppercase font-medium absolute">
                Hoặc đăng nhập với Microsoft 365
              </span>
            </div>
            <SSOLoginButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
