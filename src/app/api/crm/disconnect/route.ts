/**
 * DELETE /api/crm/disconnect
 * Sets the org's active CRM connection to 'disconnected'.
 * Requires: authenticated + admin role.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(): Promise<NextResponse> {
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

  // 2. Mark all active connections as disconnected
  const { error } = await supabase
    .from('crm_connections')
    .update({ sync_status: 'disconnected' })
    .eq('org_id', orgId)
    .neq('sync_status', 'disconnected')

  if (error) {
    console.error('[crm/disconnect] update error', error)
    return NextResponse.json({ error: 'Error al desconectar el CRM.' }, { status: 500 })
  }

  return NextResponse.json({ disconnected: true })
}
