-- Property Landings — stores AI-generated landing page content per property.
-- Each property can have multiple landings (regeneration history), but only one published at a time.

create table if not exists property_landings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  content jsonb not null,
  custom_prompt text,
  slug text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  generated_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_property_landings_property_id on property_landings(property_id);
create index idx_property_landings_org_id on property_landings(org_id);
create index idx_property_landings_status on property_landings(status);
create unique index idx_property_landings_slug on property_landings(slug);

-- RLS
alter table property_landings enable row level security;

-- Members can read landings from their org
create policy "members_select_landings"
  on property_landings for select
  using (org_id = get_user_org_id(auth.uid()));

-- Admins can insert landings for their org
create policy "admins_insert_landings"
  on property_landings for insert
  with check (
    org_id = get_user_org_id(auth.uid())
    and exists (
      select 1 from members
      where members.user_id = auth.uid()
        and members.org_id = property_landings.org_id
        and members.role = 'admin'
    )
  );

-- Admins can update landings for their org
create policy "admins_update_landings"
  on property_landings for update
  using (
    org_id = get_user_org_id(auth.uid())
    and exists (
      select 1 from members
      where members.user_id = auth.uid()
        and members.org_id = property_landings.org_id
        and members.role = 'admin'
    )
  );

-- Public read for published landings (no auth required)
create policy "public_read_published_landings"
  on property_landings for select
  using (status = 'published');
