CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tokko_id INTEGER,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  tokko_data JSONB DEFAULT '{}'::jsonb,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, tokko_id)
);

CREATE INDEX idx_contacts_org_id ON contacts(org_id);
CREATE INDEX idx_contacts_tokko_id ON contacts(tokko_id);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contacts of their organization"
  ON contacts FOR SELECT
  USING (org_id = (SELECT public.get_user_org_id(auth.uid())));

CREATE POLICY "Service role can manage contacts"
  ON contacts FOR ALL
  USING (true)
  WITH CHECK (true);
