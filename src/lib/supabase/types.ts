/**
 * Placeholder Database type for NexEstate.
 * Replace with output of: `supabase gen types typescript --project-id <id>`
 */

export type OrgTier = 'starter' | 'pro' | 'enterprise'
export type MemberRole = 'admin' | 'agent'
export type CrmProvider = 'tokko' | 'deinmobiliarios'
export type SyncStatus = 'pending' | 'running' | 'success' | 'error'

// ── organizations ──────────────────────────────────────────────────────────────

export interface OrganizationRow {
  id: string
  name: string
  slug: string
  tier: OrgTier
  created_at: string
}

export interface OrganizationInsert {
  id?: string
  name: string
  slug: string
  tier?: OrgTier
  created_at?: string
}

export interface OrganizationUpdate {
  name?: string
  slug?: string
  tier?: OrgTier
}

// ── members ────────────────────────────────────────────────────────────────────

export interface MemberRow {
  id: string
  org_id: string
  user_id: string
  role: MemberRole
  created_at: string
}

export interface MemberInsert {
  id?: string
  org_id: string
  user_id: string
  role?: MemberRole
  created_at?: string
}

export interface MemberUpdate {
  role?: MemberRole
}

// ── crm_connections ────────────────────────────────────────────────────────────

export interface CrmConnectionRow {
  id: string
  org_id: string
  provider: CrmProvider
  api_key_encrypted: Uint8Array
  last_sync_at: string | null
  sync_status: SyncStatus
  config: Record<string, unknown>
  created_at: string
}

export interface CrmConnectionInsert {
  id?: string
  org_id: string
  provider: CrmProvider
  api_key_encrypted: Uint8Array
  last_sync_at?: string | null
  sync_status?: SyncStatus
  config?: Record<string, unknown>
  created_at?: string
}

export interface CrmConnectionUpdate {
  last_sync_at?: string | null
  sync_status?: SyncStatus
  config?: Record<string, unknown>
}

// ── Database aggregate (mirrors supabase-js Database generic) ─────────────────

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: OrganizationRow
        Insert: OrganizationInsert
        Update: OrganizationUpdate
      }
      members: {
        Row: MemberRow
        Insert: MemberInsert
        Update: MemberUpdate
      }
      crm_connections: {
        Row: CrmConnectionRow
        Insert: CrmConnectionInsert
        Update: CrmConnectionUpdate
      }
    }
    Functions: {
      get_user_org_id: {
        Args: { user_uuid: string }
        Returns: string | null
      }
    }
  }
}
