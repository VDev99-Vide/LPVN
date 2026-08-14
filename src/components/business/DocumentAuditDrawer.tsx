import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { documentService, type GeneratedDocumentWithRelations } from '@/services/document.service'
import { ShieldCheck, Copy, Check, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react'

export interface DocumentAuditDrawerProps {
  isOpen: boolean
  onClose: () => void
  document: GeneratedDocumentWithRelations | null
}

export function DocumentAuditDrawer({
  isOpen,
  onClose,
  document,
}: DocumentAuditDrawerProps) {
  const [copied, setCopied] = useState(false)
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; message: string } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  if (!document) return null

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.document_hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const res = await documentService.verifyDocumentIntegrity(
        document.id,
        document.document_hash
      )
      setVerifyResult(res)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <DialogTitle>Kiểm Định Dấu Vết Mật Mã ISO</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Hồ sơ kiểm toán tính toàn vẹn (Immutability Audit Snapshot) của tài liệu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border">
            <div>
              <span className="text-muted-foreground">Mã Biểu Mẫu:</span>{' '}
              <span className="font-mono font-bold text-foreground">{document.document_no}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Loại Thực Thể:</span>{' '}
              <Badge variant="outline" className="text-[10px] ml-1">
                {document.source_entity_type}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Thời Điểm Xuất Bản:</span>{' '}
              <span className="font-mono text-foreground font-medium">
                {new Date(document.created_at).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Người Xuất Bản:</span>{' '}
              <span className="font-semibold text-foreground">
                {document.generator?.full_name || 'Hệ thống'}
              </span>
            </div>
          </div>

          {/* SHA-256 Checksum Box */}
          <div className="space-y-1.5 p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Mã Băm Toàn Vẹn SHA-256
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyHash}
                className="h-6 text-[11px] gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </Button>
            </div>
            <div className="p-2 rounded bg-muted font-mono text-[11px] break-all border text-muted-foreground">
              {document.document_hash}
            </div>
          </div>

          {/* Verify Action */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleVerify}
              disabled={isVerifying}
              className="gap-2 text-xs"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              {isVerifying ? 'Đang thẩm định...' : 'Kiểm Tra Tính Toàn Vẹn Tài Liệu'}
            </Button>

            {verifyResult && (
              <div
                className={`p-3 rounded-md flex items-start gap-2 text-xs ${
                  verifyResult.isValid
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-destructive/10 text-destructive border border-destructive/30'
                }`}
              >
                {verifyResult.isValid ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                )}
                <span>{verifyResult.message}</span>
              </div>
            )}
          </div>

          {/* Snapshot JSON Viewer */}
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <FileCode className="h-4 w-4" />
              Dữ liệu Snapshot Đóng Băng (Rendered Payload)
            </div>
            <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-md overflow-x-auto text-[11px] font-mono max-h-48">
              {JSON.stringify(document.rendered_data_snapshot, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
