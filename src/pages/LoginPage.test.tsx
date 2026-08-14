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

describe('LoginPage', () => {
  it('renders heading, SSO login button, and email input', () => {
    renderLoginPage()

    expect(screen.getByText('Đăng nhập LPVN HR Flow')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đăng nhập bằng Microsoft 365/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('nhanvien@leggett.com')).toBeInTheDocument()
  })

  it('submits form and displays success message', async () => {
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
    const button = screen.getByRole('button', { name: /Gửi Mã Đăng Nhập Cục Bộ/i })

    await user.type(input, 'nhanvien@leggett.com')
    await user.click(button)

    expect(signInSpy).toHaveBeenCalledWith({ email: 'nhanvien@leggett.com' })

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Đã gửi liên kết đăng nhập đến email của bạn.')
    })
  })

  it('displays error message when signIn fails', async () => {
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null,
    })

    vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
      data: { user: null, session: null },
      error: { name: 'AuthError', message: 'Invalid email provider', status: 400, code: 'invalid_provider' } as any,
    })

    const user = userEvent.setup()
    renderLoginPage()

    const input = screen.getByPlaceholderText('nhanvien@leggett.com')
    const button = screen.getByRole('button', { name: /Gửi Mã Đăng Nhập Cục Bộ/i })

    await user.type(input, 'invalid@example.com')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Invalid email provider')
    })
  })
})
