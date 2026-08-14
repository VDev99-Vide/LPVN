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
  it('renders heading, Leggett branding, demo role cards, and SSO button', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('LPVN')
    expect(screen.getByText('Leggett & Platt')).toBeInTheDocument()
    expect(screen.getByText(/Truy Cập Không Gian visionOS/i)).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
    expect(screen.getByText('Lê Văn C')).toBeInTheDocument()
    expect(screen.getByText('Trần Thị B')).toBeInTheDocument()
    expect(screen.getByText('Aaron Zhang')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng nhập bằng Microsoft 365/i })).toBeInTheDocument()
  })

  it('submits manual login form and displays success message', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const signInSpy = vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    })

    const user = userEvent.setup()
    renderLoginPage()

    const input = screen.getByPlaceholderText('nhanvien@leggett.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    const button = screen.getByRole('button', { name: /Đăng nhập với Mật khẩu/i })

    await user.clear(input)
    await user.type(input, 'nhanvien@leggett.com')
    await user.clear(passInput)
    await user.type(passInput, 'demo1234')
    await user.click(button)

    expect(signInSpy).toHaveBeenCalledWith({ email: 'nhanvien@leggett.com' })

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Đăng nhập thành công.')
    })
  })

  it('displays error message when signIn fails', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const user = userEvent.setup()
    renderLoginPage()

    vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
      data: { user: null, session: null },
      error: { name: 'AuthError', message: 'Invalid email provider', status: 400, code: 'invalid_provider' } as any,
    })

    const input = screen.getByPlaceholderText('nhanvien@leggett.com')
    const passInput = screen.getByPlaceholderText('••••••••')
    const button = screen.getByRole('button', { name: /Đăng nhập với Mật khẩu/i })

    await user.clear(input)
    await user.type(input, 'invalid@example.com')
    await user.clear(passInput)
    await user.type(passInput, 'demo1234')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Invalid email provider')
    })
  })
})
