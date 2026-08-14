import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { documentService } from '@/services/document.service'
import { ShieldCheck, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react'

export function DocumentIntegrityVerifier() {
  const [snapshotInput, setSnapshotInput] = useState(
    JSON.stringify(
      {
        template_code: 'LPVN-HR-F-0013',
        employee_code: 'LPVN-0001',
        full_name: 'Trần Văn An',
        status: 'APPROVED',
        approver_id: 'manager-001',
      },
      null,
      2
    )
  )
  const [expectedHash, setExpectedHash] = useState('')
  const [calculatedHash, setCalculatedHash] = useState('')
  const [matchStatus, setMatchStatus] = useState<'IDLE' | 'MATCH' | 'MISMATCH'>('IDLE')

  const handleVerify = async () => {
    try {
      const parsed = JSON.parse(snapshotInput)
      const hash = await documentService.computeSHA256(parsed)
      setCalculatedHash(hash)

      if (expectedHash.trim()) {
        if (hash.toLowerCase() === expectedHash.trim().toLowerCase()) {
          setMatchStatus('MATCH')
        } else {
          setMatchStatus('MISMATCH')
        }
      } else {
        setMatchStatus('IDLE')
      }
    } catch {
      setCalculatedHash('Lỗi phân tích cú pháp JSON!')
      setMatchStatus('MISMATCH')
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-bold">
            Kiểm Thẩm Tra Mã Băm Toàn Vẹn SHA-256 (Anti-Tamper Verifier)
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Đối chiếu dữ liệu văn bản với mã băm mật mã để xác thực tính bất biến không bị chỉnh sửa
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 text-xs">
        <div className="space-y-1">
          <Label htmlFor="ver_snapshot">Dữ Liệu Snapshot Văn Bản (JSON)</Label>
          <Textarea
            id="ver_snapshot"
            value={snapshotInput}
            onChange={(e) => setSnapshotInput(e.target.value)}
            className="font-mono text-[11px] min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ver_hash">Mã Hash Kỳ Vọng (Tùy chọn)</Label>
          <Input
            id="ver_hash"
            placeholder="Dán mã SHA-256 lưu trong cơ sở dữ liệu để đối chiếu..."
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            className="font-mono text-xs h-8"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button size="sm" onClick={handleVerify} className="gap-1.5 text-xs h-8 bg-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Tính Mã Băm & Thẩm Tra
          </Button>

          {matchStatus === 'MATCH' && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 text-[11px] gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mã Băm Trùng Khớp 100% (Hợp Lệ)
            </Badge>
          )}

          {matchStatus === 'MISMATCH' && (
            <Badge variant="destructive" className="text-[11px] gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Mã Băm Không Khớp / Bị Sửa Đổi!
            </Badge>
          )}
        </div>

        {calculatedHash && (
          <div className="p-3 rounded bg-muted/40 border space-y-1 font-mono text-[11px]">
            <div className="text-muted-foreground font-semibold">Mã Hash Tính Toán Được:</div>
            <div className="text-primary break-all">{calculatedHash}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
