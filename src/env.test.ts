import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('parseEnv', () => {
  it('reads VITE_ prefixed values', () => {
    const env = parseEnv({ VITE_SUPABASE_URL: 'https://x.supabase.co', MODE: 'test' })
    expect(env.supabaseUrl).toBe('https://x.supabase.co')
    expect(env.supabaseAnonKey).toBeUndefined()
  })

  it('leaves missing values undefined', () => {
    expect(parseEnv({}).supabaseUrl).toBeUndefined()
  })
})
