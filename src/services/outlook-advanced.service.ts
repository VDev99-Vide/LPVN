import { outlookBasicService } from './outlook-basic.service'
import { supabase } from '@/lib/supabase'

export type OutlookApprovalMode = 'BASIC_DEEP_LINK' | 'ADVANCED_ACTIONABLE'

export interface GraphApiConfig {
  tenantId: string
  clientId: string
  clientSecret?: string
  originatorId: string
  senderEmail: string
  isActionableEnabled: boolean
}

export interface ActionableCardParams {
  taskId: string
  documentType: string
  documentNo: string
  requesterName: string
  department?: string
  summaryDetails: string
  securityToken: string
  originatorId?: string
  baseUrl?: string
}

export interface InEmailActionRequest {
  taskId: string
  action: 'APPROVED' | 'REJECTED'
  token: string
  notes?: string
  actorEmail?: string
}

export const DEFAULT_GRAPH_CONFIG: GraphApiConfig = {
  tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  clientId: '9f8e7d6c-5b4a-3f2e-1d0c-ba9876543210',
  originatorId: 'lpvn-flow-prod-originator-001',
  senderEmail: 'hr-workflow@leggett.com',
  isActionableEnabled: true,
}

export const outlookAdvancedService = {
  detectOutlookCapability(config: Partial<GraphConfigLike>): OutlookApprovalMode {
    if (config.isActionableEnabled && config.originatorId && config.originatorId.length > 5) {
      return 'ADVANCED_ACTIONABLE'
    }
    return 'BASIC_DEEP_LINK'
  },

  generateAdaptiveCard(params: ActionableCardParams) {
    const baseUrl = params.baseUrl || 'https://lpvn.leggett.com'
    const actionUrl = `${baseUrl}/api/approval/action`
    const webFallbackUrl = `${baseUrl}/quick-approve?taskId=${encodeURIComponent(params.taskId)}&token=${encodeURIComponent(params.securityToken)}`

    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      originator: params.originatorId || 'lpvn-flow-prod-originator-001',
      body: [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: 'LPVN HR FLOW — YÊU CẦU PHÊ DUYỆT TRỰC TIẾP',
              weight: 'Bolder',
              size: 'Medium',
              color: 'Accent',
            },
            {
              type: 'FactSet',
              facts: [
                { title: 'Loại Biểu Mẫu:', value: `${params.documentType} (${params.documentNo})` },
                { title: 'Người Yêu Cầu:', value: params.requesterName },
                { title: 'Phòng Ban:', value: params.department || 'Nhà máy LPVN' },
                { title: 'Nội Dung Tóm Tắt:', value: params.summaryDetails },
              ],
            },
            {
              type: 'Input.Text',
              id: 'decisionComment',
              placeholder: 'Nhập ghi chú hoặc lý do phê duyệt / từ chối (tùy chọn)...',
              isMultiline: true,
            },
          ],
        },
      ],
      actions: [
        {
          type: 'Action.Http',
          title: '✅ Chấp Nhận Duyệt',
          method: 'POST',
          url: actionUrl,
          body: JSON.stringify({
            taskId: params.taskId,
            action: 'APPROVED',
            token: params.securityToken,
            notes: '{{decisionComment.value}}',
          }),
        },
        {
          type: 'Action.Http',
          title: '❌ Từ Chối',
          method: 'POST',
          url: actionUrl,
          body: JSON.stringify({
            taskId: params.taskId,
            action: 'REJECTED',
            token: params.securityToken,
            notes: '{{decisionComment.value}}',
          }),
        },
        {
          type: 'Action.OpenUrl',
          title: '🔎 Xem Chi Tiết Trên Web',
          url: webFallbackUrl,
        },
      ],
    }
  },

  generateRefreshedCard(status: 'SUCCESS' | 'ERROR', message: string, decision?: 'APPROVED' | 'REJECTED') {
    const isApproved = decision === 'APPROVED'
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: status === 'SUCCESS' ? (isApproved ? '✅ ĐÃ PHÊ DUYỆT THÀNH CÔNG' : '❌ ĐÃ TỪ CHỐI YÊU CẦU') : '⚠️ XỬ LÝ THẤT BÀI',
              weight: 'Bolder',
              size: 'Medium',
              color: status === 'SUCCESS' ? (isApproved ? 'Good' : 'Attention') : 'Attention',
            },
            {
              type: 'TextBlock',
              text: message,
              wrap: true,
              size: 'Small',
            },
          ],
        },
      ],
    }
  },

  async processInEmailAction(
    request: InEmailActionRequest
  ): Promise<{ success: boolean; refreshedCard: any; error: Error | null }> {
    try {
      // 1. Look up actor profile by email if provided, or approver_id from task
      let actorId = 'system-approver'
      if (request.actorEmail) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', request.actorEmail)
          .maybeSingle()
        const profileObj = profile as { id: string } | null
        if (profileObj) actorId = profileObj.id
      }

      // 2. Validate token and process decision
      const decisionRes = await outlookBasicService.processQuickDecision({
        taskId: request.taskId,
        token: request.token,
        decision: request.action,
        notes: request.notes,
        actorId,
      })

      if (!decisionRes.success) {
        return {
          success: false,
          refreshedCard: this.generateRefreshedCard('ERROR', decisionRes.error?.message || 'Không thể xử lý phê duyệt.', request.action),
          error: decisionRes.error,
        }
      }

      const successMsg = request.action === 'APPROVED'
        ? 'Đơn đã được phê duyệt trực tiếp từ Outlook. Chữ ký số đã được tự động đóng dấu.'
        : 'Yêu cầu đã bị từ chối thành công trực tiếp từ Outlook.'

      return {
        success: true,
        refreshedCard: this.generateRefreshedCard('SUCCESS', successMsg, request.action),
        error: null,
      }
    } catch (err) {
      return {
        success: false,
        refreshedCard: this.generateRefreshedCard('ERROR', (err as Error).message),
        error: err as Error,
      }
    }
  },
}

type GraphConfigLike = {
  isActionableEnabled?: boolean
  originatorId?: string
}
