import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Image as ImageIcon } from 'lucide-react'

export interface SignatureUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: { signatureUrl: string; title: string }) => Promise<void>
}

export function SignatureUploadModal({
  isOpen,
  onClose,
  onUpload,
}: SignatureUploadModalProps) {
  const [title, setTitle] = useState('Chữ ký ảnh số')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!previewUrl) return
    setIsUploading(true)
    try {
      await onUpload({
        signatureUrl: previewUrl,
        title,
      })
      onClose()
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải Lên Hình Ảnh Chữ Ký</DialogTitle>
          <DialogDescription>
            Định dạng khuyên dùng: file PNG nền trong suốt hoặc ảnh chụp nét ký rõ nét.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="sig_title">Tên nhận diện chữ ký</Label>
            <Input
              id="sig_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chữ ký chính thức..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tệp hình ảnh chữ ký *</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2"
            >
              {previewUrl ? (
                <div className="p-2 bg-white rounded border shadow-inner max-h-36 max-w-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview chữ ký"
                    className="max-h-32 object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    Bấm để chọn file ảnh từ máy tính
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Hỗ trợ PNG, JPG, WebP (Tối đa 5MB)
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isUploading || !previewUrl}>
              <ImageIcon className="h-3.5 w-3.5 mr-1" />
              {isUploading ? 'Đang lưu...' : 'Lưu Chữ Ký'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
