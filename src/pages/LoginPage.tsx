import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { SSOLoginButton } from '@/components/business/SSOLoginButton'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { error } = await signIn(email.trim())
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Đã xảy ra lỗi khi đăng nhập.' })
      } else {
        setMessage({ type: 'success', text: 'Đã gửi liên kết đăng nhập đến email của bạn.' })
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
        <CardHeader className="text-center pb-2 pt-6">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2BA8A2] to-[#1E8C86] flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              HR
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1E8C86] dark:text-[#3CC4BD]">
              HR Flow
            </span>
          </div>
          <CardTitle role="heading" aria-level={2} className="text-base font-bold text-foreground">
            Đăng nhập LPVN HR Flow
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Hệ thống đăng ký &amp; duyệt đơn nội bộ · Leggett &amp; Platt Vietnam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          {/* Microsoft 365 SSO Primary Option */}
          <div className="space-y-2">
            <SSOLoginButton />
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-2 text-[11px] text-muted-foreground uppercase font-medium absolute">
              Hoặc đăng nhập dự phòng
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email công ty (Magic Link)</Label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@leggett.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="w-full text-xs h-10 font-bold rounded-full btn-gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Mã Đăng Nhập Cục Bộ'}
            </Button>
          </form>

          {/* Hint Box matching Template.html */}
          <div className="rounded-xl p-3 bg-[#E8F6F5] dark:bg-muted/40 text-[11px] text-[#1E8C86] dark:text-teal-300 leading-relaxed border border-[#3CC4BD]/30">
            📌 Hệ thống kết nối <strong>Microsoft Entra ID</strong> (Azure AD SSO) và <strong>Supabase RLS</strong> đồng bộ phân quyền tự động theo phòng ban.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
