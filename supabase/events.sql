-- Component E: GIX events table.
-- Run this in Supabase SQL Editor after schema.sql.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('lecture', 'workshop', 'career', 'social')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_starts_at on events(starts_at);
create index if not exists idx_events_category on events(category);

alter table events enable row level security;

drop policy if exists "events_anon_all" on events;
create policy "events_anon_all" on events for all using (true) with check (true);

-- Sample data
insert into events (title, description, category, starts_at, ends_at, location) values
  ('AI Ethics Lecture', 'Guest talk on responsible AI in product design.', 'lecture',
   now() + interval '3 days', now() + interval '3 days 1 hour', 'GIX 130'),
  ('Soldering Workshop', 'Hands-on workshop on through-hole and SMD soldering.', 'workshop',
   now() + interval '5 days', now() + interval '5 days 2 hours', 'GIX Maker Space'),
  ('Career Panel: PMs in Tech', 'Three product managers share early-career advice.', 'career',
   now() + interval '7 days', now() + interval '7 days 90 minutes', 'GIX Auditorium'),
  ('Spring Mixer', 'Casual networking event with snacks and drinks.', 'social',
   now() + interval '10 days', now() + interval '10 days 3 hours', 'GIX Atrium'),
  ('Intro to MQTT', 'Workshop on MQTT for IoT prototyping.', 'workshop',
   now() + interval '14 days', now() + interval '14 days 2 hours', 'GIX 230')
on conflict do nothing;
