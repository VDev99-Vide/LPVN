import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentAuditDrawer } from './DocumentAuditDrawer'
import type { GeneratedDocumentWithRelations } from '@/services/document.service'

describe('DocumentAuditDrawer', () => {
  it('renders audit drawer with document metadata and hash', () => {
    const mockDoc: GeneratedDocumentWithRelations = {
      id: 'gd-1',
      template_id: 'dt-1',
      document_no: 'LPVN-HR-F-0013',
      source_entity_type: 'LEAVE',
      source_entity_id: 'leave-1',
      rendered_data_snapshot: { full_name: 'Nguyen Van A' },
      document_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      file_url: null,
      generated_by: 'user-1',
      created_at: '2026-08-14T00:00:00Z',
      generator: {
        id: 'user-1',
        full_name: 'Admin HR',
        employee_code: 'LPVN-HR01',
      },
    }

    render(
      <DocumentAuditDrawer
        isOpen={true}
        onClose={vi.fn()}
        document={mockDoc}
      />
    )

    expect(screen.getByText(/Kiểm Định Dấu Vết Mật Mã ISO/i)).toBeInTheDocument()
    expect(screen.getByText('LPVN-HR-F-0013')).toBeInTheDocument()
    expect(screen.getByText('Admin HR')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Kiểm Tra Tính Toàn Vẹn Tài Liệu/i })).toBeInTheDocument()
  })
})
