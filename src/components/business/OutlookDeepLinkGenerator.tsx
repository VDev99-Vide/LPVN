import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { outlookBasicService } from '@/services/outlook-basic.service'
import { Link2, Copy, Check, ExternalLink } from 'lucide-react'

export function OutlookDeepLinkGenerator() {
  const [taskId, setTaskId] = useState('demo-task-001')
  const [token, setToken] = useState('sec_token_' + Math.random().toString(36).substring(2, 10))
  const [copied, setCopied] = useState(false)

  const deepLink = outlookBasicService.generateSecureDeepLink(taskId, token)

  const handleCopy = () => {
    navigator.clipboard.writeText(deepLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-bold">Trình Tạo Deep Link Outlook (Testing Tool)</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Công cụ sinh liên kết phê duyệt nhanh đính kèm token bảo mật dùng trong Email Outlook
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="gen_task_id">Mã Task ID</Label>
            <Input
              id="gen_task_id"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="text-xs h-8 font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gen_token">Mã Token Bảo Mật</Label>
            <Input
              id="gen_token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-xs h-8 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5 p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-muted-foreground">URL Deep Link An Toàn:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 text-[11px] gap-1"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Đã chép' : 'Sao chép'}
            </Button>
          </div>
          <div className="p-2 rounded bg-background font-mono text-[11px] break-all border text-primary">
            {deepLink}
          </div>
        </div>

        <div className="flex justify-end">
          <a href={deepLink}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
              <ExternalLink className="h-3.5 w-3.5" />
              Mở Trang Phê Duyệt Nhanh
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
