/**
 * Supabase middleware helper — refreshes the auth session on every request.
 * Import and call updateSession() from Next.js middleware.ts.
 *
 * @example
 * // middleware.ts (project root)
 * import { updateSession } from '@/lib/supabase/middleware'
 * export async function middleware(request: NextRequest) {
 *   return updateSession(request)
 * }
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

/**
 * Refreshes the Supabase session cookie and forwards the request.
 * Must be called from Next.js middleware to keep auth tokens fresh.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request })

  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  return supabaseResponse
}
