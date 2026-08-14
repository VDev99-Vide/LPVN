import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DocumentTemplateCatalog } from '@/components/business/DocumentTemplateCatalog'
import { DocumentRenderer } from '@/components/business/DocumentRenderer'
import { DocumentExportToolbar } from '@/components/business/DocumentExportToolbar'
import { DocumentAuditDrawer } from '@/components/business/DocumentAuditDrawer'
import { documentService, type GeneratedDocumentWithRelations } from '@/services/document.service'
import { FileText, Eye, ShieldCheck, FileSpreadsheet, History } from 'lucide-react'

export function DocumentCenterPage() {
  const [documents, setDocuments] = useState<GeneratedDocumentWithRelations[]>([])
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocumentWithRelations | null>(null)
  const [auditDoc, setAuditDoc] = useState<GeneratedDocumentWithRelations | null>(null)
  const [previewTemplateCode, setPreviewTemplateCode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [, setIsLoading] = useState(true)

  const loadDocuments = async () => {
    setIsLoading(true)
    const { data } = await documentService.getGeneratedDocuments()
    setDocuments(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const sampleLeaveData = {
    document_no: 'LPVN-HR-F-0013',
    version: '1.0',
    full_name: 'Trần Văn Mẫu',
    employee_code: 'LPVN-0088',
    department: 'Phòng Kỹ Thuật LPVN',
    position: 'Kỹ sư cơ khí',
    leave_type: 'Nghỉ phép năm',
    from_date: '2026-08-20',
    to_date: '2026-08-21',
    total_days: 2,
    reason: 'Giải quyết việc gia đình',
    annual_leave_balance: 12,
    leave_used: 3,
    remaining_balance: 9,
    submission_date: '14/08/2026',
    approval_date: '14/08/2026',
    manager_name: 'Nguyễn Quản Lý',
    day: 14,
    month: 8,
    year: 2026,
  }

  const sampleGatePassData = {
    document_no: 'LPVN-HR-F-0014',
    version: '1.0',
    full_name: 'Lê Thị Mẫu',
    employee_code: 'LPVN-0099',
    department: 'Bộ phận Sản Xuất',
    reason_type: 'BUSINESS' as const,
    from_time: '13:30',
    to_time: '16:30',
    accompanied_items: '01 Thùng hàng mẫu kiểm định',
    day: 14,
    month: 8,
    year: 2026,
    submission_date: '14/08/2026',
    approval_date: '14/08/2026',
    manager_name: 'Nguyễn Quản Lý',
    security_out_time: '13:35',
    security_in_time: '16:20',
    security_notes: 'Đầy đủ hàng hóa',
  }

  const sampleAttendanceData = {
    document_no: 'LPVN-HR-F-0008',
    version: '1.0',
    full_name: 'Phạm Văn Mẫu',
    employee_code: 'LPVN-0077',
    department: 'Bộ phận Kho Vận',
    reason: 'Quên quẹt thẻ lúc vào ca sáng',
    confirmation_date: '2026-08-14',
    from_time: '08:00',
    to_time: '17:00',
    submission_date: '14/08/2026',
    approval_date: '14/08/2026',
    checker_name: 'Trần Giám Sát',
    manager_name: 'Nguyễn Quản Lý',
  }

  const getTemplateSampleData = (code: string) => {
    if (code.includes('0013')) return sampleLeaveData
    if (code.includes('0014')) return sampleGatePassData
    return sampleAttendanceData
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Trung Tâm Tài Liệu & Xuất Bản ISO</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý hợp đồng biểu mẫu ISO, thư viện văn bản đã phê duyệt và kiểm tra mã băm SHA-256 chống giả mạo
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="templates" className="gap-1.5 text-xs sm:text-sm">
            <FileSpreadsheet className="h-4 w-4" />
            Danh Mục Biểu Mẫu ISO
          </TabsTrigger>
          <TabsTrigger value="generated" className="gap-1.5 text-xs sm:text-sm">
            <History className="h-4 w-4" />
            Tài Liệu Đã Xuất Bản ({documents.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Template Catalog */}
        <TabsContent value="templates" className="mt-4 space-y-4">
          <DocumentTemplateCatalog onSelectTemplate={(code) => setPreviewTemplateCode(code)} />
        </TabsContent>

        {/* Tab 2: Generated Documents */}
        <TabsContent value="generated" className="mt-4 space-y-4">
          <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Biểu Mẫu</TableHead>
                  <TableHead>Loại Thực Thể</TableHead>
                  <TableHead>Mã Băm SHA-256</TableHead>
                  <TableHead>Ngày Xuất Bản</TableHead>
                  <TableHead>Người Xuất Bản</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Chưa có tài liệu nào được xuất bản snapshot.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono font-bold text-xs">
                        {doc.document_no}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {doc.source_entity_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {doc.document_hash}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {doc.generator?.full_name || 'Hệ thống'}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                          className="gap-1 h-8 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Xem Bản In
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setAuditDoc(doc)}
                          className="gap-1 h-8 text-xs"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Kiểm Định
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Modal */}
      {previewTemplateCode && (
        <Dialog open={Boolean(previewTemplateCode)} onOpenChange={() => setPreviewTemplateCode(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pr-6">
              <DialogTitle>Mẫu Biểu Chuẩn ISO ({previewTemplateCode})</DialogTitle>
            </DialogHeader>

            <DocumentExportToolbar onPrint={() => window.print()} onZoomChange={setZoom} />

            <div className="pt-2">
              <DocumentRenderer
                documentType={previewTemplateCode}
                data={getTemplateSampleData(previewTemplateCode)}
                zoomLevel={zoom}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Generated Document View Modal */}
      {selectedDoc && (
        <Dialog open={Boolean(selectedDoc)} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pr-6">
              <DialogTitle>Bản In Snapshot ISO ({selectedDoc.document_no})</DialogTitle>
            </DialogHeader>

            <DocumentExportToolbar
              documentHash={selectedDoc.document_hash}
              onPrint={() => window.print()}
              onZoomChange={setZoom}
            />

            <div className="pt-2">
              <DocumentRenderer
                documentType={selectedDoc.document_no}
                data={selectedDoc.rendered_data_snapshot}
                zoomLevel={zoom}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Audit Drawer */}
      <DocumentAuditDrawer
        isOpen={Boolean(auditDoc)}
        onClose={() => setAuditDoc(null)}
        document={auditDoc}
      />
    </div>
  )
}
