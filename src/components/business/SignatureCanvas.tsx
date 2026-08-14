import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Trash2, Check, PenTool } from 'lucide-react'

export interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string) => void
  onCancel?: () => void
}

export function SignatureCanvas({ onSave, onCancel }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [penColor, setPenColor] = useState('#1e3a8a') // Official deep navy blue
  const [strokeWidth, setStrokeWidth] = useState(2.5)
  const historyRef = useRef<ImageData[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions with high-DPI scaling
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Save initial blank state
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
  }, [])

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setHasDrawn(true)
    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.strokeStyle = penColor
    ctx.lineWidth = strokeWidth
    ctx.moveTo(x, y)
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Save state to history
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
    setHasDrawn(false)
  }

  const handleUndo = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (historyRef.current.length > 1) {
      historyRef.current.pop()
      const prev = historyRef.current[historyRef.current.length - 1]
      ctx.putImageData(prev, 0, 0)
      if (historyRef.current.length === 1) {
        setHasDrawn(false)
      }
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <PenTool className="h-3.5 w-3.5" /> Màu mực:
          </span>
          <button
            type="button"
            onClick={() => setPenColor('#1e3a8a')}
            className={`w-5 h-5 rounded-full bg-[#1e3a8a] border-2 transition-all ${
              penColor === '#1e3a8a' ? 'border-primary scale-110' : 'border-transparent'
            }`}
            title="Mực xanh truyền thống"
          />
          <button
            type="button"
            onClick={() => setPenColor('#09090b')}
            className={`w-5 h-5 rounded-full bg-[#09090b] border-2 transition-all ${
              penColor === '#09090b' ? 'border-primary scale-110' : 'border-transparent'
            }`}
            title="Mực đen chuẩn"
          />

          <span className="text-muted-foreground font-medium ml-2">Nét bút:</span>
          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="text-xs p-1 rounded border bg-background"
          >
            <option value={1.8}>Mảnh (1.8px)</option>
            <option value={2.5}>Vừa (2.5px)</option>
            <option value={3.5}>Đậm (3.5px)</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={!hasDrawn}
            className="h-7 text-xs gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Hoàn tác
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!hasDrawn}
            className="h-7 text-xs text-destructive gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Xóa nét
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-dashed border-primary/40 rounded-lg bg-white overflow-hidden touch-none shadow-inner">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full h-44 cursor-crosshair"
        />
        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-neutral-400 select-none">
            ✍️ Ký tên vào khung này bằng chuột hoặc màn hình cảm ứng
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} className="text-xs">
            Hủy
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          disabled={!hasDrawn}
          onClick={handleSave}
          className="gap-1 text-xs bg-primary hover:bg-primary/90"
        >
          <Check className="h-3.5 w-3.5" />
          Lưu Chữ Ký Này
        </Button>
      </div>
    </div>
  )
}
