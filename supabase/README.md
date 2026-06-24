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
