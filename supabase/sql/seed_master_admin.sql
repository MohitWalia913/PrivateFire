-- Master admin seed for Private Fire
-- Run in Supabase Dashboard → SQL Editor (uses auth schema).
--
-- Email:    lgm10@humboldt.edu
-- Password: PrivateFireAdmin2026!   ← change after first login
--
-- Grants:
--   user_metadata.role = 'admin'
--   user_metadata.is_master_admin = true
-- Creates auth user + identity + user_profiles + alert settings if missing.

create extension if not exists pgcrypto;

do $$
declare
  master_email text := 'lgm10@humboldt.edu';
  master_password text := 'PrivateFireAdmin2026!';
  instance uuid := '00000000-0000-0000-0000-000000000000';
  user_id uuid;
  now_ts timestamptz := timezone('utc', now());
begin
  select id into user_id from auth.users where lower(email) = lower(master_email);

  if user_id is null then
    user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_sso_user,
      is_anonymous
    ) values (
      instance,
      user_id,
      'authenticated',
      'authenticated',
      master_email,
      crypt(master_password, gen_salt('bf')),
      now_ts,
      now_ts,
      now_ts,
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'role', 'admin',
        'is_master_admin', true,
        'first_name', 'Master',
        'last_name', 'Admin'
      ),
      now_ts,
      now_ts,
      false,
      false
    );
  else
    update auth.users
    set
      encrypted_password = crypt(master_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now_ts),
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
        'role', 'admin',
        'is_master_admin', true,
        'first_name', coalesce(raw_user_meta_data->>'first_name', 'Master'),
        'last_name', coalesce(raw_user_meta_data->>'last_name', 'Admin')
      ),
      updated_at = now_ts
    where id = user_id;
  end if;

  if not exists (
    select 1 from auth.identities
    where user_id = user_id and provider = 'email'
  ) then
    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      user_id,
      jsonb_build_object('sub', user_id::text, 'email', master_email),
      'email',
      user_id::text,
      now_ts,
      now_ts,
      now_ts
    );
  end if;

  insert into public.user_profiles (
    user_id,
    first_name,
    last_name,
    coverage_status,
    created_at,
    updated_at
  ) values (
    user_id,
    'Master',
    'Admin',
    'active',
    now_ts,
    now_ts
  )
  on conflict (user_id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    coverage_status = 'active',
    updated_at = now_ts;

  insert into public.user_alert_settings (user_id)
  values (user_id)
  on conflict (user_id) do nothing;

  raise notice 'Master admin ready: % (user_id: %)', master_email, user_id;
end $$;
