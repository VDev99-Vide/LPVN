import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { entraIdService } from '@/services/entra-id.service'
import { Loader2 } from 'lucide-react'

export interface SSOLoginButtonProps {
  onSSOLogin?: () => Promise<void>
  redirectPath?: string
  className?: string
}

export function SSOLoginButton({
  onSSOLogin,
  redirectPath = '/',
  className = '',
}: SSOLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (onSSOLogin) {
        await onSSOLogin()
      } else {
        const ssoUrl = entraIdService.buildSSOAuthUrl({}, redirectPath)
        window.location.href = ssoUrl
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full h-11 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-semibold text-xs gap-3 shadow-xs transition-all ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 21 21">
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
      )}
      <span>Đăng nhập bằng Microsoft 365 (Entra ID)</span>
    </Button>
  )
}
