-- Migration: 004_properties_extra_fields
-- Adds additional Tokko fields to properties table
-- Rollback: ALTER TABLE properties DROP COLUMN public_url, publication_title, reference_code, expenses, orientation, room_amount, dining_room, living_amount, parking_lot_amount, surface, floors_amount, tags, custom_tags, videos, credit_eligible;

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS public_url         TEXT,
  ADD COLUMN IF NOT EXISTS publication_title  TEXT        NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reference_code     TEXT        NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS expenses           NUMERIC,
  ADD COLUMN IF NOT EXISTS orientation        TEXT        NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS room_amount        INTEGER,
  ADD COLUMN IF NOT EXISTS dining_room        INTEGER,
  ADD COLUMN IF NOT EXISTS living_amount      INTEGER,
  ADD COLUMN IF NOT EXISTS parking_lot_amount INTEGER,
  ADD COLUMN IF NOT EXISTS surface            NUMERIC,
  ADD COLUMN IF NOT EXISTS floors_amount      INTEGER,
  ADD COLUMN IF NOT EXISTS tags               JSONB       NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS custom_tags        JSONB       NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS videos             JSONB       NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS credit_eligible    TEXT        NOT NULL DEFAULT '';
