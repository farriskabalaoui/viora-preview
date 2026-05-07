-- Viora Healthcare — initial schema (idempotent)
-- Apply via Supabase SQL editor or PostgREST.

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: per-user metadata extending auth.users
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  age_confirmed boolean not null default false,
  research_use_acknowledged boolean not null default false,
  terms_accepted_at timestamptz,
  consent_version text,
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row on signup, copying consent metadata from
-- auth.users.raw_user_meta_data (the same object signUp({ data }) sets).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, email, phone,
    age_confirmed, research_use_acknowledged,
    terms_accepted_at, consent_version
  )
  values (
    new.id,
    new.email,
    new.phone,
    coalesce((new.raw_user_meta_data ->> 'age_confirmed')::boolean, false),
    coalesce((new.raw_user_meta_data ->> 'research_use_acknowledged')::boolean, false),
    nullif(new.raw_user_meta_data ->> 'terms_accepted_at', '')::timestamptz,
    new.raw_user_meta_data ->> 'consent_version'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- consent_log: append-only per-event consent record (compliance audit trail)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.consent_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  stage text not null,             -- "signup" | "checkout" | "reorder" | etc.
  consent_version text not null,
  ip_address text,
  user_agent text,
  referer text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists consent_log_user_idx on public.consent_log (user_id);
create index if not exists consent_log_created_idx on public.consent_log (created_at desc);

alter table public.consent_log enable row level security;

-- Users can read only their own consent events
drop policy if exists "consent_log_self_read" on public.consent_log;
create policy "consent_log_self_read"
  on public.consent_log for select
  using (auth.uid() = user_id);

-- Inserts are allowed from authed sessions for their own user_id, OR
-- anonymously (for pre-signup events) where user_id is null.
drop policy if exists "consent_log_insert" on public.consent_log;
create policy "consent_log_insert"
  on public.consent_log for insert
  with check (
    user_id is null
    or auth.uid() = user_id
  );
