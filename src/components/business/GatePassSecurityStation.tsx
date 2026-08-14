import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from './StatusBadge'
import type { GatePassWithRelations } from '@/services/gate-pass.service'
import { Search, LogOut, LogIn, FileText, ShieldCheck } from 'lucide-react'

export interface GatePassSecurityStationProps {
  gatePasses: GatePassWithRelations[]
  onCheckOut: (pass: GatePassWithRelations, guardNotes?: string) => Promise<void>
  onCheckIn: (pass: GatePassWithRelations, guardNotes?: string) => Promise<void>
  onViewISO: (pass: GatePassWithRelations) => void
  currentGuardName?: string
}

export function GatePassSecurityStation({
  gatePasses,
  onCheckOut,
  onCheckIn,
  onViewISO,
  currentGuardName = 'Bảo Vệ Ca Trực',
}: GatePassSecurityStationProps) {
  const [search, setSearch] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const activePasses = gatePasses.filter(
    (p) => p.status === 'APPROVED' || p.status === 'IN_TRANSIT'
  )

  const filtered = activePasses.filter((p) => {
    const s = search.toLowerCase()
    return (
      p.employee?.full_name?.toLowerCase().includes(s) ||
      p.employee?.employee_code?.toLowerCase().includes(s) ||
      p.document_no?.toLowerCase().includes(s)
    )
  })

  const handleAction = async (
    pass: GatePassWithRelations,
    action: 'OUT' | 'IN'
  ) => {
    setLoadingId(pass.id)
    try {
      if (action === 'OUT') {
        await onCheckOut(pass)
      } else {
        await onCheckIn(pass)
      }
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Security Station Banner */}
      <Card className="border-primary/30 bg-primary/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-base font-bold">
                  Trạm Kiểm Soát Cổng Bảo Vệ (Security Station)
                </CardTitle>
                <CardDescription className="text-xs">
                  Nhân viên trực ca: <span className="font-semibold text-foreground">{currentGuardName}</span>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-primary">
                {activePasses.length}
              </div>
              <div className="text-[11px] text-muted-foreground">Đơn đang hiệu lực</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nhập mã NV hoặc quét tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid Cards of Active Passes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg bg-card text-muted-foreground">
            Không có giấy ra cổng nào đang chờ kiểm soát.
          </div>
        ) : (
          filtered.map((p) => (
            <Card key={p.id} className="relative overflow-hidden border shadow-sm flex flex-col justify-between">
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-base text-foreground">
                      {p.employee?.full_name || '—'}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground font-semibold">
                      {p.employee?.employee_code || '—'}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="text-xs space-y-1 bg-muted/40 p-2.5 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Khung giờ:</span>
                    <span className="font-mono font-bold text-foreground">
                      {p.from_time} - {p.to_time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lý do:</span>
                    <span className="font-medium text-foreground">
                      {p.reason_type === 'BUSINESS' ? 'Công tác' : 'Việc riêng'}
                    </span>
                  </div>
                  {p.accompanied_items && (
                    <div className="pt-1 border-t border-border/50 text-[11px]">
                      <span className="text-muted-foreground">Tài sản: </span>
                      <span className="font-medium text-foreground">{p.accompanied_items}</span>
                    </div>
                  )}
                </div>

                {p.security_out_time && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Đã ra cổng: {new Date(p.security_out_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>

              <div className="p-3 border-t bg-muted/20 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewISO(p)}
                  className="gap-1 text-xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Soát Đơn
                </Button>

                {p.status === 'APPROVED' && (
                  <Button
                    size="sm"
                    disabled={loadingId === p.id}
                    onClick={() => handleAction(p, 'OUT')}
                    className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-xs"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Xác Nhận Ra
                  </Button>
                )}

                {p.status === 'IN_TRANSIT' && (
                  <Button
                    size="sm"
                    disabled={loadingId === p.id}
                    onClick={() => handleAction(p, 'IN')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Xác Nhận Vào
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
