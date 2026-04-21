-- Private Fire: per-user profile and alert settings
-- Run this in Supabase SQL editor.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  address_line1 text,
  city text,
  state text,
  zip_code text,
  coverage_status text not null default 'not_covered' check (coverage_status in ('not_covered', 'pending', 'active')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_alert_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  alert_radius_miles integer not null default 25 check (alert_radius_miles in (10, 25, 50, 100)),
  threshold text not null default 'any' check (threshold in ('any', 'major', 'critical')),
  email_alerts boolean not null default true,
  sms_alerts boolean not null default false,
  push_alerts boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coverage_applications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default 'CA',
  zip text not null default '',
  property_type text not null default '',
  home_value text not null default '',
  has_insurance text not null default '',
  additional_info text,
  submitted boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_user_alert_settings_updated_at on public.user_alert_settings;
create trigger set_user_alert_settings_updated_at
before update on public.user_alert_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_coverage_applications_updated_at on public.coverage_applications;
create trigger set_coverage_applications_updated_at
before update on public.coverage_applications
for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.user_alert_settings enable row level security;
alter table public.coverage_applications enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
on public.user_profiles for select
using (auth.uid() = user_id);

drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
on public.user_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
on public.user_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_alert_settings_select_own" on public.user_alert_settings;
create policy "user_alert_settings_select_own"
on public.user_alert_settings for select
using (auth.uid() = user_id);

drop policy if exists "user_alert_settings_insert_own" on public.user_alert_settings;
create policy "user_alert_settings_insert_own"
on public.user_alert_settings for insert
with check (auth.uid() = user_id);

drop policy if exists "user_alert_settings_update_own" on public.user_alert_settings;
create policy "user_alert_settings_update_own"
on public.user_alert_settings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "coverage_applications_select_own" on public.coverage_applications;
create policy "coverage_applications_select_own"
on public.coverage_applications for select
using (auth.uid() = user_id);

drop policy if exists "coverage_applications_insert_own" on public.coverage_applications;
create policy "coverage_applications_insert_own"
on public.coverage_applications for insert
with check (auth.uid() = user_id);

drop policy if exists "coverage_applications_update_own" on public.coverage_applications;
create policy "coverage_applications_update_own"
on public.coverage_applications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
