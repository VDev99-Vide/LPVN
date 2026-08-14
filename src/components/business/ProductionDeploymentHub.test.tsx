import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductionDeploymentHub } from './ProductionDeploymentHub'

afterEach(cleanup)

describe('ProductionDeploymentHub', () => {
  it('renders deployment overview metrics and milestones table', () => {
    render(<ProductionDeploymentHub />)
    expect(screen.getByText('Mức Độ Sẵn Sàng Go-Live (Readiness)')).toBeInTheDocument()
    expect(screen.getByText('Hạ Tầng Edge CDN & Pages')).toBeInTheDocument()
    expect(screen.getByText('Danh Mục Hạng Mục Triển Khai (Go-Live Checklist)')).toBeInTheDocument()
    expect(screen.getByText('Cơ Sở Dữ Liệu & RLS')).toBeInTheDocument()
    expect(screen.getByText('Quy Trình Supply Chain')).toBeInTheDocument()
  })

  it('triggers deployment simulation when clicking Xác Nhận Nghiệm Thu', async () => {
    render(<ProductionDeploymentHub />)
    const deployBtn = screen.getByRole('button', { name: /Xác Nhận Nghiệm Thu/i })
    fireEvent.click(deployBtn)

    expect(screen.getByText(/Đang Kiểm Tra Bản Build.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByText(/Hệ thống đã được kiểm định nghiệm thu UAT 100%/i)
      ).toBeInTheDocument()
    })
  })
})
