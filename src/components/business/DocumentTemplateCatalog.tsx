import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, ShieldCheck } from 'lucide-react'

export interface ISOFormTemplateItem {
  code: string
  title: string
  titleEn: string
  version: string
  description: string
  fieldsCount: number
}

const TEMPLATES: ISOFormTemplateItem[] = [
  {
    code: 'LPVN-HR-F-0013',
    title: 'Đơn Xin Nghỉ Phép',
    titleEn: 'Leave Application',
    version: '1.0',
    description: 'Biểu mẫu tiêu chuẩn đăng ký nghỉ phép năm, nghỉ ốm, việc riêng, có bảng kê khai số dư phép.',
    fieldsCount: 14,
  },
  {
    code: 'LPVN-HR-F-0014',
    title: 'Giấy Phép Ra Cổng',
    titleEn: 'Employee Gate Pass',
    version: '1.0',
    description: 'Biểu mẫu xin phép ra vào cổng công ty trong ca làm việc, kiểm soát tài sản và trạm gác bảo vệ.',
    fieldsCount: 11,
  },
  {
    code: 'LPVN-HR-F-0008',
    title: 'Phiếu Yêu Cầu Xác Nhận Ngày Công',
    titleEn: 'Attendance Confirmation Form',
    version: '1.0',
    description: 'Biểu mẫu điều chỉnh ngày công do quên quẹt thẻ, lỗi máy chấm công hoặc đi công tác ngoài.',
    fieldsCount: 10,
  },
]

export interface DocumentTemplateCatalogProps {
  onSelectTemplate: (templateCode: string) => void
}

export function DocumentTemplateCatalog({ onSelectTemplate }: DocumentTemplateCatalogProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TEMPLATES.map((tmpl) => (
        <Card key={tmpl.code} className="border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="font-mono text-[11px] font-semibold text-primary border-primary/30 bg-primary/5">
                {tmpl.code}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                Phiên bản {tmpl.version}
              </Badge>
            </div>
            <CardTitle className="text-sm font-bold pt-2">{tmpl.title}</CardTitle>
            <CardDescription className="text-xs italic">{tmpl.titleEn}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tmpl.description}
            </p>

            <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Chuẩn ISO Leggett
              </span>
              <span className="font-mono">{tmpl.fieldsCount} trường</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTemplate(tmpl.code)}
              className="w-full gap-1.5 text-xs h-8"
            >
              <Eye className="h-3.5 w-3.5" />
              Xem Biểu Mẫu Chuẩn
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
