import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Printer, Copy, Check, ZoomIn, ZoomOut, ShieldCheck } from 'lucide-react'

export interface DocumentExportToolbarProps {
  documentHash?: string
  onPrint?: () => void
  onZoomChange?: (zoom: number) => void
}

export function DocumentExportToolbar({
  documentHash,
  onPrint = () => window.print(),
  onZoomChange,
}: DocumentExportToolbarProps) {
  const [copied, setCopied] = useState(false)
  const [zoom, setZoom] = useState(100)

  const handleCopyHash = () => {
    if (!documentHash) return
    navigator.clipboard.writeText(documentHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoom = (delta: number) => {
    const next = Math.max(70, Math.min(150, zoom + delta))
    setZoom(next)
    onZoomChange?.(next)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border rounded-lg shadow-xs print:hidden">
      {/* Integrity Hash Info */}
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="outline" className="gap-1 border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Bảo mật SHA-256
        </Badge>
        {documentHash && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded border">
            <span className="truncate max-w-[140px] sm:max-w-[220px]">{documentHash}</span>
            <button
              type="button"
              onClick={handleCopyHash}
              className="text-primary hover:text-primary/80 transition-colors"
              title="Sao chép toàn bộ mã SHA-256"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center border rounded-md p-0.5 bg-muted/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(-10)}
            disabled={zoom <= 70}
            className="h-7 w-7 p-0"
            title="Thu nhỏ"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[11px] font-mono font-medium px-2">{zoom}%</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(10)}
            disabled={zoom >= 150}
            className="h-7 w-7 p-0"
            title="Phóng to"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Button size="sm" onClick={onPrint} className="gap-1.5 text-xs bg-primary hover:bg-primary/90">
          <Printer className="h-4 w-4" />
          In Bản Chuẩn ISO
        </Button>
      </div>
    </div>
  )
}
