-- Takvim, servis, cari ve stok yonetimi.
-- Eklemeli ve tekrar calistirilabilir olacak sekilde tasarlanmistir.

create extension if not exists pgcrypto;

create sequence if not exists public.service_order_number_seq start 1001;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles
  add column if not exists app_role text not null default 'super_admin',
  add column if not exists staff_id uuid;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_type text not null default 'individual' check (customer_type in ('individual', 'corporate')),
  name text not null,
  contact_name text,
  primary_phone text not null,
  secondary_phone text,
  email text,
  tax_number text,
  tax_office text,
  address text,
  city text not null default 'Tekirdag',
  district text not null default 'Corlu',
  map_url text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists customers_primary_phone_active_uidx
  on public.customers (regexp_replace(primary_phone, '\D', '', 'g'))
  where deleted_at is null;
create index if not exists customers_name_idx on public.customers using gin (to_tsvector('simple', name));

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  title text,
  working_days smallint[] not null default array[1,2,3,4,5,6],
  work_start time not null default '08:00',
  work_end time not null default '19:00',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'admin_profiles_staff_id_fkey'
  ) then
    alter table public.admin_profiles
      add constraint admin_profiles_staff_id_fkey
      foreign key (staff_id) references public.staff(id) on delete set null;
  end if;
end $$;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_name text not null,
  description text,
  reported_issue text,
  starts_at timestamptz not null,
  estimated_ends_at timestamptz not null,
  service_address text,
  city text,
  district text,
  map_url text,
  primary_staff_id uuid references public.staff(id) on delete set null,
  assistant_staff_id uuid references public.staff(id) on delete set null,
  priority text not null default 'normal' check (priority in ('normal', 'important', 'urgent')),
  status text not null default 'planned' check (status in (
    'planned', 'customer_called', 'on_the_way', 'started', 'waiting_material',
    'completed', 'cancelled', 'postponed', 'waiting_payment'
  )),
  internal_note text,
  customer_note text,
  reminder_enabled boolean not null default false,
  amount_due numeric(14,2) check (amount_due is null or amount_due >= 0),
  currency text not null default 'TRY' check (currency in ('TRY', 'USD')),
  exchange_rate numeric(14,6) check (exchange_rate is null or exchange_rate > 0),
  exchange_rate_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint appointments_time_order_check check (estimated_ends_at > starts_at)
);

create index if not exists appointments_period_idx on public.appointments (starts_at, estimated_ends_at)
  where deleted_at is null;
create index if not exists appointments_customer_idx on public.appointments (customer_id)
  where deleted_at is null;
create index if not exists appointments_primary_staff_idx on public.appointments (primary_staff_id, starts_at)
  where deleted_at is null and status <> 'cancelled';

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text unique,
  order_number text not null unique default (
    'IE-' || to_char(current_date, 'YYYY') || '-' ||
    lpad(nextval('public.service_order_number_seq')::text, 6, '0')
  ),
  appointment_id uuid unique references public.appointments(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_name text not null,
  started_at timestamptz,
  finished_at timestamptz,
  labor_hours numeric(10,2) not null default 0 check (labor_hours >= 0),
  labor_cost numeric(14,2) not null default 0 check (labor_cost >= 0),
  labor_sale numeric(14,2) not null default 0 check (labor_sale >= 0),
  currency text not null default 'TRY' check (currency in ('TRY', 'USD')),
  transport_cost numeric(14,2) not null default 0 check (transport_cost >= 0),
  extra_staff_cost numeric(14,2) not null default 0 check (extra_staff_cost >= 0),
  other_cost numeric(14,2) not null default 0 check (other_cost >= 0),
  discount numeric(14,2) not null default 0 check (discount >= 0),
  tax_rate numeric(7,4) not null default 0 check (tax_rate between 0 and 100),
  tax_amount numeric(14,2) not null default 0,
  material_cost_total numeric(14,2) not null default 0,
  material_sale_total numeric(14,2) not null default 0,
  total_cost numeric(14,2) not null default 0,
  grand_total numeric(14,2) not null default 0,
  paid_amount numeric(14,2) not null default 0,
  net_profit numeric(14,2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'started', 'waiting_material', 'completed', 'cancelled')),
  technician_note text,
  customer_note text,
  exchange_rate numeric(14,6) check (exchange_rate is null or exchange_rate > 0),
  exchange_rate_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.appointments
  add column if not exists exchange_rate numeric(14,6),
  add column if not exists exchange_rate_date date;
