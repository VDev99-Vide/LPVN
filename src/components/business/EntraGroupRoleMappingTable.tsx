import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DEFAULT_GROUP_MAPPINGS,
  type RoleMappingRule,
} from '@/services/entra-id.service'
import { Users, RotateCcw, Shield } from 'lucide-react'

export function EntraGroupRoleMappingTable() {
  const [mappings, setMappings] = useState<RoleMappingRule[]>(DEFAULT_GROUP_MAPPINGS)

  const handleReset = () => {
    setMappings(DEFAULT_GROUP_MAPPINGS)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 text-[10px]">ADMIN</Badge>
      case 'HR_MANAGER':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 text-[10px]">HR_MANAGER</Badge>
      case 'MANAGER':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 text-[10px]">MANAGER</Badge>
      case 'SECURITY':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 text-[10px]">SECURITY</Badge>
      default:
        return <Badge variant="secondary" className="text-[10px]">EMPLOYEE</Badge>
    }
  }

  return (
    <Card className="border shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">
              Ánh Xạ Nhóm Bảo Mật & Phân Quyền (Group-to-Role Mapping)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Tự động gán quyền LPVN RBAC khi nhân viên đăng nhập dựa trên Microsoft 365 Security Groups
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 text-xs h-8"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Đặt Lại Mặc Định
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-[11px]">
                <TableHead>Nhóm Bảo Mật Azure AD</TableHead>
                <TableHead>Vai Trò LPVN Flow</TableHead>
                <TableHead>Mô Tả Quyền Hạn</TableHead>
                <TableHead className="text-right">Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((m) => (
                <TableRow key={m.azureGroup} className="text-xs">
                  <TableCell className="font-mono font-semibold flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    {m.azureGroup}
                  </TableCell>
                  <TableCell>{getRoleBadge(m.lpvnRole)}</TableCell>
                  <TableCell className="text-muted-foreground">{m.description}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40">
                      Đang đồng bộ
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
