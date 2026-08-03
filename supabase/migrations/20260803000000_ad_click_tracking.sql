-- Google Ads click tracking. Additive, idempotent and private by default.

create extension if not exists pgcrypto;

create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  click_id text not null,
  click_type text not null check (click_type in ('gclid', 'gbraid', 'wbraid')),
  ip_address inet not null,
  clicked_at timestamptz not null default now(),
  landing_page text not null,
  user_agent text,
  referrer text,
  country text,
  created_at timestamptz not null default now(),
  constraint ad_clicks_click_id_length check (char_length(click_id) between 6 and 512),
  constraint ad_clicks_landing_page_length check (char_length(landing_page) between 1 and 2048),
  constraint ad_clicks_user_agent_length check (user_agent is null or char_length(user_agent) <= 1024),
  constraint ad_clicks_referrer_length check (referrer is null or char_length(referrer) <= 2048),
  constraint ad_clicks_country_format check (country is null or country ~ '^[A-Z]{2}$')
);

create unique index if not exists ad_clicks_click_id_uidx on public.ad_clicks (click_id);
create index if not exists ad_clicks_ip_clicked_at_idx on public.ad_clicks (ip_address, clicked_at desc);
create index if not exists ad_clicks_clicked_at_idx on public.ad_clicks (clicked_at desc);

alter table public.ad_clicks enable row level security;
revoke all on public.ad_clicks from anon, authenticated;
grant select, insert, delete on public.ad_clicks to service_role;

create or replace function public.prune_expired_ad_clicks()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.ad_clicks where clicked_at < now() - interval '60 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.prune_expired_ad_clicks() from public, anon, authenticated;
grant execute on function public.prune_expired_ad_clicks() to service_role;

create or replace function public.prune_ad_clicks_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.prune_expired_ad_clicks();
  return null;
end;
$$;

revoke all on function public.prune_ad_clicks_after_insert() from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'ad_clicks_prune_after_insert'
      and tgrelid = 'public.ad_clicks'::regclass
  ) then
    create trigger ad_clicks_prune_after_insert
      after insert on public.ad_clicks
      for each statement execute function public.prune_ad_clicks_after_insert();
  end if;
end $$;

-- Supabase projects normally provide pg_cron. If it is unavailable, the
-- insert trigger above still enforces the 60-day retention window.
do $$
declare
  job_exists boolean := false;
begin
  begin
    create extension if not exists pg_cron with schema pg_catalog;
  exception
    when insufficient_privilege or undefined_file then
      raise notice 'pg_cron unavailable; insert-trigger cleanup remains active.';
  end;

  if to_regclass('cron.job') is not null then
    execute 'select exists (select 1 from cron.job where jobname = $1)'
      into job_exists using 'prune-ad-clicks-daily';
    if not job_exists then
      perform cron.schedule(
        'prune-ad-clicks-daily',
        '17 3 * * *',
        'select public.prune_expired_ad_clicks();'
      );
    end if;
  end if;
end $$;

comment on table public.ad_clicks is
  'Google Ads landing visits with gclid, gbraid or wbraid; raw IP retained for at most 60 days.';
