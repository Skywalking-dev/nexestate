/**
 * Auth helpers for NexEstate — server-side only.
 * All functions require the server Supabase client (uses cookies).
 */
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Session, User } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthenticatedAdmin {
  user: User
  orgId: string
}

/**
 * Sends a magic link to the given email via Supabase Auth.
 * Redirects to /auth/callback after sign-in.
 */
export async function signInWithMagicLink(email: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) throw error
}

/**
 * Signs out the current user and invalidates the session cookie.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Returns the current session or null if not authenticated.
 * Prefer getUser() for security-sensitive checks (validates JWT server-side).
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * Returns the current user by validating the JWT against Supabase Auth server.
 * More secure than getSession() — use for protected data access.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

/**
 * Asserts the user is authenticated; redirects to /login otherwise.
 * Use at the top of Server Components or Route Handlers that require auth.
 *
 * @returns Authenticated User
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

/**
 * Asserts the user is authenticated AND has role === 'admin' in their org.
 * Returns 403 payload if role check fails (use in Route Handlers — cannot redirect).
 *
 * @throws { status: 403 } plain object — caller must handle and return NextResponse
 * @returns { user, orgId }
 */
export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: member, error } = await supabase
    .from('members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .single()

  if (error || !member) {
    throw { status: 403, error: 'No perteneces a ninguna organización.' }
  }
  if (member.role !== 'admin') {
    throw { status: 403, error: 'Se requiere rol de administrador para esta acción.' }
  }

  return { user, orgId: member.org_id as string }
}
