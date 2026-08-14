import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SecurityScanTrigger } from './SecurityScanTrigger'

afterEach(cleanup)

describe('SecurityScanTrigger', () => {
  it('renders scan trigger button', () => {
    render(<SecurityScanTrigger />)
    expect(
      screen.getByText('Bộ Quét An Ninh Toàn Diện Hệ Thống (Live Security Posture Scan)')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Chạy Quét An Ninh Ngay/i })
    ).toBeInTheDocument()
  })

  it('runs security scan and displays completed results', async () => {
    render(<SecurityScanTrigger />)
    const runBtn = screen.getByRole('button', { name: /Chạy Quét An Ninh Ngay/i })
    fireEvent.click(runBtn)

    expect(screen.getByText(/Đang Quét An Ninh.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Lần quét gần nhất lúc/i)).toBeInTheDocument()
    })
  })
})
