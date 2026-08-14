import { useState } from 'react'
import { OutlookCapabilitySwitcher } from '@/components/business/OutlookCapabilitySwitcher'
import { AdaptiveCardPreview } from '@/components/business/AdaptiveCardPreview'
import { GraphApiConfigModal } from '@/components/business/GraphApiConfigModal'
import { Button } from '@/components/ui/button'
import {
  DEFAULT_GRAPH_CONFIG,
  type GraphApiConfig,
  type OutlookApprovalMode,
} from '@/services/outlook-advanced.service'
import { Zap, Settings } from 'lucide-react'

export function OutlookAdvancedConfigPage() {
  const [currentMode, setCurrentMode] = useState<OutlookApprovalMode>('ADVANCED_ACTIONABLE')
  const [graphConfig, setGraphConfig] = useState<GraphApiConfig>(DEFAULT_GRAPH_CONFIG)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Outlook Actionable Messages (In-Email Approval)
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Cơ chế phê duyệt 1-click trực tiếp trong Microsoft Outlook, giả lập Adaptive Cards và quản lý thông số Graph API
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsConfigModalOpen(true)}
          className="gap-1.5 text-xs h-9 bg-primary"
        >
          <Settings className="h-4 w-4" />
          Cấu Hình Graph API & Originator
        </Button>
      </div>

      {/* Capability Switcher */}
      <OutlookCapabilitySwitcher
        currentMode={currentMode}
        onToggleMode={setCurrentMode}
      />

      {/* Adaptive Card Simulator */}
      <AdaptiveCardPreview
        cardParams={{
          originatorId: graphConfig.originatorId,
        }}
      />

      {/* Graph API Config Modal */}
      <GraphApiConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={setGraphConfig}
      />
    </div>
  )
}
