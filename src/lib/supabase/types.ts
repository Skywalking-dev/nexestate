/**
 * Supabase Database types — auto-generated via `supabase gen types typescript`.
 * Re-run: SUPABASE_ACCESS_TOKEN=... npx supabase gen types typescript --project-id vfdvfqqkxvqqcfeejazh
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      crm_connections: {
        Row: {
          api_key_encrypted: string
          config: Json
          created_at: string
          id: string
          last_sync_at: string | null
          org_id: string
          provider: string
          sync_status: string
        }
        Insert: {
          api_key_encrypted: string
          config?: Json
          created_at?: string
          id?: string
          last_sync_at?: string | null
          org_id: string
          provider: string
          sync_status?: string
        }
        Update: {
          api_key_encrypted?: string
          config?: Json
          created_at?: string
          id?: string
          last_sync_at?: string | null
          org_id?: string
          provider?: string
          sync_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_connections_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          tier: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          tier?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          tier?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_id: { Args: { user_uuid: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ── Convenience aliases ─────────────────────────────────────────────────────

export type OrgTier = 'starter' | 'pro' | 'enterprise'
export type MemberRole = 'admin' | 'agent'
export type CrmProvider = 'tokko' | 'deinmobiliarios'
export type SyncStatus = 'pending' | 'running' | 'success' | 'error' | 'active' | 'disconnected'

type Tables = Database['public']['Tables']

export type OrganizationRow = Tables['organizations']['Row']
export type OrganizationInsert = Tables['organizations']['Insert']
export type OrganizationUpdate = Tables['organizations']['Update']

export type MemberRow = Tables['members']['Row']
export type MemberInsert = Tables['members']['Insert']
export type MemberUpdate = Tables['members']['Update']

export type CrmConnectionRow = Tables['crm_connections']['Row']
export type CrmConnectionInsert = Tables['crm_connections']['Insert']
export type CrmConnectionUpdate = Tables['crm_connections']['Update']
