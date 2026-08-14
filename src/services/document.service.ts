import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type DocumentTemplateRow = Database['public']['Tables']['document_templates']['Row']
export type GeneratedDocumentRow = Database['public']['Tables']['generated_documents']['Row']
export type GeneratedDocumentInsert = Database['public']['Tables']['generated_documents']['Insert']

export interface GeneratedDocumentWithRelations extends GeneratedDocumentRow {
  template?: DocumentTemplateRow | null
  generator?: {
    id: string
    full_name: string
    employee_code: string
  } | null
}

export const documentService = {
  async computeSHA256(input: string | object): Promise<string> {
    const text = typeof input === 'string' ? input : JSON.stringify(input)
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(text)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }
    // Simple deterministic fallback for mock/pure js environments
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  },

  async getDocumentTemplates(): Promise<{ data: DocumentTemplateRow[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_code', { ascending: true })

      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as DocumentTemplateRow[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getGeneratedDocuments(params?: {
    sourceEntityType?: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
    documentNo?: string
    search?: string
  }): Promise<{ data: GeneratedDocumentWithRelations[]; error: Error | null }> {
    try {
      let query = supabase
        .from('generated_documents')
        .select('*, template:document_templates(*), generator:profiles!generated_by(id, full_name, employee_code)')
        .order('created_at', { ascending: false })

      if (params?.sourceEntityType) {
        query = query.eq('source_entity_type', params.sourceEntityType)
      }
      if (params?.documentNo) {
        query = query.eq('document_no', params.documentNo)
      }

      const { data, error } = await query
      if (error) return { data: [], error: new Error(error.message) }

      let filtered = (data as unknown as GeneratedDocumentWithRelations[]) || []
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(
          (d) =>
            d.document_no.toLowerCase().includes(s) ||
            d.document_hash.toLowerCase().includes(s) ||
            d.generator?.full_name.toLowerCase().includes(s)
        )
      }

      return { data: filtered, error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async generateDocumentSnapshot(params: {
    templateCode: string
    sourceEntityType: 'LEAVE' | 'GATE_PASS' | 'ATTENDANCE_CONFIRMATION'
    sourceEntityId: string
    renderedData: Record<string, any>
    generatedBy?: string
  }): Promise<{ data: GeneratedDocumentRow | null; error: Error | null }> {
    try {
      // 1. Get template ID
      const { data: tmpl } = await supabase
        .from('document_templates')
        .select('id')
        .eq('template_code', params.templateCode)
        .maybeSingle()

      // 2. Compute SHA-256 checksum
      const docHash = await this.computeSHA256(params.renderedData)

      const payload: GeneratedDocumentInsert = {
        template_id: (tmpl as any)?.id || null,
        document_no: params.templateCode,
        source_entity_type: params.sourceEntityType,
        source_entity_id: params.sourceEntityId,
        rendered_data_snapshot: params.renderedData,
        document_hash: docHash,
        generated_by: params.generatedBy || null,
      }

      const { data, error } = await (supabase.from('generated_documents') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: data as GeneratedDocumentRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async verifyDocumentIntegrity(
    documentId: string,
    presentedHash: string
  ): Promise<{ isValid: boolean; message: string }> {
    try {
      const { data: doc, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error || !doc) {
        return { isValid: false, message: 'Không tìm thấy tài liệu gốc trên hệ thống.' }
      }

      const computed = await this.computeSHA256((doc as any).rendered_data_snapshot)
      const isValid = computed.toLowerCase() === presentedHash.toLowerCase()

      return {
        isValid,
        message: isValid
          ? 'Tài liệu toàn vẹn, hợp lệ và khớp 100% với bản lưu trữ gốc của LPVN.'
          : 'Cảnh báo: Dữ liệu tài liệu đã bị can thiệp hoặc mã hash không khớp!',
      }
    } catch (err) {
      return { isValid: false, message: (err as Error).message }
    }
  },
}
