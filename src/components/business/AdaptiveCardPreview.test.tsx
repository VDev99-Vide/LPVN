import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdaptiveCardPreview } from './AdaptiveCardPreview'

describe('AdaptiveCardPreview', () => {
  it('renders Actionable Message Adaptive Card simulator with facts and buttons', () => {
    render(<AdaptiveCardPreview />)

    expect(
      screen.getByText('Trình Mô Phỏng Actionable Message Adaptive Card (Outlook v1.4)')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chấp Nhận Duyệt/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Từ Chối/i })).toBeInTheDocument()
  })
})
