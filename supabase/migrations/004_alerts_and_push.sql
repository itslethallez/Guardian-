-- Alerts (the previously-planned "002" alerts table — never created, this
-- migration delivers it) and Web Push subscriptions.
-- Run this in the Supabase SQL Editor or via supabase db push.

create table if not exists public.alerts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  message      text,
  phrase       text,
  lat          double precision,
  lng          double precision,
  battery      int,
  status       text not null default 'active'
                 check (status in ('active', 'resolved', 'cancelled')),
  resolved_at  timestamptz,
  share_token  uuid not null default gen_random_uuid() unique
);

create index if not exists alerts_share_token_idx on public.alerts (share_token);

alter table public.alerts enable row level security;

drop policy if exists "Owners can view own alerts" on public.alerts;
create policy "Owners can view own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

drop policy if exists "Owners can create own alerts" on public.alerts;
create policy "Owners can create own alerts"
  on public.alerts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update own alerts" on public.alerts;
create policy "Owners can update own alerts"
  on public.alerts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Web Push subscriptions: one row per (user, browser/device) endpoint.
create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users can view own push subscriptions" on public.push_subscriptions;
create policy "Users can view own push subscriptions"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own push subscriptions" on public.push_subscriptions;
create policy "Users can insert own push subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

-- Not in the original spec, but required: the client upserts on the unique
-- `endpoint` column (re-subscribing the same device hits this path), and an
-- INSERT ... ON CONFLICT DO UPDATE needs UPDATE privileges on the existing row.
drop policy if exists "Users can update own push subscriptions" on public.push_subscriptions;
create policy "Users can update own push subscriptions"
  on public.push_subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own push subscriptions" on public.push_subscriptions;
create policy "Users can delete own push subscriptions"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);
