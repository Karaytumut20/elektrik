-- Create contact submissions table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Create policy for public insert (anonymous users can submit contact form)
drop policy if exists "Public can insert contact submissions" on public.contact_submissions;
create policy "Public can insert contact submissions"
on public.contact_submissions
for insert
with check (true);

-- Create policy for authenticated admins (admins can read/delete contact submissions)
drop policy if exists "Active admins can read all contact submissions" on public.contact_submissions;
create policy "Active admins can read all contact submissions"
on public.contact_submissions
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

drop policy if exists "Active admins can delete contact submissions" on public.contact_submissions;
create policy "Active admins can delete contact submissions"
on public.contact_submissions
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

-- Grant privileges
grant usage on schema public to anon, authenticated;
grant select on public.contact_submissions to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant delete on public.contact_submissions to authenticated;
