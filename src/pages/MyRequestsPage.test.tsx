import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { MyRequestsPage } from './MyRequestsPage'
import { AuthProvider } from '@/contexts/AuthContext'

afterEach(cleanup)

function renderMyRequestsPage() {
  return render(
    <AuthProvider>
      <MyRequestsPage />
    </AuthProvider>
  )
}

describe('MyRequestsPage', () => {
  it('renders heading and requests list', () => {
    renderMyRequestsPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Đơn Của Tôi (My Requests)')
    expect(screen.getByText('LV-2026-001')).toBeInTheDocument()
    expect(screen.getByText('GP-2026-014')).toBeInTheDocument()
    expect(screen.getByText('AC-2026-009')).toBeInTheDocument()
  })

  it('opens ISO preview modal when clicking Xem & In ISO', () => {
    renderMyRequestsPage()
    const viewButtons = screen.getAllByRole('button', { name: /Xem & In ISO/i })
    fireEvent.click(viewButtons[0])

    expect(screen.getByText(/Biểu Mẫu Chuẩn ISO: LV-2026-001/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /In Bản ISO \/ PDF/i })).toBeInTheDocument()
  })
})
