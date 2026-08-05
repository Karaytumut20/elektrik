begin;

-- Takvim kayıtları müşteri kartı oluşturulmadan da hızlıca girilebilsin.
-- Mevcut kayıtları ve foreign key ilişkisini korur; yalnızca zorunluluğu kaldırır.
alter table if exists public.appointments
  alter column customer_id drop not null;

commit;
