/**
 * NexEstate — Shared app types
 * Re-exports DB types + declares shared app-level types.
 */

// Re-export all database types from supabase lib
export type {
  Database,
  OrgTier,
  MemberRole,
  CrmProvider,
  SyncStatus,
  OrganizationRow,
  OrganizationInsert,
  OrganizationUpdate,
  MemberRow,
  MemberInsert,
  MemberUpdate,
  CrmConnectionRow,
  CrmConnectionInsert,
  CrmConnectionUpdate,
} from "@/lib/supabase/types";

// ── App-level shared types ─────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
