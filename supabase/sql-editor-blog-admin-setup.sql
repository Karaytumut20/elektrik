create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default 'Admin',
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

insert into public.admin_profiles (user_id, email, display_name, role, is_active)
values (
  '2a21f73c-5721-45e4-a32c-2de5bacf9514',
  'admin@voltaelektrik.local',
  'Admin',
  'admin',
  true
)
on conflict (user_id) do update
set
  email = excluded.email,
  display_name = excluded.display_name,
  role = excluded.role,
  is_active = excluded.is_active,
  updated_at = now();

alter table public.admin_profiles enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Admins can read own admin profile" on public.admin_profiles;
create policy "Admins can read own admin profile"
on public.admin_profiles
for select
to authenticated
using (user_id = auth.uid() and is_active = true);

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts
for select
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

drop policy if exists "Active admins can read all blog posts" on public.blog_posts;
create policy "Active admins can read all blog posts"
on public.blog_posts
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.is_active = true
  )
);

drop policy if exists "Active admins can insert blog posts" on public.blog_posts;
create policy "Active admins can insert blog posts"
on public.blog_posts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.is_active = true
  )
);

drop policy if exists "Active admins can update blog posts" on public.blog_posts;
create policy "Active admins can update blog posts"
on public.blog_posts
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.is_active = true
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.is_active = true
  )
);

drop policy if exists "Active admins can delete blog posts" on public.blog_posts;
create policy "Active admins can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.is_active = true
  )
);

grant usage on schema public to anon, authenticated;
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant select on public.admin_profiles to authenticated;

notify pgrst, 'reload schema';
