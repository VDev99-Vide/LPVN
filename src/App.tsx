import { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { LeaveManagementPage } from './pages/LeaveManagementPage'
import { GatePassPage } from './pages/GatePassPage'
import { AttendancePage } from './pages/AttendancePage'
import { ApprovalsHubPage } from './pages/ApprovalsHubPage'

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
        ) : (
          <DashboardPage />
        )}
      </AppShell>
    </AuthProvider>
  )
}

export default App
