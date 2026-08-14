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
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border">
        <CardHeader className="text-center pb-3">
          <CardTitle role="heading" aria-level={2} className="text-2xl font-bold">
            Đăng nhập LPVN HR Flow
          </CardTitle>
          <CardDescription className="text-xs">
            Hệ thống quản lý quy trình hành chính & nhân sự Leggett & Platt Vietnam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Microsoft 365 SSO Primary Option */}
          <div className="space-y-2">
            <SSOLoginButton />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-2 text-[11px] text-muted-foreground uppercase font-medium absolute">
              Hoặc đăng nhập dự phòng
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email công ty (Magic Link)</Label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@leggett.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="text-xs h-9"
              />
            </div>
            {message && (
              <div
                role="status"
                className={`p-2.5 rounded-md text-xs ${
                  message.type === 'error'
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {message.text}
              </div>
            )}
            <Button type="submit" variant="secondary" className="w-full text-xs h-9" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi Mã Đăng Nhập Cục Bộ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
