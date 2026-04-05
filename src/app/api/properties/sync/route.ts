/**
 * POST /api/properties/sync
 * Fetches all properties from the org's active Tokko connection and upserts them.
 * Requires: authenticated + admin role.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { TokkoClient } from '@/lib/tokko/client'
import { decryptApiKey } from '@/lib/crypto'
import type { TokkoProperty } from '@/lib/tokko/types'
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
    console.error('[properties/sync] crm_connections query error', connError)
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
    console.error('[properties/sync] decryption error', err)
    return NextResponse.json({ error: 'Error interno al procesar credenciales.' }, { status: 500 })
  }

  // 4. Paginate + collect all properties from Tokko
  const client = new TokkoClient(apiKey)
  const allProperties: TokkoProperty[] = []
  let offset = 0

  try {
    while (true) {
      const page = await client.getProperties({ limit: BATCH_SIZE, offset })
      allProperties.push(...page.objects)
      if (!page.next || page.objects.length < BATCH_SIZE) break
      offset += BATCH_SIZE
    }
  } catch (err) {
    console.error('[properties/sync] tokko fetch error', err)
    return NextResponse.json({ error: 'Error al obtener propiedades de Tokko.' }, { status: 502 })
  }

  // 5. Map to table schema
  const rows = allProperties.map((p) => {
    const firstOp = p.operations?.[0]
    const firstPrice = firstOp?.prices?.[0]
    return {
      org_id:          orgId,
      tokko_id:        p.id,
      title:           p.title ?? '',
      address:         p.address ?? '',
      description:     p.description ?? '',
      property_type:   p.type?.code ?? '',
      operation_type:  firstOp?.operation_type ?? '',
      price:           firstPrice?.price ?? null,
      currency:        firstPrice?.currency ?? null,
      surface_total:   p.surface_total,
      surface_covered: p.surface_covered,
      bedrooms:        p.suite_amount,
      bathrooms:       p.bathroom_amount,
      photos:             (p.photos ?? []) as unknown as Json,
      geo_lat:            p.geo_lat,
      geo_long:           p.geo_long,
      status:             String(p.status ?? 'active'),
      tokko_data:         p as unknown as Json,
      public_url:         p.public_url ?? null,
      publication_title:  p.publication_title ?? '',
      reference_code:     p.reference_code ?? '',
      expenses:           p.expenses ?? null,
      orientation:        p.orientation ?? '',
      room_amount:        p.room_amount ?? null,
      dining_room:        p.dining_room ?? null,
      living_amount:      p.living_amount ?? null,
      parking_lot_amount: p.parking_lot_amount ?? null,
      surface:            p.surface ? parseFloat(p.surface) || null : null,
      floors_amount:      p.floors_amount ?? null,
      tags:               (p.tags ?? []) as unknown as Json,
      custom_tags:        (p.custom_tags ?? []) as unknown as Json,
      videos:             (p.videos ?? []) as unknown as Json,
      credit_eligible:    p.credit_eligible ?? '',
      synced_at:          new Date().toISOString(),
    }
  })

  // 6. Upsert into properties
  const { error: upsertError } = await supabase
    .from('properties')
    .upsert(rows, { onConflict: 'org_id,tokko_id' })

  if (upsertError) {
    console.error('[properties/sync] upsert error', upsertError)
    return NextResponse.json({ error: 'Error al guardar propiedades.' }, { status: 500 })
  }

  // 7. Update last_sync_at on the connection
  const { error: syncUpdateError } = await supabase
    .from('crm_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', connection.id)

  if (syncUpdateError) {
    console.error('[properties/sync] last_sync_at update error', syncUpdateError)
    // Non-fatal — sync succeeded, just log it
  }

  return NextResponse.json({ synced: rows.length })
}
