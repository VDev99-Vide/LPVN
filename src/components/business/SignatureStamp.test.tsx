import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignatureStamp } from './SignatureStamp'

describe('SignatureStamp', () => {
  it('renders signer name and verified badge', () => {
    render(
      <SignatureStamp
        signerName="Nguyen Van Manager"
        signerCode="LPVN-M001"
        title="TRƯỞNG BỘ PHẬN DUYỆT"
        isVerified={true}
      />
    )

    expect(screen.getAllByText('Nguyen Van Manager').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('LPVN-M001')).toBeInTheDocument()
    expect(screen.getByText('TRƯỞNG BỘ PHẬN DUYỆT')).toBeInTheDocument()
    expect(screen.getByText('KÝ ĐIỆN TỬ')).toBeInTheDocument()
  })
})
