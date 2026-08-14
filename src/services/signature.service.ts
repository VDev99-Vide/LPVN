import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

export type DigitalSignatureRow = Database['public']['Tables']['digital_signatures']['Row']
export type DigitalSignatureInsert = Database['public']['Tables']['digital_signatures']['Insert']
export type SignatureAuditLogRow = Database['public']['Tables']['signature_audit_logs']['Row']

export const signatureService = {
  async getSignatures(userId: string): Promise<{ data: DigitalSignatureRow[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('digital_signatures')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) return { data: [], error: new Error(error.message) }
      return { data: (data as unknown as DigitalSignatureRow[]) || [], error: null }
    } catch (err) {
      return { data: [], error: err as Error }
    }
  },

  async getDefaultSignature(userId: string): Promise<{ data: DigitalSignatureRow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('digital_signatures')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('is_default', true)
        .maybeSingle()

      if (error) return { data: null, error: new Error(error.message) }
      return { data: (data as unknown as DigitalSignatureRow) || null, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async saveSignature(params: {
    userId: string
    signatureUrl: string
    title?: string
    signatureType?: 'ELECTRONIC_IMAGE' | 'CANVAS_DRAWN' | 'DIGITAL_CERTIFICATE'
    isDefault?: boolean
    metadata?: Record<string, any>
  }): Promise<{ data: DigitalSignatureRow | null; error: Error | null }> {
    try {
      // If setting as default, clear other defaults first
      if (params.isDefault !== false) {
        await (supabase.from('digital_signatures') as any)
          .update({ is_default: false })
          .eq('user_id', params.userId)
      }

      const payload: DigitalSignatureInsert = {
        user_id: params.userId,
        signature_url: params.signatureUrl,
        title: params.title || 'Chữ ký điện tử',
        signature_type: params.signatureType || 'CANVAS_DRAWN',
        is_default: params.isDefault !== false,
        is_active: true,
        metadata: params.metadata || {},
      }

      const { data, error } = await (supabase.from('digital_signatures') as any)
        .insert(payload)
        .select()
        .single()

      if (error) return { data: null, error: new Error(error.message) }

      // Write audit log
      await (supabase.from('signature_audit_logs') as any).insert({
        signature_id: data.id,
        action: 'CREATED',
        performed_by: params.userId,
      })

      return { data: data as DigitalSignatureRow, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  },

  async setDefaultSignature(id: string, userId: string): Promise<{ error: Error | null }> {
    try {
      await (supabase.from('digital_signatures') as any)
        .update({ is_default: false })
        .eq('user_id', userId)

      const { error } = await (supabase.from('digital_signatures') as any)
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', userId)

      if (error) return { error: new Error(error.message) }

      await (supabase.from('signature_audit_logs') as any).insert({
        signature_id: id,
        action: 'SET_DEFAULT',
        performed_by: userId,
      })

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async deleteSignature(id: string, userId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('digital_signatures') as any)
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', userId)

      if (error) return { error: new Error(error.message) }

      await (supabase.from('signature_audit_logs') as any).insert({
        signature_id: id,
        action: 'DELETED',
        performed_by: userId,
      })

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },

  async logStampEvent(
    signatureId: string,
    documentId: string,
    documentType: string,
    performedBy: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await (supabase.from('signature_audit_logs') as any).insert({
        signature_id: signatureId,
        action: 'STAMPED_ON_DOCUMENT',
        document_id: documentId,
        document_type: documentType,
        performed_by: performedBy,
      })

      if (error) return { error: new Error(error.message) }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  },
}
