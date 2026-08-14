import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QATestPage } from './QATestPage'

afterEach(cleanup)

describe('QATestPage', () => {
  it('renders heading and QASuiteDashboard', () => {
    render(<QATestPage />)
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveTextContent('Trung Tâm Kiểm Thử & Chất Lượng (QA & E2E Testing)')
    expect(
      screen.getByText('Thực Thi Bộ Kiểm Thử Chất Lượng Tự Động (Live QA Runner)')
    ).toBeInTheDocument()
  })
})
