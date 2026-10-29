-- Run this once in Supabase → SQL Editor.
-- Stores one row per device that turned on reminders. No health or smoking data is stored here,
-- only what is needed to send the right message at the right local time.

create table if not exists public.push_subscriptions (
  endpoint      text primary key,
  subscription  jsonb       not null,
  timezone      text        not null default 'UTC',
  morning_hour  smallint    not null default 9,
  evening_hour  smallint    not null default 21,
  name          text        not null default '',
  mode          text        not null default 'quick',
  start_date    date,
  last_morning  text,
  last_evening  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Lock the table down: only the server (secret / service_role key) can read or write it.
alter table public.push_subscriptions enable row level security;
