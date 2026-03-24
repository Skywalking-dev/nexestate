/**
 * GET /api/crm/status
 * Returns the CRM connection health for the authenticated user's org.
 * Requires: authenticated (any role).
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { TokkoClient } from '@/lib/tokko/client'
import { decryptApiKey } from '@/lib/crypto'

export async function GET(): Promise<NextResponse> {
  // 1. Auth
  await requireAuth()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })

  // 2. Resolve org_id from members table
  const { data: member } = await supabase
    .from('members')
    .select('org_id')
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return NextResponse.json({ error: 'No perteneces a ninguna organización.' }, { status: 403 })
  }

  // 3. Fetch active connection
  const { data: connection } = await supabase
    .from('crm_connections')
    .select('id, provider, api_key_encrypted, sync_status, last_sync_at')
    .eq('org_id', member.org_id)
    .neq('sync_status', 'disconnected')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!connection) {
    return NextResponse.json({ connected: false })
  }

  // 4. Live health check
  let healthy = false
  try {
    const apiKey = decryptApiKey(connection.api_key_encrypted as string)

    if (connection.provider === 'tokko') {
      const client = new TokkoClient(apiKey)
      healthy = await client.validateConnection()
    }
  } catch {
    healthy = false
  }

  return NextResponse.json({
    connected: true,
    provider: connection.provider,
    status: connection.sync_status,
    last_sync_at: connection.last_sync_at ?? null,
    healthy,
  })
}
