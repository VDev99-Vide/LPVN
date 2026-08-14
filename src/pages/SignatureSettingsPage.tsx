import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SignatureManagerCard } from '@/components/business/SignatureManagerCard'
import { SignatureCanvas } from '@/components/business/SignatureCanvas'
import { SignatureUploadModal } from '@/components/business/SignatureUploadModal'
import { SignatureStamp } from '@/components/business/SignatureStamp'
import { signatureService, type DigitalSignatureRow } from '@/services/signature.service'
import { useAuth } from '@/hooks/useAuth'
import { FileCheck, Sparkles } from 'lucide-react'

export function SignatureSettingsPage() {
  const { user } = useAuth()
  const [signatures, setSignatures] = useState<DigitalSignatureRow[]>([])
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [, setIsLoading] = useState(true)

  const loadSignatures = async () => {
    if (!user?.id) return
    setIsLoading(true)
    const { data } = await signatureService.getSignatures(user.id)
    setSignatures(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadSignatures()
  }, [user?.id])

  const handleSaveCanvas = async (signatureDataUrl: string) => {
    if (!user?.id) return
    await signatureService.saveSignature({
      userId: user.id,
      signatureUrl: signatureDataUrl,
      title: 'Chữ ký vẽ tay',
      signatureType: 'CANVAS_DRAWN',
      isDefault: signatures.length === 0,
    })
    setIsCanvasOpen(false)
    loadSignatures()
  }

  const handleUploadImage = async (data: { signatureUrl: string; title: string }) => {
    if (!user?.id) return
    await signatureService.saveSignature({
      userId: user.id,
      signatureUrl: data.signatureUrl,
      title: data.title,
      signatureType: 'ELECTRONIC_IMAGE',
      isDefault: signatures.length === 0,
    })
    loadSignatures()
  }

  const handleSetDefault = async (sig: DigitalSignatureRow) => {
    if (!user?.id) return
    await signatureService.setDefaultSignature(sig.id, user.id)
    loadSignatures()
  }

  const handleDelete = async (sig: DigitalSignatureRow) => {
    if (!user?.id) return
    await signatureService.deleteSignature(sig.id, user.id)
    loadSignatures()
  }

  const defaultSig = signatures.find((s) => s.is_default) || signatures[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileCheck className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Cài Đặt Chữ Ký Điện Tử</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý mẫu chữ ký tay & hình ảnh số cá nhân để tự động đóng dấu khi phê duyệt các quy trình ISO LPVN
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Signature List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <SignatureManagerCard
            signatures={signatures}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
            onOpenCanvas={() => setIsCanvasOpen(true)}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        </div>

        {/* Live ISO Stamp Preview (1 Col) */}
        <div className="space-y-4">
          <Card className="border shadow-sm bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Mô Phỏng Con Dấu ISO</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Hình ảnh hiển thị khi xuất bản biểu mẫu LPVN-HR-F-0013 / 0014 / 0008
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              <div className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded p-3 w-56 shadow-xs">
                <SignatureStamp
                  signerName={user?.user_metadata?.full_name || 'Nguyen Van Manager'}
                  signerCode={user?.user_metadata?.employee_code || 'LPVN-M001'}
                  signatureUrl={defaultSig?.signature_url}
                  title="TRƯỞNG BỘ PHẬN DUYỆT"
                  isVerified={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Canvas Drawing Modal */}
      <Dialog open={isCanvasOpen} onOpenChange={setIsCanvasOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ký Chữ Ký Điện Tử Trực Tiếp</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <SignatureCanvas
              onSave={handleSaveCanvas}
              onCancel={() => setIsCanvasOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Modal */}
      <SignatureUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadImage}
      />
    </div>
  )
}
