import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Phone,
  Star,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { serviceAreas, getAreaBySlug } from "@/data/areas";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};
  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/bolge/${area.slug}`,
    image: area.heroImage,
  });
}

export default async function AreaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyConfig.name,
    url: companyConfig.siteUrl,
    telephone: companyConfig.phone,
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.shortName,
        addressRegion: "Tekirdağ",
        addressCountry: "TR",
      },
    },
    description: area.metaDescription,
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />

      {/* ══════════════════════════════════════════════
          1. HERO — Dark navy + city image + CTA
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[580px] overflow-hidden bg-electric-navy text-white">
        {/* Background hero image */}
        <div className="absolute inset-0">
          <Image
            src={area.heroImage}
            alt={`${area.name} elektrikçi hizmeti`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-electric-navy via-electric-navy/90 to-electric-navy/60" />

        <div className="site-container relative">
          <div className="pt-8 text-slate-400 [&_a]:text-slate-400 [&_a:hover]:text-white [&_span]:text-slate-600">
            <Breadcrumbs
              items={[
                { label: "Hizmet Bölgeleri", href: "/bolge" },
                { label: area.name, href: `/bolge/${area.slug}` },
              ]}
            />
          </div>

          <div className="py-16 lg:py-20 max-w-3xl">
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <MapPin className="h-4 w-4" />
              Hizmet Bölgesi — {area.shortName}
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-[3.25rem]">
              {area.heroTitle}
            </h1>
            <p className="mt-4 text-xl leading-8 text-slate-300 max-w-xl">
              {area.heroSubtitle}
            </p>
            <p className="mt-5 text-base leading-7 text-slate-400 max-w-2xl">
              {area.intro}
            </p>

            {/* CTA row */}
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/iletisim" variant="primary">
                Ücretsiz Teklif Al
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={phoneHref()}
                variant="ghost"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                Hemen Ara
              </ButtonLink>
              <ButtonLink
                href={whatsappUrl(`${area.name} bölgesinde elektrik hizmeti için bilgi almak istiyorum.`)}
                variant="whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
            </div>

            {/* Mini stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { value: "500+", label: "Tamamlanan iş" },
                { value: "4.8★", label: "Müşteri puanı" },
                { value: "8+ Yıl", label: "Deneyim" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-electric-yellow">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. FEATURES — 4 cards with icons
      ══════════════════════════════════════════════ */}
      <section className="bg-electric-yellow py-0">
        <div className="site-container">
          <div className="grid divide-y divide-electric-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {area.features.map((f, i) => (
              <div key={f.title} className="px-6 py-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-electric-navy/10">
                  <span className="text-sm font-black text-electric-navy">{i + 1}</span>
                </div>
                <p className="font-bold text-electric-navy">{f.title}</p>
                <p className="mt-1 text-xs leading-5 text-electric-navy/70">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. SERVICES GRID — 6 service cards with images
      ══════════════════════════════════════════════ */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
              Hizmetlerimiz
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {area.shortName}&apos;de sunduğumuz elektrik hizmetleri
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Arızadan tesisata, panoya ve aydınlatmaya kadar tüm elektrik ihtiyaçları tek çatı altında.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {area.services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Accent corner */}
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-electric-navy/5 transition-transform duration-300 group-hover:scale-150" />

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-navy text-electric-yellow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-950 group-hover:text-electric-blue transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-electric-blue">
                    Detaylı bilgi
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. SPLIT — Electrician image + why us
      ══════════════════════════════════════════════ */}
      <section className="section-band bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
              <Image
                src={area.galleryImages[0]}
                alt={`${area.name} elektrikçi hizmeti`}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-electric-navy/30 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -right-4 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-yellow">
                  <Star className="h-5 w-5 text-electric-navy" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Ortalama puan</p>
                  <p className="text-xl font-black text-slate-950">4.8 / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
              Neden Biz?
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
              {area.shortName}&apos;de güvenilir<br />elektrikçi hizmeti.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Her elektrik işinde önce güvenlik, sonra konfor ve estetik gelir. Tesisatı tahminle değil, ölçümle ele alıyoruz.
            </p>

            <div className="mt-7 grid gap-3">
              {[
                "Hat ve sigorta ölçümü yapılarak arıza kaynağı tespit edilir",
                "Enerjili hatlara dokunulmadan önce ilgili bölge izole edilir",
                "TSE/CE onaylı kablo ve ekipmanlar kullanılır",
                "Tüm işlem bitişinde fonksiyon testi yapılarak teslim edilir",
                "Garanti kapsamı teklif aşamasında şeffaf olarak belirtilir",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-blue" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/iletisim" variant="secondary">
                Teklif Al
              </ButtonLink>
              <ButtonLink href="/hizmetler" variant="ghost">
                Tüm hizmetler
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. GALLERY — 3 image mosaic + caption
      ══════════════════════════════════════════════ */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
              Sahadan
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Profesyonel ekip, kaliteli uygulama
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {area.galleryImages.map((img, i) => (
              <div
                key={img}
                className={`relative overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm ${i === 0 ? "md:col-span-1 md:row-span-2 min-h-[300px]" : "min-h-[200px]"}`}
              >
                <Image
                  src={img}
                  alt={`${area.name} elektrik hizmeti ${i + 1}`}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. FAQ — Accordion
      ══════════════════════════════════════════════ */}
      <section className="section-band bg-white">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">SSS</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {area.shortName} hakkında sıkça sorulan sorular
              </h2>
            </div>

            <div className="grid gap-3">
              {area.faqs.map((faq, i) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm open:shadow-md transition-shadow"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
                    <span className="font-bold text-slate-950">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. NEARBY AREAS — link chips
      ══════════════════════════════════════════════ */}
      <section className="bg-electric-mist py-10">
        <div className="site-container">
          <p className="text-sm font-bold uppercase tracking-widest text-electric-blue text-center mb-6">
            Yakın Bölgeler
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {area.nearbyAreas.map((nearby) => {
              const nearbyArea = serviceAreas.find((a) => a.name === nearby);
              return nearbyArea ? (
                <Link
                  key={nearby}
                  href={`/bolge/${nearbyArea.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-electric-blue/30 hover:shadow-md"
                >
                  <MapPin className="h-3.5 w-3.5 text-electric-blue" />
                  {nearby}
                </Link>
              ) : (
                <span
                  key={nearby}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
                >
                  <MapPin className="h-3.5 w-3.5 text-electric-blue" />
                  {nearby}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. CTA BANNER — Bottom action
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#1e3a5f_0%,_transparent_60%)]" />
        <div className="site-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <Zap className="h-4 w-4" />
              {area.shortName} — Hemen Başlayalım
            </div>
            <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
              {area.shortName}&apos;de elektrik işiniz için<br />ücretsiz teklif alın.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              İhtiyacınızı tarif edin, kapsam ve fiyatı birlikte netleştirelim. Aynı gün yanıt garantisi.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/iletisim" variant="primary">
                İletişim Formu
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={phoneHref()} variant="ghost">
                <Phone className="h-4 w-4" />
                Telefonla Ara
              </ButtonLink>
              <ButtonLink
                href={whatsappUrl(`${area.name}'de elektrik için teklif almak istiyorum.`)}
                variant="whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
