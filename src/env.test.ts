import { describe, expect, it } from 'vitest'
import { env } from './env'

describe('env', () => {
  it('exports VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', () => {
    expect(env).toHaveProperty('VITE_SUPABASE_URL')
    expect(env).toHaveProperty('VITE_SUPABASE_ANON_KEY')
  })
})

