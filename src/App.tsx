import { AuthProvider } from './contexts/AuthContext'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <AuthProvider>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </AuthProvider>
  )
}

export default App
