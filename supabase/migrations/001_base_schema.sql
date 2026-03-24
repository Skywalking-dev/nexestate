-- Migration: 001_base_schema
-- Creates core multi-tenant tables for NexEstate
-- Rollback: DROP TABLE crm_connections, members, organizations CASCADE;

-- Multi-tenant anchor
CREATE TABLE IF NOT EXISTS organizations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  tier        TEXT        NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'pro', 'enterprise')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations (slug);

-- Org membership + roles
CREATE TABLE IF NOT EXISTS members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID        NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_members_org_id  ON members (org_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members (user_id);

-- CRM integration credentials (encrypted at rest)
CREATE TABLE IF NOT EXISTS crm_connections (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            UUID        NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  provider          TEXT        NOT NULL CHECK (provider IN ('tokko', 'deinmobiliarios')),
  api_key_encrypted TEXT        NOT NULL,
  last_sync_at      TIMESTAMPTZ,
  sync_status       TEXT        NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'active', 'running', 'success', 'error', 'disconnected')),
  config            JSONB       NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_crm_connections_org_id ON crm_connections (org_id);