alter table public.service_orders
  add column if not exists idempotency_key text;
create unique index if not exists service_orders_idempotency_key_uidx
  on public.service_orders (idempotency_key) where idempotency_key is not null;

create index if not exists service_orders_customer_idx on public.service_orders (customer_id)
  where deleted_at is null;
create index if not exists service_orders_status_idx on public.service_orders (status)
  where deleted_at is null;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  brand text,
  model text,
  barcode text,
  sku text,
  unit text not null default 'adet',
  stock_quantity numeric(14,3) not null default 0 check (stock_quantity >= 0),
  minimum_stock numeric(14,3) not null default 0 check (minimum_stock >= 0),
  unit_purchase_price numeric(14,2) not null default 0 check (unit_purchase_price >= 0),
  unit_sale_price numeric(14,2) check (unit_sale_price is null or unit_sale_price >= 0),
  supplier_name text,
  purchase_date date,
  document_number text,
  warranty_months integer check (warranty_months is null or warranty_months >= 0),
  storage_location text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists inventory_items_sku_active_uidx on public.inventory_items (sku)
  where sku is not null and deleted_at is null;
create unique index if not exists inventory_items_barcode_active_uidx on public.inventory_items (barcode)
  where barcode is not null and deleted_at is null;

create table if not exists public.service_order_materials (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete restrict,
  material_id uuid references public.inventory_items(id) on delete set null,
  name text not null,
  category text,
  brand text,
  model text,
  serial_number text,
  unit text not null default 'adet',
  quantity numeric(14,3) not null check (quantity > 0),
  unit_purchase_price numeric(14,2) not null default 0 check (unit_purchase_price >= 0),
  total_purchase_cost numeric(14,2) not null default 0,
  unit_sale_price numeric(14,2) check (unit_sale_price is null or unit_sale_price >= 0),
  total_sale_price numeric(14,2) not null default 0,
  profit numeric(14,2) not null default 0,
  supplier_name text,
  purchase_date date,
  document_number text,
  warranty_months integer check (warranty_months is null or warranty_months >= 0),
  warranty_start_date date,
  warranty_end_date date,
  description text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists service_order_materials_order_idx
  on public.service_order_materials (service_order_id) where deleted_at is null;

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references public.inventory_items(id) on delete restrict,
  movement_type text not null check (movement_type in ('in', 'out', 'adjustment', 'return')),
  quantity numeric(14,3) not null check (quantity > 0),
  source_table text,
  source_id uuid,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists inventory_movements_source_uidx
  on public.inventory_movements (material_id, movement_type, source_table, source_id)
  where source_id is not null;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_order_id uuid references public.service_orders(id) on delete restrict,
  paid_at timestamptz not null default now(),
  amount numeric(14,2) not null check (amount > 0),
  currency text not null check (currency in ('TRY', 'USD')),
  method text not null check (method in ('cash', 'credit_card', 'bank_transfer', 'eft', 'check', 'other')),
  reference_number text,
  collected_by uuid references public.staff(id) on delete set null,
  description text,
  exchange_rate numeric(14,6) check (exchange_rate is null or exchange_rate > 0),
  exchange_rate_date date,
  idempotency_key text unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  voided_at timestamptz,
  voided_by uuid references auth.users(id) on delete set null
);

create index if not exists payments_order_idx on public.payments (service_order_id)
  where voided_at is null;
create index if not exists payments_customer_idx on public.payments (customer_id)
  where voided_at is null;

