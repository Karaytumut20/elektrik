import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Phone,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { faqSchema, serviceSchema } from "@/data/schemas";
import { getServiceBySlug, services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: `Çorlu ${service.title}`,
    description: `${service.shortDescription} Çorlu, Ergene ve Çerkezköy çevresinde güvenli işçilik, net teklif ve aynı gün dönüş avantajıyla hizmet alın.`,
    path: `/hizmetler/${service.slug}`,
    image: service.image,
    keywords: [
      `Çorlu ${service.title}`,
      `${service.title} Çorlu`,
      "Çorlu elektrikçi",
      "Tekirdağ elektrikçi",
      "Çorlu elektrik arıza",
    ],
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const Icon = service.icon;

  return (
    <>
      <JsonLd data={[serviceSchema(service), faqSchema(service.faqs)]} />

      {/* ════════════════════════════════════════════
          1. HERO — Dark navy + service image split
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-electric-navy text-white">

        <div className="site-container relative">
          {/* Breadcrumbs */}
          <div className="pt-8 text-slate-400 [&_a]:text-slate-400 [&_a:hover]:text-white [&_span]:text-slate-600">
            <Breadcrumbs
              items={[
                { label: "Hizmetler", href: "/hizmetler" },
                { label: service.title, href: `/hizmetler/${service.slug}` },
              ]}
            />
          </div>

          <div className="grid gap-10 py-14 lg:grid-cols-[1fr_480px] lg:items-center lg:py-20">
            {/* Left: Content */}
            <div>
              {/* Service badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
                <Icon className="h-4 w-4" />
                Çorlu Elektrik Hizmeti
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-[3.25rem]">
                Çorlu {service.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-300 max-w-xl">
                {service.detailDescription}
              </p>

              {/* Trust signals */}
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2 max-w-lg">
                {[
                  "Güvenli işçilik garantisi",
                  "Şeffaf fiyatlandırma",
                  "TSE onaylı malzeme",
                  "Yerinde test ve teslim",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-electric-yellow" />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/iletisim" variant="primary">
                  Ücretsiz Teklif Al
                </ButtonLink>
                <ButtonLink href={phoneHref()} variant="ghost" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <Phone className="h-4 w-4" />
                  Hemen Ara
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl(`${service.title} için bilgi almak istiyorum.`)}
                  variant="whatsapp"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </ButtonLink>
              </div>
            </div>

            {/* Right: Service image */}
            <div className="relative">
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-electric-navy/30 to-transparent" />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon className="h-24 w-24 text-electric-yellow/40" />
                </div>
              )}

              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-white/10 bg-electric-coal/90 p-4 shadow-xl backdrop-blur-sm lg:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-yellow">
                    <Star className="h-5 w-5 text-electric-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Müşteri memnuniyeti</p>
                    <p className="text-xl font-black text-white">4.8 / 5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. OVERVIEW CARDS — Operations, Benefits, Process
      ════════════════════════════════════════════ */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
              Hizmet Kapsamı
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Ne yapıyoruz, nasıl çalışıyoruz?
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Operations card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-navy text-electric-yellow">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Yapılan İşlemler</h3>
              <ul className="mt-4 grid gap-3">
                {service.operations.map((op) => (
                  <li key={op} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-electric-blue" />
                    {op}
                  </li>
                ))}
              </ul>
              {/* Decorative corner */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-electric-navy/5 transition-transform duration-300 group-hover:scale-150" />
            </div>

            {/* Benefits card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-electric-navy p-7 shadow-sm transition-shadow hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-yellow/20 text-electric-yellow ring-1 ring-electric-yellow/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Avantajlar</h3>
              <ul className="mt-4 grid gap-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-electric-yellow" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/5 transition-transform duration-300 group-hover:scale-150" />
            </div>

            {/* Process card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-electric-navy text-electric-yellow">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Çalışma Süreci</h3>
              <ol className="mt-4 grid gap-4">
                {service.process.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric-navy text-[10px] font-black text-electric-yellow">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-electric-navy/5 transition-transform duration-300 group-hover:scale-150" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. TOOLS VISUAL — Image + guarantees side-by-side
      ════════════════════════════════════════════ */}
      <section className="section-band bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
              <Image
                src="/images/service-tools-flatlay.jpg"
                alt="Profesyonel elektrik ekipmanları"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Overlay badge */}
            <div className="absolute -right-4 -top-4 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg lg:block">
              <p className="text-xs font-semibold text-slate-500">TSE & CE Onaylı</p>
              <p className="mt-0.5 text-lg font-black text-slate-950">Kaliteli Malzeme</p>
            </div>
          </div>

          {/* Right: guarantee points */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
              Neden Biz?
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
              Güvenli işçilik,<br />kaliteli malzeme.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Her elektrik işinde önce güvenlik, sonra estetik ve konfor gelir. Kullandığımız ekipmanlar TSE ve CE onaylı; işçiliğimiz test edilerek teslim edilir.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                {
                  title: "Enerji Kesme & İzolasyon",
                  desc: "Her işe başlamadan ilgili hat güvenli şekilde izole edilir.",
                },
                {
                  title: "Ölçüm ve Test",
                  desc: "Multimetre ve kaçak akım dedektörüyle son kontrol yapılır.",
                },
                {
                  title: "Temiz ve Düzenli Teslim",
                  desc: "İş alanı temizlenerek kablo ve bağlantılar düzenli şekilde teslim edilir.",
                },
                {
                  title: "İşçilik Garantisi",
                  desc: "Yapılan onarım ve montaj işleri için garanti sunulmaktadır.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-electric-blue/20 hover:bg-blue-50/30"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric-navy">
                    <CheckCircle2 className="h-4 w-4 text-electric-yellow" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950 text-sm">{item.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. QUALITY PHOTO — Full-width editorial image
      ════════════════════════════════════════════ */}
      <div className="site-container py-0">
        <div className="relative h-[280px] overflow-hidden rounded-2xl md:h-[360px]">
          <Image
            src="/images/service-quality-check.jpg"
            alt="Kalite kontrol — profesyonel elektrikçi pano kontrolü"
            fill
            sizes="(min-width: 1180px) 1180px, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-electric-navy/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="site-container">
              <p className="text-sm font-semibold uppercase tracking-widest text-electric-yellow">
                Profesyonel ekip
              </p>
              <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight text-white md:text-3xl">
                Her iş uzman ekip tarafından test edilerek teslim edilir.
              </h2>
              <div className="mt-5">
                <ButtonLink href="/iletisim" variant="primary">
                  Teklif Al
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          5. FAQ — Accordion style
      ════════════════════════════════════════════ */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">SSS</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {service.title} hakkında sorular
              </h2>
              <p className="mt-3 text-slate-500">
                İşleme başlamadan önce en çok merak edilen noktalar.
              </p>
            </div>

            <div className="grid gap-3">
              {service.faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow open:shadow-md"
                  {...(index === 0 ? { open: true } : {})}
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

      {/* ════════════════════════════════════════════
          6. RELATED SERVICES — Image cards
      ════════════════════════════════════════════ */}
      <section className="section-band bg-white">
        <div className="site-container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-electric-blue">
                İlgili Hizmetler
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Benzer elektrik hizmetleri
              </h2>
            </div>
            <Link
              href="/hizmetler"
              className="hidden items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950 sm:flex"
            >
              Tümünü gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => {
              const RelatedIcon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={`/hizmetler/${item.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-electric-navy to-electric-coal">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        quality={60}
                        className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <RelatedIcon className="h-14 w-14 text-electric-yellow/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-electric-navy/60 to-transparent" />
                    {/* Icon badge */}
                    <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-electric-yellow">
                      <RelatedIcon className="h-4 w-4 text-electric-navy" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-950 group-hover:text-electric-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500 line-clamp-2">
                      {item.shortDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-electric-blue">
                      İncele
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. CTA BANNER — Bottom action strip
      ════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <Zap className="h-4 w-4" />
              Hemen Başlayalım
            </div>
            <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
              {service.title} için<br />ücretsiz teklif alın.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              İhtiyacınızı tarif edin, kapsam ve fiyatı birlikte netleştirelim. Hızlı yanıt garantisi.
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
              <ButtonLink href={whatsappUrl(`${service.title} için teklif almak istiyorum.`)} variant="whatsapp">
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
