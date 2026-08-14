import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPage } from './LoginPage'
import { AuthProvider } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderLoginPage() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

describe('LoginPage - Vision Pro Spatial Demo Gateway', () => {
  it('renders heading, Leggett branding, login form, and demo role cards', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LPVN')
    expect(screen.getByText('Leggett & Platt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng Nhập Vào Hệ Thống/i })).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
    expect(screen.getByText('Lê Văn C')).toBeInTheDocument()
    expect(screen.getByText('Trần Thị B')).toBeInTheDocument()
    expect(screen.getByText('Aaron Zhang')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng nhập bằng Microsoft 365/i })).toBeInTheDocument()
  })

  it('submits login form and displays success message', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const user = userEvent.setup()
    renderLoginPage()

    const userInput = screen.getByLabelText(/Tên đăng nhập \/ Email \/ Mã Nhân Viên/i)
    const passInput = screen.getByLabelText(/Mật khẩu/i)
    const button = screen.getByRole('button', { name: /Đăng Nhập Vào Hệ Thống/i })

    await user.clear(userInput)
    await user.type(userInput, 'aaron.zhang@leggett.com')
    await user.clear(passInput)
    await user.type(passInput, 'Leggett@2026')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Đăng nhập thành công!/i)).toBeInTheDocument()
    })
  })

  it('allows 1-click filling credentials by clicking a demo role card', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    const employeeCard = screen.getByText('Nguyễn Văn A')
    await user.click(employeeCard)

    const userInput = screen.getByLabelText(/Tên đăng nhập \/ Email \/ Mã Nhân Viên/i) as HTMLInputElement
    expect(userInput.value).toBe('nguyen.vana@leggett.com')
  })
})
