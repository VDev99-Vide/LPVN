import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ProductionDeploymentPage } from './ProductionDeploymentPage'

afterEach(cleanup)

describe('ProductionDeploymentPage', () => {
  it('renders heading and ProductionDeploymentHub', () => {
    render(<ProductionDeploymentPage />)
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Trung Tâm Triển Khai Production (Go-Live & Release)')
    expect(
      screen.getByText('Trung Tâm Triển Khai Production (Cloudflare & Supabase Release)')
    ).toBeInTheDocument()
  })
})
