# Volta Elektrik Supabase Kurulumu

Bu proje Supabase'i yalnizca iki is icin kullanir:

- Admin giris/cikis islemleri
- Blog yazisi ekleme, duzenleme, silme ve yayin/taslak yonetimi

## Ortam degiskenleri

`.env.example` dosyasindaki alanlari yeni Supabase projenizden aldiginiz bilgilerle doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` yalnizca server tarafinda kullanilmalidir. Client component veya public JavaScript icine tasinmamalidir.

## Operasyon yonetimi migration sirasi

Mevcut blog ve iletisim migrationlari uygulandiktan sonra:

1. `migrations/20260728000000_operations_management.sql`
2. `migrations/20260803000000_ad_click_tracking.sql`
3. `migrations/20260805000000_optional_calendar_customer.sql`
4. `migrations/20260821000000_appointment_time_validation.sql`
5. `migrations/20260821010000_calendar_work_order_integration.sql`

Bu migration eklemelidir; mevcut blog, iletisim ve admin kayitlarini silmez. Musteri, personel,
randevu, is emri, stok, tahsilat, dosya, kur ve audit tablolarini; transaction fonksiyonlarini;
RLS kurallarini ve private `service-files` bucket yapilandirmasini ekler.

Uygulamadan once Supabase SQL Editor veya CLI uzerinden hedef projenin dogru oldugunu kontrol edin.
Migration uygulandiktan sonra mevcut `admin_profiles` satirlarina `app_role = 'super_admin'`
varsayilani atanir. Diger kullanicilar icin uygun roller:
`manager`, `editor`, `support`, `service_staff`, `viewer`.

`20260803000000_ad_click_tracking.sql`, yalnızca `gclid`, `gbraid` veya `wbraid`
bulunan reklam ziyaretlerini saklayan private tabloyu ve 60 günlük otomatik temizliği
ekler. Supabase Dashboard > SQL Editor ekranında operasyon migration'indan sonra çalıştırılmalıdır.

`20260805000000_optional_calendar_customer.sql`, takvime müşteri kartı seçmeden hızlı iş
girilebilmesi için yalnızca `appointments.customer_id` zorunluluğunu kaldırır. Mevcut
kayıtları veya foreign key ilişkisini silmez.

`20260821000000_appointment_time_validation.sql`, randevu bitişinin başlangıçtan sonra
olmasını tüm yazma yollarında doğrular ve teknik PostgreSQL hata metni yerine anlaşılır bir
uyarı döndürür.

`20260821010000_calendar_work_order_integration.sql`, takvimde müşteri seçilerek oluşturulan
her işi otomatik bir iş emrine bağlar. Fiyat, durum ve notlar tek popup üzerinden iş emrine de
aktarılır.

## SQL kurulumu

Supabase SQL Editor icinde su dosyayi calistirin:

```text
supabase/migrations/20260624000000_blog_posts.sql
```

## Admin kullanicisi

1. Supabase Dashboard > Authentication > Users alanindan tek admin kullanicisini olusturun.
2. Public sign-up ozelligini kapali tutun.
3. Admin paneline `/admin/login` adresinden bu kullanici ile girin.

RLS politikalari ziyaretcilerin yalnizca yayinlanmis blog yazilarini okumasina izin verir. Blog yazisi ekleme, duzenleme ve silme islemleri sadece Supabase Auth ile oturum acmis kullanicilar tarafindan yapilabilir.
