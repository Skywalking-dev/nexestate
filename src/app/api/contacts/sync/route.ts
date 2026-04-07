/**
 * POST /api/contacts/sync
 * Fetches all contacts from the org's active Tokko connection and upserts them.
 * Requires: authenticated + admin role.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { TokkoClient } from '@/lib/tokko/client'
import { decryptApiKey } from '@/lib/crypto'
import type { TokkoContact } from '@/lib/tokko/types'
import type { Json } from '@/lib/supabase/types'

const BATCH_SIZE = 20

export async function POST(): Promise<NextResponse> {
  // 1. Auth + admin check
  let orgId: string
  try {
    const admin = await requireAdmin()
    orgId = admin.orgId
  } catch (err) {
    const e = err as { status?: number; error?: string }
    if (e.status === 403) {
      return NextResponse.json({ error: e.error }, { status: 403 })
    }
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const supabase = await createClient()

  // 2. Get active CRM connection
  const { data: connection, error: connError } = await supabase
    .from('crm_connections')
    .select('id, api_key_encrypted')
    .eq('org_id', orgId)
    .eq('sync_status', 'active')
    .maybeSingle()

  if (connError) {
    console.error('[contacts/sync] crm_connections query error', connError)
    return NextResponse.json({ error: 'Error al obtener la conexión CRM.' }, { status: 500 })
  }
  if (!connection) {
    return NextResponse.json({ error: 'No hay conexión CRM activa para esta organización.' }, { status: 404 })
  }

  // 3. Decrypt API key
  let apiKey: string
  try {
    apiKey = decryptApiKey(connection.api_key_encrypted)
  } catch (err) {
    console.error('[contacts/sync] decryption error', err)
    return NextResponse.json({ error: 'Error interno al procesar credenciales.' }, { status: 500 })
  }

  // 4. Paginate + collect all contacts from Tokko
  const client = new TokkoClient(apiKey)
  const allContacts: TokkoContact[] = []
  let offset = 0

  try {
    while (true) {
      const page = await client.getContacts({ limit: BATCH_SIZE, offset })
      allContacts.push(...page.objects)
      if (!page.next || page.objects.length < BATCH_SIZE) break
      offset += BATCH_SIZE
    }
  } catch (err) {
    console.error('[contacts/sync] tokko fetch error', err)
    return NextResponse.json({ error: 'Error al obtener contactos de Tokko.' }, { status: 502 })
  }

  // 5. Map to table schema
  const rows = allContacts.map((c) => ({
    org_id:     orgId,
    tokko_id:   c.id,
    name:       c.name ?? '',
    email:      c.email ?? '',
    phone:      c.phone ?? '',
    tags:       (c.tags ?? []) as unknown as Json,
    tokko_data: c as unknown as Json,
    synced_at:  new Date().toISOString(),
  }))

  // 6. Upsert into contacts
  const { error: upsertError } = await supabase
    .from('contacts')
    .upsert(rows, { onConflict: 'org_id,tokko_id' })

  if (upsertError) {
    console.error('[contacts/sync] upsert error', upsertError)
    return NextResponse.json({ error: 'Error al guardar contactos.' }, { status: 500 })
  }

  // 7. Update last_sync_at on the connection
  const { error: syncUpdateError } = await supabase
    .from('crm_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', connection.id)

  if (syncUpdateError) {
    console.error('[contacts/sync] last_sync_at update error', syncUpdateError)
    // Non-fatal — sync succeeded, just log it
  }

  return NextResponse.json({ synced: rows.length })
}
