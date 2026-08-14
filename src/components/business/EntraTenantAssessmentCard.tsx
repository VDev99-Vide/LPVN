import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  entraIdService,
  type EntraTenantConfig,
} from '@/services/entra-id.service'
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'

export interface EntraTenantAssessmentCardProps {
  initialConfig?: Partial<EntraTenantConfig>
}

export function EntraTenantAssessmentCard({
  initialConfig = {
    tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    clientId: '9f8e7d6c-5b4a-3f2e-1d0c-ba9876543210',
    scopes: ['openid', 'profile', 'email', 'User.Read'],
    domain: 'leggett.com',
    adminConsentGranted: true,
  },
}: EntraTenantAssessmentCardProps) {
  const [config] = useState(initialConfig)
  const [assessment, setAssessment] = useState(() =>
    entraIdService.assessTenantCapability(config)
  )
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setAssessment(entraIdService.assessTenantCapability(config))
      setIsRefreshing(false)
    }, 400)
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">
              Đánh Giá Khả Năng Tenant (Capability Assessment)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Kiểm tra trạng thái cấu hình Microsoft Entra ID (Azure AD) và khả năng sẵn sàng cho SSO
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={`text-xs px-2.5 py-1 ${
              assessment.isReady
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
            }`}
          >
            Điểm Sẵn Sàng: {assessment.score}%
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-8"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Kiểm Tra Lại
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="divide-y rounded-md border text-xs">
          {assessment.checks.map((check, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-card">
              <div className="flex items-center gap-2.5">
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-foreground">{check.name}</div>
                  <div className="text-[11px] text-muted-foreground">{check.details}</div>
                </div>
              </div>

              <Badge variant={check.passed ? 'outline' : 'destructive'} className="text-[10px]">
                {check.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