create table if not exists public.customer_notes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.service_order_files (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  file_kind text not null check (file_kind in ('before_photo', 'after_photo', 'document')),
  storage_path text not null unique,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  body text,
  target_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated by default as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_target_idx on public.audit_logs (target_table, target_id, created_at desc);

create table if not exists public.exchange_rates (
  rate_date date not null,
  base_currency text not null default 'USD',
  quote_currency text not null default 'TRY',
  rate numeric(14,6) not null check (rate > 0),
  source text not null default 'TCMB',
  fetched_at timestamptz not null default now(),
  primary key (rate_date, base_currency, quote_currency)
);

create or replace function public.app_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when app_role = 'admin' then 'super_admin'
    else app_role
  end
  from public.admin_profiles
  where user_id = auth.uid() and is_active = true
$$;

create or replace function public.is_active_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select public.app_admin_role() is not null $$;

create or replace function public.can_manage_operations()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.app_admin_role() in ('super_admin','manager','editor','support','service_staff'), false) $$;

create or replace function public.can_manage_finance()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.app_admin_role() in ('super_admin','manager','editor'), false) $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array['admin_profiles','customers','staff','appointments','service_orders','inventory_items']
  loop
    if not exists (
      select 1 from pg_trigger
      where tgname = table_name || '_touch_updated_at'
        and tgrelid = ('public.' || table_name)::regclass
    ) then
      execute format(
        'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
        table_name || '_touch_updated_at', table_name
      );
    end if;
  end loop;
end $$;

