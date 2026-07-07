-- DİKKAT: Bu kod public şemasındaki tabloları temizleyip SADECE projenizin
-- ihtiyaç duyduğu (admin_profiles, blog_posts, contact_submissions) tabloları sıfırdan kurar.
-- 
-- Eğer 0'dan temiz bir kurulum istiyorsanız, tüm public objelerini silmek için aşağıdaki
-- bloğu çalıştırın. Kendi tablolarınız dışındaki (Supabase'in varsayılan veya test için açtığınız) 
-- tüm fazlalık tablolar temizlenecektir.

DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Tüm tabloları sil
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
  -- Tüm görünümleri sil
  FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
  END LOOP;
  -- Tüm fonksiyonları sil
  FOR r IN (SELECT proname, pg_get_function_identity_arguments(p.oid) as args 
            FROM pg_proc p 
            JOIN pg_namespace n ON p.pronamespace = n.oid 
            WHERE n.nspname = 'public') LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
  END LOOP;
END $$;

create extension if not exists pgcrypto schema extensions;

-- 1. Admin Profilleri Tablosu
create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default 'Admin',
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Blog Yazıları Tablosu
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. İletişim Formu Tablosu (ip_address kolonu spam koruması için eklendi)
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  message text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

-- Güncelleme Triggerları (Updated At)
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger set_blog_posts_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

-- Spam Koruması Trigger'ı (Aynı IP'den son 24 saat içinde en fazla 50 form gönderme limiti)
create or replace function public.check_contact_spam() returns trigger language plpgsql as $$
declare
  recent_count int;
begin
  if new.ip_address is not null then
    select count(*) into recent_count from public.contact_submissions
    where ip_address = new.ip_address and created_at > now() - interval '24 hours';
    if recent_count >= 50 then
      raise exception 'Spam limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
    end if;
  end if;
  return new;
end;
$$;

create trigger enforce_contact_spam_limit before insert on public.contact_submissions for each row execute function public.check_contact_spam();

-- RLS (Row Level Security) Aktifleştirme
alter table public.admin_profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_submissions enable row level security;

-- Admin Okuma Yetkisi (Kendi profilini görmesi için)
create policy "Admins can read own admin profile" on public.admin_profiles for select to authenticated using (user_id = auth.uid() and is_active = true);

-- Blog Yetkileri
create policy "Public can read published blog posts" on public.blog_posts for select using (status = 'published' and published_at is not null and published_at <= now());
create policy "Active admins can read all blog posts" on public.blog_posts for select to authenticated using (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));
create policy "Active admins can insert blog posts" on public.blog_posts for insert to authenticated with check (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));
create policy "Active admins can update blog posts" on public.blog_posts for update to authenticated using (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true)) with check (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));
create policy "Active admins can delete blog posts" on public.blog_posts for delete to authenticated using (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));

-- İletişim Formu Yetkileri
create policy "Public can insert contact submissions" on public.contact_submissions for insert with check (true);
create policy "Active admins can read all contact submissions" on public.contact_submissions for select to authenticated using (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));
create policy "Active admins can delete contact submissions" on public.contact_submissions for delete to authenticated using (exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.is_active = true));

-- Veritabanı İzinleri
grant usage on schema public to anon, authenticated;
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant select on public.admin_profiles to authenticated;
grant select on public.contact_submissions to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant delete on public.contact_submissions to authenticated;
grant all privileges on public.contact_submissions to service_role;
grant all privileges on public.blog_posts to service_role;
grant all privileges on public.admin_profiles to service_role;
notify pgrst, 'reload schema';

-- Varsayılan Admin Kullanıcılarını Ekle (Giriş yapabilmeniz için auth.users kısmına ekleniyor)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
select
  '00000000-0000-0000-0000-000000000000', '2a21f73c-5721-45e4-a32c-2de5bacf9514', 'authenticated', 'authenticated', 'admin@voltaelektrik.local', crypt('voltaadmin123!', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''
where not exists (
  select 1 from auth.users where id = '2a21f73c-5721-45e4-a32c-2de5bacf9514'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
select
  '00000000-0000-0000-0000-000000000000', '4a59ec38-5367-454e-9be8-1c72e1553372', 'authenticated', 'authenticated', 'inallarelektrik@gmail.com', crypt('inallarelektrik.1', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''
where not exists (
  select 1 from auth.users where id = '4a59ec38-5367-454e-9be8-1c72e1553372'
);

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  '2a21f73c-5721-45e4-a32c-2de5bacf9514', '2a21f73c-5721-45e4-a32c-2de5bacf9514', '2a21f73c-5721-45e4-a32c-2de5bacf9514', jsonb_build_object('sub', '2a21f73c-5721-45e4-a32c-2de5bacf9514', 'email', 'admin@voltaelektrik.local'), 'email', now(), now(), now()
where not exists (
  select 1 from auth.identities where user_id = '2a21f73c-5721-45e4-a32c-2de5bacf9514'
);

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  '4a59ec38-5367-454e-9be8-1c72e1553372', '4a59ec38-5367-454e-9be8-1c72e1553372', '4a59ec38-5367-454e-9be8-1c72e1553372', jsonb_build_object('sub', '4a59ec38-5367-454e-9be8-1c72e1553372', 'email', 'inallarelektrik@gmail.com'), 'email', now(), now(), now()
where not exists (
  select 1 from auth.identities where user_id = '4a59ec38-5367-454e-9be8-1c72e1553372'
);

insert into public.admin_profiles (user_id, email, display_name, role, is_active)
values ('2a21f73c-5721-45e4-a32c-2de5bacf9514', 'admin@voltaelektrik.local', 'Admin', 'admin', true)
on conflict (user_id) do update
set email = excluded.email, display_name = excluded.display_name, role = excluded.role, is_active = excluded.is_active, updated_at = now();

insert into public.admin_profiles (user_id, email, display_name, role, is_active)
values ('4a59ec38-5367-454e-9be8-1c72e1553372', 'inallarelektrik@gmail.com', 'İnallar Elektrik', 'admin', true)
on conflict (user_id) do update
set email = excluded.email, display_name = excluded.display_name, role = excluded.role, is_active = excluded.is_active, updated_at = now();
