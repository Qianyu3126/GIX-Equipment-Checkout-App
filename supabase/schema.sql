-- Lab 5 Supabase schema
-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists staff (
  id uuid primary key,
  name text not null,
  email text unique not null,
  role text not null check (role in ('operations', 'admin'))
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  barcode text unique not null,
  category text,
  status text not null default 'available' check (status in ('available', 'checked_out')),
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists checkouts (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  checked_out_at timestamptz not null default now(),
  due_at timestamptz,
  returned_at timestamptz,
  staff_id uuid references staff(id) on delete set null
);

create index if not exists idx_items_status on items(status);
create index if not exists idx_checkouts_open on checkouts(item_id) where returned_at is null;

-- Row level security
alter table items enable row level security;
alter table checkouts enable row level security;
alter table projects enable row level security;
alter table staff enable row level security;

-- Public can browse items
drop policy if exists "items_public_read" on items;
create policy "items_public_read" on items for select using (true);

-- Lab demo: allow anonymous writes so the app works without an auth flow.
-- In production, replace these with auth-gated policies.
drop policy if exists "items_anon_all" on items;
create policy "items_anon_all" on items for all using (true) with check (true);

drop policy if exists "checkouts_anon_all" on checkouts;
create policy "checkouts_anon_all" on checkouts for all using (true) with check (true);

drop policy if exists "projects_anon_all" on projects;
create policy "projects_anon_all" on projects for all using (true) with check (true);
