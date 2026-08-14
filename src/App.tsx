import { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { LeaveManagementPage } from './pages/LeaveManagementPage'
import { GatePassPage } from './pages/GatePassPage'
import { AttendancePage } from './pages/AttendancePage'
import { ApprovalsHubPage } from './pages/ApprovalsHubPage'
import { SignatureSettingsPage } from './pages/SignatureSettingsPage'
import { DocumentCenterPage } from './pages/DocumentCenterPage'
import { ReportsPage } from './pages/ReportsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { OutlookActionPage } from './pages/OutlookActionPage'
import { EntraSettingsPage } from './pages/EntraSettingsPage'
import { OutlookAdvancedConfigPage } from './pages/OutlookAdvancedConfigPage'

function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <AuthProvider>
      <AppShell>
        {currentPath === '/employees' ? (
          <EmployeesPage />
        ) : currentPath === '/leave' ? (
          <LeaveManagementPage />
        ) : currentPath === '/gate-pass' ? (
          <GatePassPage />
        ) : currentPath === '/attendance' ? (
          <AttendancePage />
        ) : currentPath === '/approvals' ? (
          <ApprovalsHubPage />
        ) : currentPath === '/signatures' ? (
          <SignatureSettingsPage />
        ) : currentPath === '/documents' ? (
          <DocumentCenterPage />
        ) : currentPath === '/reports' ? (
          <ReportsPage />
        ) : currentPath === '/notifications' ? (
          <NotificationsPage />
        ) : currentPath === '/quick-approve' ? (
          <OutlookActionPage />
        ) : currentPath === '/settings/entra-id' ? (
          <EntraSettingsPage />
        ) : currentPath === '/settings/outlook-advanced' ? (
          <OutlookAdvancedConfigPage />
        ) : (
          <DashboardPage />
        )}
      </AppShell>
    </AuthProvider>
  )
}

export default App
