/**
 * Supabase browser client — use in Client Components only.
 * Singleton pattern: Next.js hot-reload safe.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
