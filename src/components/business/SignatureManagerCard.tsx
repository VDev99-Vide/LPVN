import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DigitalSignatureRow } from '@/services/signature.service'
import { Star, Trash2, PenTool, Upload, ShieldCheck } from 'lucide-react'

export interface SignatureManagerCardProps {
  signatures: DigitalSignatureRow[]
  onSetDefault: (sig: DigitalSignatureRow) => Promise<void>
  onDelete: (sig: DigitalSignatureRow) => Promise<void>
  onOpenCanvas: () => void
  onOpenUpload: () => void
}

export function SignatureManagerCard({
  signatures,
  onSetDefault,
  onDelete,
  onOpenCanvas,
  onOpenUpload,
}: SignatureManagerCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Thư Viện Chữ Ký Điện Tử</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Quản lý nét ký cá nhân dùng để tự động đóng dấu khi bạn phê duyệt các biểu mẫu ISO
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onOpenUpload} className="gap-1 text-xs">
            <Upload className="h-3.5 w-3.5" />
            Tải Ảnh
          </Button>
          <Button size="sm" onClick={onOpenCanvas} className="gap-1 text-xs bg-primary">
            <PenTool className="h-3.5 w-3.5" />
            Ký Nét Mới
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {signatures.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground space-y-2">
            <PenTool className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <div className="text-sm font-medium">Bạn chưa lưu chữ ký điện tử nào</div>
            <div className="text-xs text-muted-foreground">
              Hãy bấm "Ký Nét Mới" hoặc "Tải Ảnh" để thiết lập chữ ký duyệt đơn của bạn.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                className={`relative rounded-lg border p-4 flex flex-col justify-between gap-3 transition-all ${
                  sig.is_default
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                    : 'bg-card hover:border-primary/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-foreground truncate max-w-[130px]">
                      {sig.title || 'Chữ ký cá nhân'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] py-0">
                        {sig.signature_type === 'CANVAS_DRAWN' ? 'Vẽ tay' : 'Ảnh số'}
                      </Badge>
                      {sig.is_default && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] py-0 gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Mặc định
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Signature Preview Box */}
                  <div className="h-24 bg-white rounded border flex items-center justify-center p-2 shadow-inner">
                    <img
                      src={sig.signature_url}
                      alt={sig.title || 'Chữ ký'}
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  <div className="text-[10px] text-muted-foreground">
                    Tạo ngày: {new Date(sig.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t flex items-center justify-between">
                  {!sig.is_default ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSetDefault(sig)}
                      className="text-xs h-7 gap-1"
                    >
                      <Star className="h-3 w-3" />
                      Đặt làm mặc định
                    </Button>
                  ) : (
                    <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary" /> Đang sử dụng
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(sig)}
                    className="text-xs h-7 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
