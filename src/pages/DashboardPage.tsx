import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusBadge } from '@/components/business/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const KPIS = [
  { label: 'Pending approvals', value: '12' },
  { label: 'Leave used', value: '86 days' },
  { label: 'Team size', value: '248' },
  { label: 'Requests this month', value: '31' },
]

const PENDING_REQUESTS = [
  { id: 'LV-2026-001', employee: 'Nguyen Van A', type: 'Annual Leave', date: '2026-08-10', status: 'PENDING_APPROVAL' },
  { id: 'GP-2026-014', employee: 'Tran Thi B', type: 'Gate Pass', date: '2026-08-11', status: 'SUBMITTED' },
  { id: 'AC-2026-009', employee: 'Le Van C', type: 'Attendance', date: '2026-08-12', status: 'REJECTED' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">HR workflow overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">This month</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Latest requests waiting for action</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PENDING_REQUESTS.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
