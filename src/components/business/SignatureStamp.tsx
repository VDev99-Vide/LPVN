import { CheckCircle2 } from 'lucide-react'

export interface SignatureStampProps {
  signerName?: string
  signerCode?: string
  signatureUrl?: string | null
  signedDate?: string
  title?: string
  isVerified?: boolean
}

export function SignatureStamp({
  signerName = 'Người duyệt',
  signerCode = '',
  signatureUrl,
  signedDate,
  title,
  isVerified = true,
}: SignatureStampProps) {
  const formattedDate = signedDate
    ? new Date(signedDate).toLocaleDateString('vi-VN')
    : new Date().toLocaleDateString('vi-VN')

  return (
    <div className="flex flex-col items-center justify-between min-h-[110px] p-2 text-center select-none">
      {title && <div className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">{title}</div>}

      <div className="flex-1 flex items-center justify-center my-1 relative">
        {signatureUrl ? (
          <img
            src={signatureUrl}
            alt={`Chữ ký của ${signerName}`}
            className="max-h-14 max-w-[140px] object-contain"
          />
        ) : (
          <div className="font-serif italic text-lg text-primary/80 font-bold tracking-wider">
            {signerName}
          </div>
        )}

        {isVerified && (
          <div className="absolute -top-1 -right-2 text-[8px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 px-1 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
            <span>KÝ ĐIỆN TỬ</span>
          </div>
        )}
      </div>

      <div className="space-y-0.5 border-t border-neutral-300 dark:border-neutral-700 pt-1 w-full">
        <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
          {signerName}
        </div>
        {signerCode && (
          <div className="text-[10px] font-mono text-neutral-500">{signerCode}</div>
        )}
        <div className="text-[9px] text-neutral-400">Ngày: {formattedDate}</div>
      </div>
    </div>
  )
}
