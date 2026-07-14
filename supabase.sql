create table if not exists public.relationship_assessments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  result_profile text not null check (result_profile in ('connection', 'avoidance', 'defensive', 'distance')),
  consent_to_contact boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.relationship_assessments enable row level security;

grant insert on table public.relationship_assessments to anon;

create policy "Allow anonymous assessment inserts"
on public.relationship_assessments for insert
to anon
with check (
  char_length(email) between 5 and 254
  and result_profile in ('connection', 'avoidance', 'defensive', 'distance')
);

-- No SELECT policy is created: public visitors cannot read stored leads.
