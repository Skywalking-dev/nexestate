-- Migration: 002_rls_policies
-- Enables RLS + org-isolation policies on core tables
-- Rollback: DROP FUNCTION public.get_user_org_id; disable RLS + drop policies per table

-- ── Helper ─────────────────────────────────────────────────────────────────────
-- Returns the org_id for a given Supabase auth user.
-- SECURITY DEFINER runs as the function owner, bypassing RLS on members itself.
CREATE OR REPLACE FUNCTION public.get_user_org_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM members WHERE user_id = user_uuid LIMIT 1;
$$;

-- ── organizations ──────────────────────────────────────────────────────────────
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Members can read their own org.
CREATE POLICY "org_select_member"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (id = public.get_user_org_id(auth.uid()));

-- ── members ────────────────────────────────────────────────────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Any member can read their org's roster.
CREATE POLICY "members_select_same_org"
  ON members
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id(auth.uid()));

-- Only admins can invite (INSERT) members.
CREATE POLICY "members_insert_admin"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = public.get_user_org_id(auth.uid())
    AND EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
        AND m.org_id  = org_id
        AND m.role    = 'admin'
    )
  );

-- Only admins can update member records (e.g. role changes).
CREATE POLICY "members_update_admin"
  ON members
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id(auth.uid())
    AND EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
        AND m.org_id  = org_id
        AND m.role    = 'admin'
    )
  );

-- ── crm_connections ────────────────────────────────────────────────────────────
ALTER TABLE crm_connections ENABLE ROW LEVEL SECURITY;

-- Full CRUD for org admins only — API keys are sensitive.
CREATE POLICY "crm_all_admin"
  ON crm_connections
  FOR ALL
  TO authenticated
  USING (
    org_id = public.get_user_org_id(auth.uid())
    AND EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
        AND m.org_id  = org_id
        AND m.role    = 'admin'
    )
  )
  WITH CHECK (
    org_id = public.get_user_org_id(auth.uid())
    AND EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid()
        AND m.org_id  = org_id
        AND m.role    = 'admin'
    )
  );
