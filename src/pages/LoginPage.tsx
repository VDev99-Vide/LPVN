import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle role="heading" aria-level={2} className="text-2xl font-bold">
            Đăng nhập LPVN HR Flow
          </CardTitle>
          <CardDescription>
            Nhập email công ty để nhận liên kết đăng nhập (Magic Link)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email công ty</Label>
              <Input
                id="email"
                type="email"
                placeholder="nhanvien@lpvn.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            {message && (
              <div
                role="status"
                className={`p-3 rounded-md text-sm ${
                  message.type === 'error'
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {message.text}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
