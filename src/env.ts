export interface EnvConfig {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export function parseEnv(raw: Record<string, unknown>): EnvConfig {
  return {
    supabaseUrl: raw.VITE_SUPABASE_URL ? String(raw.VITE_SUPABASE_URL) : undefined,
    supabaseAnonKey: raw.VITE_SUPABASE_ANON_KEY ? String(raw.VITE_SUPABASE_ANON_KEY) : undefined,
  }
}

export const env: EnvConfig = parseEnv(import.meta.env)
