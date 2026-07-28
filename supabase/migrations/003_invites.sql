-- Trusted-circle invites: lets a Guard Mode user invite a trusted contact to
-- link their own account and flip that contact's status from 'pending' to
-- 'connected'. Acceptance always goes through the accept-invite edge function
-- (service role), so there is no public select policy here.
-- Run this in the Supabase SQL Editor or via supabase db push.

create table if not exists public.circle_invites (
  id             uuid primary key default gen_random_uuid(),
  inviter_id     uuid not null references auth.users (id) on delete cascade,
  contact_id     text not null,
  token          uuid not null default gen_random_uuid() unique,
  code           text not null unique,
  invitee_name   text,
  invitee_phone  text,
  status         text not null default 'pending'
                   check (status in ('pending', 'accepted', 'revoked', 'expired')),
  accepted_by    uuid references auth.users (id),
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null default now() + interval '14 days',
  accepted_at    timestamptz
);

create index if not exists circle_invites_token_idx on public.circle_invites (token);
create index if not exists circle_invites_code_idx on public.circle_invites (code);

alter table public.circle_invites enable row level security;

-- Inviters can manage only their own invites. No policy grants select/insert/
-- update to anyone else — the accepting contact never queries this table
-- directly, only through the service-role accept-invite function.
drop policy if exists "Inviters can view own invites" on public.circle_invites;
create policy "Inviters can view own invites"
  on public.circle_invites for select
  using (auth.uid() = inviter_id);

drop policy if exists "Inviters can create own invites" on public.circle_invites;
create policy "Inviters can create own invites"
  on public.circle_invites for insert
  with check (auth.uid() = inviter_id);

drop policy if exists "Inviters can update own invites" on public.circle_invites;
create policy "Inviters can update own invites"
  on public.circle_invites for update
  using (auth.uid() = inviter_id)
  with check (auth.uid() = inviter_id);

drop policy if exists "Inviters can delete own invites" on public.circle_invites;
create policy "Inviters can delete own invites"
  on public.circle_invites for delete
  using (auth.uid() = inviter_id);
