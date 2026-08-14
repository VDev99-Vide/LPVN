import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth, DEMO_SUPPLY_CHAIN_USERS } from '@/contexts/AuthContext'
import { Shield, User, Users, ShieldCheck, ArrowRight, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'

const REMEMBER_EMAIL_KEY = 'lpvn_remember_email'
const REMEMBER_PASSWORD_KEY = 'lpvn_remember_pass'

export function LoginPage() {
  const { login, switchDemoUser } = useAuth()
  const [username, setUsername] = useState('aaron.zhang@leggett.com')
  const [password, setPassword] = useState('Leggett@2026')
  const [selectedDemoUser, setSelectedDemoUser] = useState('admin')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY)
      const savedPass = localStorage.getItem(REMEMBER_PASSWORD_KEY)
      if (savedEmail) setUsername(savedEmail)
      if (savedPass) setPassword(savedPass)
    }
  }, [])

  const handleSelectRole = (key: string) => {
    setSelectedDemoUser(key)
    const demo = DEMO_SUPPLY_CHAIN_USERS[key]
    if (demo) {
      setUsername(demo.email)
      setPassword('Leggett@2026')
      switchDemoUser(key)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    if (typeof window !== 'undefined') {
      localStorage.setItem(REMEMBER_EMAIL_KEY, username.trim())
      localStorage.setItem(REMEMBER_PASSWORD_KEY, password)
    }

    try {
      const { success, error } = await login(username.trim(), password)
      if (success) {
        setSuccessMsg('Đăng nhập thành công! Đang khởi tạo không gian làm việc...')
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        }, 500)
      } else {
        setErrorMsg(error?.message || 'Tài khoản hoặc mật khẩu không chính xác.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi kết nối cơ sở dữ liệu Supabase.')
      setIsSubmitting(false)
    }
  }

  const roleCards = [
    {
      key: 'admin',
      title: 'Quản trị viên (Admin)',
      name: 'Aaron Zhang',
      code: 'LPVN-0001',
      dept: 'Ban Quản Trị & Nhân Sự',
      icon: ShieldCheck,
      badgeColor: 'text-coral-light bg-coral-dark/30 border-coral-light/40',
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
      key: 'emp1',
      title: 'Nhân viên (Employee)',
      name: 'Nguyễn Văn A',
      code: 'LPVN-0231',
      dept: 'Phòng Supply Chain',
      icon: User,
      badgeColor: 'text-sky-300 bg-sky-500/20 border-sky-400/30',
    },
  ]

  return (
    <div className="vision-spatial-root min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl z-10">
        
        {/* Main Glassmorphic Login Gateway */}
        <Card className="border border-white/16 bg-[rgba(26,29,36,0.62)] backdrop-blur-[50px] saturate-[210%] shadow-[0_35px_80px_rgba(0,0,0,0.55),inset_0_1.5px_1.5px_rgba(255,255,255,0.25),inset_0_-1.5px_1.5px_rgba(0,0,0,0.4)] rounded-[36px] overflow-hidden text-white">
          <CardHeader className="flex flex-col items-center justify-center pt-8 pb-3 text-center">
            
            {/* Bright Leggett Logo */}
            <div className="py-2">
              <img
                src="/leggett-transparent.png"
                alt="Leggett & Platt Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.45)] brightness-150 contrast-125 mx-auto"
                onError={(e) => {
                  e.currentTarget.src = '/images/leggett-transparent.png'
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 sm:px-10 pb-8">
            
            {/* Alert Messages */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Standard Login Form: User / Pass / Login Button */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="login-username" className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-teal-300" />
                  <span>Tên đăng nhập / Email / Mã Nhân Viên</span>
                </Label>
                <div className="relative">
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="VD: aaron.zhang@leggett.com hoặc LPVN-0001"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="text-xs h-10 px-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-white/40 focus:border-white/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-teal-300" />
                  <span>Mật khẩu</span>
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="text-xs h-10 px-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-white/40 focus:border-white/30"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-xs font-bold rounded-2xl bg-gradient-to-r from-[#0066fe] to-[#0052cc] hover:from-[#0056d6] hover:to-[#0047b3] text-white shadow-[0_4px_20px_rgba(0,102,254,0.45)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang Xác Thực...' : 'Đăng Nhập Vào Hệ Thống'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            {/* Quick 1-Click Demo Accounts (Lấy từ Supabase / Demo profiles) */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
                <span>Chọn nhanh tài khoản Demo (1-Click Fill):</span>
                <span className="text-[10px] text-teal-300 font-mono">Dữ liệu Supabase</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {roleCards.map((card) => {
                  const Icon = card.icon
                  const isSelected = selectedDemoUser === card.key
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => handleSelectRole(card.key)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 border-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)] ring-1 ring-teal-300'
                          : 'bg-black/30 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-1.5 rounded-xl border ${card.badgeColor} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate">{card.name}</div>
                        <div className="text-[9.5px] text-white/60 truncate">{card.title}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
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
