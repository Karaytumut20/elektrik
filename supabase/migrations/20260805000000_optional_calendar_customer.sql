begin;

-- Takvim kayıtları müşteri kartı oluşturulmadan da hızlıca girilebilsin.
-- Mevcut kayıtları ve foreign key ilişkisini korur; yalnızca zorunluluğu kaldırır.
alter table if exists public.appointments
  alter column customer_id drop not null;

-- Müşterisiz takvim kaydı başlatıldığında/tamamlandığında zorunlu müşteri isteyen
-- iş emri tablosuna NULL yazmaya çalışma. Müşteri sonradan seçildiğinde normal
-- otomatik iş emri akışı devam eder.
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
  if v_order_id is null and v_appointment.customer_id is not null and (
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
    set customer_id = coalesce(v_appointment.customer_id, customer_id),
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

commit;

notify pgrst, 'reload schema';
