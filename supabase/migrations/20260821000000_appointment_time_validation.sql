begin;

-- PostgreSQL's check constraint correctly rejects an invalid interval, but its
-- generated error is not meaningful to an admin user. Validate before the
-- constraint so every write path (form, RPC and API) receives a clear message.
create or replace function public.validate_appointment_time_order()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.starts_at is null or new.estimated_ends_at is null then
    raise exception 'Randevu başlangıç ve bitiş saati gereklidir.' using errcode = '22023';
  end if;

  if new.estimated_ends_at <= new.starts_at then
    raise exception 'Randevu bitişi başlangıç saatinden sonra olmalıdır.' using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists appointments_validate_time_order on public.appointments;
create trigger appointments_validate_time_order
before insert or update of starts_at, estimated_ends_at on public.appointments
for each row execute function public.validate_appointment_time_order();

commit;

notify pgrst, 'reload schema';
