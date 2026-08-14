import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DEFAULT_GRAPH_CONFIG,
  type GraphApiConfig,
} from '@/services/outlook-advanced.service'
import { Settings, Save, Check } from 'lucide-react'

export interface GraphApiConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (config: GraphApiConfig) => void
}

export function GraphApiConfigModal({
  isOpen,
  onClose,
  onSave,
}: GraphApiConfigModalProps) {
  const [config, setConfig] = useState<GraphApiConfig>(DEFAULT_GRAPH_CONFIG)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave?.(config)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <DialogTitle>Cấu Hình Microsoft Graph & Originator ID</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Thiết lập thông số kỹ thuật để kết nối Actionable Messages với Microsoft 365 Tenant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-1">
            <Label htmlFor="cfg_tenant_id">Tenant ID</Label>
            <Input
              id="cfg_tenant_id"
              value={config.tenantId}
              onChange={(e) => setConfig({ ...config, tenantId: e.target.value })}
              className="text-xs h-8 font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cfg_client_id">Client App ID</Label>
            <Input
              id="cfg_client_id"
              value={config.clientId}
              onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
              className="text-xs h-8 font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cfg_originator_id">Actionable Email Originator ID</Label>
            <Input
              id="cfg_originator_id"
              value={config.originatorId}
              onChange={(e) => setConfig({ ...config, originatorId: e.target.value })}
              className="text-xs h-8 font-mono"
            />
            <p className="text-[10px] text-muted-foreground pt-0.5">
              Đăng ký tại Microsoft Actionable Email Developer Dashboard
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="cfg_sender_email">Email Người Gửi Hệ Thống</Label>
            <Input
              id="cfg_sender_email"
              value={config.senderEmail}
              onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
              className="text-xs h-8 font-mono"
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
            Đóng
          </Button>
          <Button size="sm" onClick={handleSave} className="text-xs h-8 gap-1.5 bg-primary">
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? 'Đã Lưu Cấu Hình' : 'Lưu Thay Đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
