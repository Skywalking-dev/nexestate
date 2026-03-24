/**
 * POST /api/crm/connect
 * Validates a Tokko API key, encrypts it, and stores the CRM connection.
 * Requires: authenticated + admin role.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { connectCrmSchema } from '@/lib/schemas/crm-connection'
import { TokkoClient, TokkoAuthError, TokkoConnectionError } from '@/lib/tokko/client'
import { encryptApiKey } from '@/lib/crypto'

export async function POST(request: Request): Promise<NextResponse> {
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

  // 2. Parse + validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la solicitud no es JSON válido.' }, { status: 400 })
  }

  const parsed = connectCrmSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos.', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { provider, api_key } = parsed.data
  const supabase = await createClient()

  // 3. Check no existing active connection for org + provider
  const { data: existing } = await supabase
    .from('crm_connections')
    .select('id')
    .eq('org_id', orgId)
    .eq('provider', provider)
    .neq('sync_status', 'disconnected')
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: `Ya existe una conexión activa con ${provider}. Desconéctala primero.` },
      { status: 409 },
    )
  }

  // 4. Validate API key against Tokko
  if (provider === 'tokko') {
    const client = new TokkoClient(api_key)
    try {
      const valid = await client.validateConnection()
      if (!valid) {
        return NextResponse.json(
          { error: 'API key inválida. Verifica con soporte de Tokko.' },
          { status: 400 },
        )
      }
    } catch (err) {
      if (err instanceof TokkoAuthError) {
        return NextResponse.json(
          { error: 'API key inválida. Verifica con soporte de Tokko.' },
          { status: 400 },
        )
      }
      if (err instanceof TokkoConnectionError) {
        return NextResponse.json(
          { error: 'No se pudo conectar con Tokko para validar la clave. Intenta más tarde.' },
          { status: 502 },
        )
      }
      throw err
    }
  }

  // 5. Encrypt key + persist
  const apiKeyEncrypted = encryptApiKey(api_key)

  const { data: connection, error: insertError } = await supabase
    .from('crm_connections')
    .insert({
      org_id: orgId,
      provider,
      api_key_encrypted: apiKeyEncrypted,
      sync_status: 'active',
    })
    .select('id, provider, sync_status, created_at')
    .single()

  if (insertError || !connection) {
    console.error('[crm/connect] insert error', insertError)
    return NextResponse.json({ error: 'Error al guardar la conexión.' }, { status: 500 })
  }

  return NextResponse.json(
    {
      id: connection.id,
      provider: connection.provider,
      status: connection.sync_status,
      created_at: connection.created_at,
    },
    { status: 201 },
  )
}
