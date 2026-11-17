-- Run once in Supabase > SQL editor.
-- Row Level Security is ON with no public policies: only the server (service role key) can read/write.

create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  age text,
  language text,
  neighbourhood text,
  personality text,
  field text,
  hoping text[] default '{}',
  days text[] default '{}',
  instagram text,
  site_lang text,
  consent boolean not null default false,
  table_id text,            -- you fill this in when you match someone to a table
  notes text                -- your private matching notes
);
alter table public.signups enable row level security;

create table if not exists public.payments (
  mollie_id text primary key,
  created_at timestamptz not null default now(),
  status text,
  amount text,
  event_id text,
  email text
);
alter table public.payments enable row level security;

-- The website may only ADD sign-ups (with consent). It can never read, change or delete them.
grant insert on public.signups to anon;
create policy "website can add signups with consent"
  on public.signups for insert to anon
  with check (consent = true and table_id is null and notes is null);
