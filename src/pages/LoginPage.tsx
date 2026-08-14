import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth, DEMO_SUPPLY_CHAIN_USERS } from '@/contexts/AuthContext'
import { SSOLoginButton } from '@/components/business/SSOLoginButton'
import { Sparkles, Shield, User, Users, ShieldCheck, ArrowRight } from 'lucide-react'

const REMEMBER_EMAIL_KEY = 'lpvn_remember_email'
const REMEMBER_PASSWORD_KEY = 'lpvn_remember_pass'

export function LoginPage() {
  const { signIn, switchDemoUser } = useAuth()
  const [email, setEmail] = useState('aaron.zhang@leggett.com')
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

  const handleSelectRole = (key: string) => {
    setSelectedDemoUser(key)
    const demo = DEMO_SUPPLY_CHAIN_USERS[key]
    if (demo) {
      setEmail(demo.email)
      setPassword('demo1234')
      switchDemoUser(key)
    }
  }

  const handleLaunchWorkspace = async () => {
    setIsSubmitting(true)
    setMessage(null)
    try {
      switchDemoUser(selectedDemoUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim())
        localStorage.setItem(REMEMBER_PASSWORD_KEY, password)
        window.location.href = '/'
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Lỗi truy cập hệ thống.',
      })
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setMessage(null)

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
        if (typeof window !== 'undefined') {
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

  const roleCards = [
    {
      key: 'emp1',
      title: 'Nhân viên (Employee)',
      name: 'Nguyễn Văn A',
      code: 'LPVN-0231',
      dept: 'Phòng Supply Chain',
      icon: User,
      badgeColor: 'text-sky-300 bg-sky-500/20 border-sky-400/30',
    },
    {
      key: 'tl1',
      title: 'Trưởng nhóm (Team Leader)',
      name: 'Lê Văn C',
      code: 'LPVN-0090',
      dept: 'Phòng Supply Chain',
      icon: Users,
      badgeColor: 'text-teal-300 bg-teal-500/20 border-teal-400/30',
    },
    {
      key: 'sup1',
      title: 'Giám sát (Supervisor)',
      name: 'Trần Thị B',
      code: 'LPVN-0187',
      dept: 'Phòng Supply Chain',
      icon: Shield,
      badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-400/30',
    },
    {
      key: 'admin',
      title: 'Quản trị viên (Admin)',
      name: 'Aaron Zhang',
      code: 'LPVN-0001',
      dept: 'Ban Quản Trị & Nhân Sự',
      icon: ShieldCheck,
      badgeColor: 'text-coral-light bg-coral-dark/30 border-coral-light/40',
    },
  ]

  return (
    <div className="vision-spatial-root min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl z-10">
        
        {/* Main Glassmorphic Login Gateway */}
        <Card className="border border-white/20 bg-[#12151e]/85 backdrop-blur-3xl shadow-[0_35px_80px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden text-white">
          <CardHeader className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
            
            {/* Bright Leggett Logo */}
            <div className="mb-3">
              <img
                src="/leggett-transparent.png"
                alt="Leggett & Platt Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.45)] brightness-150 contrast-125 mx-auto"
                onError={(e) => {
                  e.currentTarget.src = '/images/leggett-transparent.png'
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-3xl tracking-tight text-white">
                LPVN
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                visionOS
              </span>
            </div>
            
            <div className="text-sm font-semibold text-teal-300 mt-0.5 tracking-wide">
              Leggett &amp; Platt
            </div>
            <p className="text-xs text-white/60 mt-1 max-w-md">
              Hệ thống số hóa quy trình hành chính, chấm công &amp; phê duyệt biểu mẫu ISO nội bộ
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-10 pb-8">
            
            {/* 4 Interactive Demo Role Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>Chọn vai trò Demo để trải nghiệm ngay:</span>
                <span className="text-[11px] text-teal-300 font-medium">1-Click Launch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleCards.map((card) => {
                  const Icon = card.icon
                  const isSelected = selectedDemoUser === card.key
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => handleSelectRole(card.key)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 border-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)] ring-1 ring-teal-300'
                          : 'bg-black/30 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${card.badgeColor} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{card.name}</div>
                        <div className="text-[10px] text-white/60 truncate">{card.title}</div>
                        <div className="text-[9px] font-mono text-white/40">{card.code} · {card.dept}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick 1-Click Launch Button */}
            <Button
              type="button"
              onClick={handleLaunchWorkspace}
              disabled={isSubmitting}
              className="w-full h-11 text-xs font-bold rounded-2xl bg-gradient-to-r from-[#0066fe] to-[#0052cc] hover:from-[#0056d6] hover:to-[#0047b3] text-white shadow-[0_4px_20px_rgba(0,102,254,0.45)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Truy Cập Không Gian visionOS (Launch Workspace)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            {/* Optional Manual Login Section */}
            <details className="group border-t border-white/10 pt-3">
              <summary className="text-xs text-white/60 hover:text-white cursor-pointer list-none flex items-center justify-between font-medium">
                <span>Tùy chọn đăng nhập thủ công / Mật khẩu</span>
                <span className="text-[10px] text-white/40 group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <form onSubmit={handleSubmit} className="space-y-3 pt-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-semibold text-white/70">
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
                    className="text-xs h-9 rounded-xl bg-black/40 border-white/15 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-white/70">
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
                    className="text-xs h-9 rounded-xl bg-black/40 border-white/15 text-white"
                  />
                </div>

                {message && (
                  <div
                    role="status"
                    className={`p-2.5 rounded-xl text-xs ${
                      message.type === 'error'
                        ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-xs h-9 font-semibold rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập với Mật khẩu'}
                </Button>
              </form>
            </details>

            {/* Microsoft 365 SSO Option */}
            <div className="pt-1 border-t border-white/10">
              <div className="text-center mb-2.5">
                <span className="text-[10px] text-white/50 uppercase font-semibold">
                  Hoặc liên kết Microsoft Entra ID
                </span>
              </div>
              <SSOLoginButton />
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Subtle & Elegant "By Vinh © 2026" Badge on Bottom Right */}
      <footer className="fixed bottom-3 right-4 z-40 pointer-events-auto">
        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[10.5px] font-medium text-white/50 shadow-md tracking-wider flex items-center gap-1.5 hover:text-white hover:opacity-100 hover:border-white/25 transition-all duration-300 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"></span>
          <span>By Vinh © 2026</span>
        </div>
      </footer>
    </div>
  )
}
