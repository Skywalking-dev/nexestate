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
      properties: {
        Row: {
          id: string
          org_id: string
          tokko_id: number | null
          title: string
          address: string
          description: string
          property_type: string
          operation_type: string
          price: number | null
          currency: string | null
          surface_total: number | null
          surface_covered: number | null
          bedrooms: number | null
          bathrooms: number | null
          photos: Json
          geo_lat: number | null
          geo_long: number | null
          status: string
          tokko_data: Json
          public_url: string | null
          publication_title: string
          reference_code: string
          expenses: number | null
          orientation: string
          room_amount: number | null
          dining_room: number | null
          living_amount: number | null
          parking_lot_amount: number | null
          surface: number | null
          floors_amount: number | null
          tags: Json
          custom_tags: Json
          videos: Json
          credit_eligible: string
          synced_at: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          tokko_id?: number | null
          title?: string
          address?: string
          description?: string
          property_type?: string
          operation_type?: string
          price?: number | null
          currency?: string | null
          surface_total?: number | null
          surface_covered?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          photos?: Json
          geo_lat?: number | null
          geo_long?: number | null
          status?: string
          tokko_data?: Json
          public_url?: string | null
          publication_title?: string
          reference_code?: string
          expenses?: number | null
          orientation?: string
          room_amount?: number | null
          dining_room?: number | null
          living_amount?: number | null
          parking_lot_amount?: number | null
          surface?: number | null
          floors_amount?: number | null
          tags?: Json
          custom_tags?: Json
          videos?: Json
          credit_eligible?: string
          synced_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          tokko_id?: number | null
          title?: string
          address?: string
          description?: string
          property_type?: string
          operation_type?: string
          price?: number | null
          currency?: string | null
          surface_total?: number | null
          surface_covered?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          photos?: Json
          geo_lat?: number | null
          geo_long?: number | null
          status?: string
          tokko_data?: Json
          public_url?: string | null
          publication_title?: string
          reference_code?: string
          expenses?: number | null
          orientation?: string
          room_amount?: number | null
          dining_room?: number | null
          living_amount?: number | null
          parking_lot_amount?: number | null
          surface?: number | null
          floors_amount?: number | null
          tags?: Json
          custom_tags?: Json
          videos?: Json
          credit_eligible?: string
          synced_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_org_id_fkey"
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

export type PropertyRow = Tables['properties']['Row']
export type PropertyInsert = Tables['properties']['Insert']
export type PropertyUpdate = Tables['properties']['Update']