create or replace function public.assert_no_staff_conflict(
  p_staff_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_exclude_appointment uuid default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_staff_id is null then return; end if;
  if exists (
    select 1 from public.appointments a
    where a.deleted_at is null
      and a.status <> 'cancelled'
      and a.id is distinct from p_exclude_appointment
      and (a.primary_staff_id = p_staff_id or a.assistant_staff_id = p_staff_id)
      and p_starts_at < a.estimated_ends_at
      and p_ends_at > a.starts_at
  ) then
    raise exception 'Personelin bu saat araliginda baska bir randevusu var.';
  end if;
end $$;

create or replace function public.recompute_service_order(p_service_order_id uuid)
returns public.service_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.service_orders;
  v_material_cost_try numeric(14,2);
  v_material_sale numeric(14,2);
  v_cost_order_currency numeric(14,2);
  v_taxable numeric(14,2);
  v_tax numeric(14,2);
  v_total numeric(14,2);
  v_paid numeric(14,2);
begin
  select * into v_order from public.service_orders where id = p_service_order_id for update;
  if not found then raise exception 'Is emri bulunamadi.'; end if;

  select coalesce(sum(total_purchase_cost),0), coalesce(sum(total_sale_price),0)
  into v_material_cost_try, v_material_sale
  from public.service_order_materials
  where service_order_id = p_service_order_id and deleted_at is null;

  v_cost_order_currency := v_material_cost_try + v_order.labor_cost + v_order.transport_cost
    + v_order.extra_staff_cost + v_order.other_cost;
  if v_order.currency = 'USD' then
    if coalesce(v_order.exchange_rate, 0) <= 0 then
      raise exception 'USD is emri icin gecerli kur gereklidir.';
    end if;
    v_cost_order_currency := round(v_cost_order_currency / v_order.exchange_rate, 2);
  end if;

  v_taxable := greatest(0, v_material_sale + v_order.labor_sale - v_order.discount);
  v_tax := round(v_taxable * v_order.tax_rate / 100, 2);
  v_total := v_taxable + v_tax;

  select coalesce(sum(
    case
      when p.currency = v_order.currency then p.amount
      when p.currency = 'USD' and v_order.currency = 'TRY' then p.amount * p.exchange_rate
      when p.currency = 'TRY' and v_order.currency = 'USD' then p.amount / p.exchange_rate
      else 0
    end
  ),0)
  into v_paid
  from public.payments p
  where p.service_order_id = p_service_order_id and p.voided_at is null;

  update public.service_orders
  set material_cost_total = v_material_cost_try,
      material_sale_total = v_material_sale,
      total_cost = v_cost_order_currency,
      tax_amount = v_tax,
      grand_total = v_total,
      paid_amount = round(v_paid,2),
      net_profit = v_total - v_cost_order_currency
  where id = p_service_order_id
  returning * into v_order;
  return v_order;
end $$;

create or replace function public.ensure_service_order_for_appointment(p_appointment_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_appointment public.appointments;
  v_order_id uuid;
begin
  select * into v_appointment from public.appointments where id = p_appointment_id for update;
  if not found then raise exception 'Randevu bulunamadi.'; end if;

  select id into v_order_id from public.service_orders where appointment_id = p_appointment_id;
  if v_order_id is null and (
    coalesce(v_appointment.amount_due, 0) > 0 or v_appointment.status in ('started','completed')
  ) then
    insert into public.service_orders (
      appointment_id, customer_id, service_name, started_at, finished_at,
      labor_sale, currency, exchange_rate, exchange_rate_date, status, technician_note, customer_note, created_by
    ) values (
      v_appointment.id, v_appointment.customer_id, v_appointment.service_name,
      case when v_appointment.status in ('started','completed') then v_appointment.starts_at end,
      case when v_appointment.status = 'completed' then coalesce(v_appointment.estimated_ends_at, now()) end,
      coalesce(v_appointment.amount_due,0), v_appointment.currency,
      v_appointment.exchange_rate, v_appointment.exchange_rate_date,
      case when v_appointment.status = 'completed' then 'completed'
           when v_appointment.status = 'started' then 'started' else 'draft' end,
      v_appointment.internal_note, v_appointment.customer_note, auth.uid()
    )
    returning id into v_order_id;
  elsif v_order_id is not null then
    update public.service_orders
    set customer_id = v_appointment.customer_id,
        service_name = v_appointment.service_name,
        labor_sale = coalesce(v_appointment.amount_due,0),
        currency = v_appointment.currency,
        exchange_rate = coalesce(v_appointment.exchange_rate, exchange_rate),
        exchange_rate_date = coalesce(v_appointment.exchange_rate_date, exchange_rate_date),
        technician_note = v_appointment.internal_note,
        customer_note = v_appointment.customer_note,
        status = case
          when v_appointment.status = 'completed' then 'completed'
          when v_appointment.status = 'started' and status = 'draft' then 'started'
          else status end,
        finished_at = case when v_appointment.status = 'completed'
          then coalesce(finished_at, v_appointment.estimated_ends_at, now()) else finished_at end
    where id = v_order_id;
  end if;

  if v_order_id is not null then perform public.recompute_service_order(v_order_id); end if;
  return v_order_id;
end $$;

create or replace function public.appointment_sync_trigger()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_no_staff_conflict(new.primary_staff_id, new.starts_at, new.estimated_ends_at, new.id);
  perform public.assert_no_staff_conflict(new.assistant_staff_id, new.starts_at, new.estimated_ends_at, new.id);
  perform public.ensure_service_order_for_appointment(new.id);
  return new;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'appointments_sync_order') then
    create constraint trigger appointments_sync_order
      after insert or update on public.appointments
      deferrable initially immediate
      for each row execute function public.appointment_sync_trigger();
  end if;
end $$;

create or replace function public.service_order_sync_appointment_trigger()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.appointment_id is not null and new.status = 'completed'
     and old.status is distinct from new.status then
    update public.appointments
    set status = 'completed'
    where id = new.appointment_id and status <> 'completed';
  end if;
  return new;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'service_orders_sync_appointment') then
    create trigger service_orders_sync_appointment
      after update of status on public.service_orders
      for each row execute function public.service_order_sync_appointment_trigger();
  end if;
end $$;

create or replace function public.add_service_order_material(
  p_service_order_id uuid,
  p_material_id uuid,
  p_name text,
  p_category text,
  p_brand text,
  p_model text,
  p_serial_number text,
  p_unit text,
  p_quantity numeric,
  p_unit_purchase_price numeric,
  p_unit_sale_price numeric,
  p_supplier_name text,
  p_purchase_date date,
  p_document_number text,
  p_warranty_months integer,
  p_warranty_start_date date,
  p_description text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock public.inventory_items;
  v_id uuid;
  v_name text;
  v_start date;
begin
  if not public.can_manage_operations() then raise exception 'Yetkisiz islem.'; end if;
  if p_quantity <= 0 then raise exception 'Miktar sifirdan buyuk olmalidir.'; end if;

  if p_material_id is not null then
    select * into v_stock from public.inventory_items where id = p_material_id and deleted_at is null for update;
    if not found then raise exception 'Stok malzemesi bulunamadi.'; end if;
    if v_stock.stock_quantity < p_quantity then raise exception 'Yetersiz stok.'; end if;
    update public.inventory_items set stock_quantity = stock_quantity - p_quantity where id = p_material_id;
  end if;

  v_name := coalesce(nullif(trim(p_name),''), v_stock.name);
  if v_name is null then raise exception 'Malzeme adi gereklidir.'; end if;
  v_start := coalesce(p_warranty_start_date, p_purchase_date, v_stock.purchase_date);

  insert into public.service_order_materials (
    service_order_id, material_id, name, category, brand, model, serial_number, unit, quantity,
    unit_purchase_price, total_purchase_cost, unit_sale_price, total_sale_price, profit,
    supplier_name, purchase_date, document_number, warranty_months, warranty_start_date,
    warranty_end_date, description
  ) values (
    p_service_order_id, p_material_id, v_name,
    coalesce(p_category,v_stock.category), coalesce(p_brand,v_stock.brand), coalesce(p_model,v_stock.model),
    p_serial_number, coalesce(nullif(p_unit,''),v_stock.unit,'adet'), p_quantity,
    coalesce(p_unit_purchase_price,v_stock.unit_purchase_price,0),
    round(p_quantity * coalesce(p_unit_purchase_price,v_stock.unit_purchase_price,0),2),
    coalesce(p_unit_sale_price,v_stock.unit_sale_price),
    round(p_quantity * coalesce(p_unit_sale_price,v_stock.unit_sale_price,0),2),
    round(p_quantity * (coalesce(p_unit_sale_price,v_stock.unit_sale_price,0)
      - coalesce(p_unit_purchase_price,v_stock.unit_purchase_price,0)),2),
    coalesce(p_supplier_name,v_stock.supplier_name), coalesce(p_purchase_date,v_stock.purchase_date),
    coalesce(p_document_number,v_stock.document_number), coalesce(p_warranty_months,v_stock.warranty_months),
    v_start,
    case when coalesce(p_warranty_months,v_stock.warranty_months) is not null and v_start is not null
      then (v_start + make_interval(months => coalesce(p_warranty_months,v_stock.warranty_months)))::date end,
    p_description
  ) returning id into v_id;

  if p_material_id is not null then
    insert into public.inventory_movements (
      material_id, movement_type, quantity, source_table, source_id, description, created_by
    ) values (p_material_id, 'out', p_quantity, 'service_order_materials', v_id, 'Is emrinde kullanildi', auth.uid());
  end if;

  perform public.recompute_service_order(p_service_order_id);
  insert into public.audit_logs(actor_id,action,target_table,target_id,new_values)
    values(auth.uid(),'create','service_order_materials',v_id::text,jsonb_build_object('service_order_id',p_service_order_id,'quantity',p_quantity));
  return v_id;
end $$;

create or replace function public.record_payment(
  p_customer_id uuid,
  p_service_order_id uuid,
  p_paid_at timestamptz,
  p_amount numeric,
  p_currency text,
  p_method text,
  p_reference_number text,
  p_collected_by uuid,
  p_description text,
  p_exchange_rate numeric,
  p_exchange_rate_date date,
  p_idempotency_key text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.service_orders;
  v_amount_in_order_currency numeric(14,2);
  v_remaining numeric(14,2);
  v_id uuid;
begin
  if not public.can_manage_finance() then raise exception 'Finans islemi icin yetkiniz yok.'; end if;
  if p_amount <= 0 then raise exception 'Tahsilat sifirdan buyuk olmalidir.'; end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then raise exception 'Gecersiz islem anahtari.'; end if;

  select id into v_id from public.payments where idempotency_key = p_idempotency_key;
  if v_id is not null then return v_id; end if;

  if p_service_order_id is not null then
    select * into v_order from public.service_orders where id = p_service_order_id for update;
    if not found or v_order.deleted_at is not null or v_order.status = 'cancelled' then
      raise exception 'Tahsilata uygun is emri bulunamadi.';
    end if;
    if v_order.customer_id <> p_customer_id then raise exception 'Musteri ve is emri uyusmuyor.'; end if;
    v_amount_in_order_currency := case
      when p_currency = v_order.currency then p_amount
      when p_currency = 'USD' and v_order.currency = 'TRY' then p_amount * p_exchange_rate
      when p_currency = 'TRY' and v_order.currency = 'USD' then p_amount / p_exchange_rate
    end;
    if v_amount_in_order_currency is null then raise exception 'Para birimi donusumu icin kur gereklidir.'; end if;
    v_remaining := greatest(0, v_order.grand_total - v_order.paid_amount);
    if round(v_amount_in_order_currency,2) > v_remaining + 0.01 then raise exception 'Tahsilat kalan tutari asamaz.'; end if;
  end if;

  insert into public.payments (
    customer_id, service_order_id, paid_at, amount, currency, method, reference_number,
    collected_by, description, exchange_rate, exchange_rate_date, idempotency_key, created_by
  ) values (
    p_customer_id, p_service_order_id, coalesce(p_paid_at,now()), p_amount, p_currency, p_method,
    nullif(trim(p_reference_number),''), p_collected_by, p_description, p_exchange_rate,
    p_exchange_rate_date, p_idempotency_key, auth.uid()
  ) returning id into v_id;

  if p_service_order_id is not null then perform public.recompute_service_order(p_service_order_id); end if;
  insert into public.audit_logs(actor_id,action,target_table,target_id,new_values)
    values(auth.uid(),'create','payments',v_id::text,jsonb_build_object('service_order_id',p_service_order_id,'amount',p_amount,'currency',p_currency));
  return v_id;
end $$;

create or replace function public.create_quick_service_order(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text := nullif(trim(p_payload->>'idempotency_key'),'');
  v_customer_id uuid := (p_payload->>'customer_id')::uuid;
  v_currency text := coalesce(nullif(p_payload->>'currency',''),'TRY');
  v_rate numeric := nullif(p_payload->>'exchange_rate','')::numeric;
  v_rate_date date := nullif(p_payload->>'exchange_rate_date','')::date;
  v_appointment_id uuid;
  v_order_id uuid;
  v_order public.service_orders;
  v_material_id uuid := nullif(p_payload->>'material_id','')::uuid;
  v_quantity numeric := coalesce(nullif(p_payload->>'material_quantity','')::numeric,0);
begin
  if not public.can_manage_operations() then raise exception 'Yetkisiz islem.'; end if;
  if v_key is null or length(v_key) < 8 then raise exception 'Gecersiz islem anahtari.'; end if;
  select id into v_order_id from public.service_orders where idempotency_key = v_key;
  if v_order_id is not null then return v_order_id; end if;
  if coalesce(trim(p_payload->>'service_name'),'') = '' then raise exception 'Hizmet adi gereklidir.'; end if;
  if v_currency = 'USD' and coalesce(v_rate,0) <= 0 then raise exception 'USD islemi icin kur gereklidir.'; end if;

  if nullif(p_payload->>'appointment_starts_at','') is not null then
    insert into public.appointments (
      customer_id, service_name, starts_at, estimated_ends_at, status, priority,
      amount_due, currency, exchange_rate, exchange_rate_date, created_by
    ) values (
      v_customer_id, p_payload->>'service_name',
      (p_payload->>'appointment_starts_at')::timestamptz,
      (p_payload->>'appointment_ends_at')::timestamptz,
      'planned', 'normal', coalesce(nullif(p_payload->>'labor_sale','')::numeric,0),
      v_currency, v_rate, v_rate_date, auth.uid()
    ) returning id into v_appointment_id;
    select id into v_order_id from public.service_orders where appointment_id = v_appointment_id;
    if v_order_id is null then
      insert into public.service_orders (
        appointment_id, customer_id, service_name, labor_sale, currency,
        exchange_rate, exchange_rate_date, status, technician_note, created_by
      ) values (
        v_appointment_id, v_customer_id, p_payload->>'service_name',
        coalesce(nullif(p_payload->>'labor_sale','')::numeric,0), v_currency,
        v_rate, v_rate_date, 'draft', p_payload->>'technician_note', auth.uid()
      ) returning id into v_order_id;
    end if;
    update public.service_orders set idempotency_key = v_key where id = v_order_id;
  else
    insert into public.service_orders (
      idempotency_key, customer_id, service_name, labor_sale, currency,
      exchange_rate, exchange_rate_date, status, technician_note, created_by
    ) values (
      v_key, v_customer_id, p_payload->>'service_name',
      coalesce(nullif(p_payload->>'labor_sale','')::numeric,0), v_currency,
      v_rate, v_rate_date, coalesce(nullif(p_payload->>'status',''),'draft'),
      p_payload->>'technician_note', auth.uid()
    ) returning id into v_order_id;
    perform public.recompute_service_order(v_order_id);
  end if;

  if v_quantity > 0 and (v_material_id is not null or nullif(trim(p_payload->>'material_name'),'') is not null) then
    perform public.add_service_order_material(
      v_order_id, v_material_id, p_payload->>'material_name', null, null, null, null, 'adet',
      v_quantity, null, null, null, null, null, null, null, 'Hizli islem ile eklendi'
    );
  end if;

  select * into v_order from public.recompute_service_order(v_order_id);
  if coalesce((p_payload->>'paid')::boolean,false) and v_order.grand_total > 0 then
    if not public.can_manage_finance() then raise exception 'Pesin tahsilat icin finans yetkisi gereklidir.'; end if;
    perform public.record_payment(
      v_customer_id, v_order_id, now(), v_order.grand_total, v_order.currency,
      coalesce(nullif(p_payload->>'payment_method',''),'cash'), null, null,
      'Hizli islem pesin tahsilati', v_order.exchange_rate, v_order.exchange_rate_date,
      v_key || '-payment'
    );
  end if;
  return v_order_id;
end $$;

create or replace function public.remove_service_order_material(p_material_row_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.service_order_materials;
begin
  if not public.can_manage_operations() then raise exception 'Yetkisiz islem.'; end if;
  select * into v_row from public.service_order_materials
    where id = p_material_row_id and deleted_at is null for update;
  if not found then raise exception 'Malzeme kaydi bulunamadi.'; end if;
  update public.service_order_materials set deleted_at = now() where id = p_material_row_id;
  if v_row.material_id is not null then
    update public.inventory_items set stock_quantity = stock_quantity + v_row.quantity
      where id = v_row.material_id;
    insert into public.inventory_movements(
      material_id,movement_type,quantity,source_table,source_id,description,created_by
    ) values (
      v_row.material_id,'return',v_row.quantity,'service_order_materials',v_row.id,
      'Is emri malzemesi geri alindi',auth.uid()
    );
  end if;
  perform public.recompute_service_order(v_row.service_order_id);
  insert into public.audit_logs(actor_id,action,target_table,target_id,old_values)
    values(auth.uid(),'soft_delete','service_order_materials',v_row.id::text,
      jsonb_build_object('service_order_id',v_row.service_order_id,'quantity',v_row.quantity));
end $$;

create or replace function public.void_payment(p_payment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments;
begin
  if not public.can_manage_finance() then raise exception 'Finans islemi icin yetkiniz yok.'; end if;
  select * into v_payment from public.payments
    where id = p_payment_id and voided_at is null for update;
  if not found then raise exception 'Gecerli tahsilat bulunamadi.'; end if;
  update public.payments set voided_at = now(), voided_by = auth.uid() where id = p_payment_id;
  if v_payment.service_order_id is not null then
    perform public.recompute_service_order(v_payment.service_order_id);
  end if;
  insert into public.audit_logs(actor_id,action,target_table,target_id,old_values)
    values(auth.uid(),'void','payments',v_payment.id::text,
      jsonb_build_object('service_order_id',v_payment.service_order_id,'amount',v_payment.amount,'currency',v_payment.currency));
end $$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'admin_profiles','customers','staff','appointments','service_orders','inventory_items',
    'service_order_materials','inventory_movements','payments','customer_notes',
    'service_order_files','notifications','audit_logs','exchange_rates'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename=table_name and policyname='active_admin_read'
    ) then
      execute format(
        'create policy active_admin_read on public.%I for select to authenticated using (public.is_active_admin())',
        table_name
      );
    end if;
    if not exists (
      select 1 from pg_policies where schemaname='public' and tablename=table_name and policyname='manager_write'
    ) then
      if table_name = 'admin_profiles' then
        execute format(
          'create policy manager_write on public.%I for all to authenticated using (public.app_admin_role() = ''super_admin'') with check (public.app_admin_role() = ''super_admin'')',
          table_name
        );
      else
        execute format(
          'create policy manager_write on public.%I for all to authenticated using (public.can_manage_operations()) with check (public.can_manage_operations())',
          table_name
        );
      end if;
    end if;
  end loop;
end $$;

revoke all on public.customers, public.staff, public.appointments, public.service_orders,
  public.inventory_items, public.service_order_materials, public.inventory_movements,
  public.payments, public.customer_notes, public.service_order_files, public.notifications,
  public.audit_logs, public.exchange_rates from anon, authenticated;

revoke execute on function public.recompute_service_order(uuid) from public, anon, authenticated;
revoke execute on function public.ensure_service_order_for_appointment(uuid) from public, anon, authenticated;
revoke execute on function public.appointment_sync_trigger() from public, anon, authenticated;
revoke execute on function public.service_order_sync_appointment_trigger() from public, anon, authenticated;
revoke execute on function public.add_service_order_material(
  uuid,uuid,text,text,text,text,text,text,numeric,numeric,numeric,text,date,text,integer,date,text
) from public, anon;
revoke execute on function public.record_payment(
  uuid,uuid,timestamptz,numeric,text,text,text,uuid,text,numeric,date,text
) from public, anon;
revoke execute on function public.create_quick_service_order(jsonb) from public, anon;
revoke execute on function public.remove_service_order_material(uuid) from public, anon;
revoke execute on function public.void_payment(uuid) from public, anon;

grant execute on function public.add_service_order_material(
  uuid,uuid,text,text,text,text,text,text,numeric,numeric,numeric,text,date,text,integer,date,text
) to authenticated;
grant execute on function public.record_payment(
  uuid,uuid,timestamptz,numeric,text,text,text,uuid,text,numeric,date,text
) to authenticated;
grant execute on function public.create_quick_service_order(jsonb) to authenticated;
grant execute on function public.remove_service_order_material(uuid) to authenticated;
grant execute on function public.void_payment(uuid) to authenticated;
grant execute on function public.assert_no_staff_conflict(uuid,timestamptz,timestamptz,uuid) to authenticated;
grant execute on function public.recompute_service_order(uuid) to service_role;
grant execute on function public.ensure_service_order_for_appointment(uuid) to service_role;
grant all privileges on all tables in schema public to service_role;
grant usage, select on sequence public.service_order_number_seq to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-files', 'service-files', false, 10485760,
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
