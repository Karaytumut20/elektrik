import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, MapPin, Phone, ShieldCheck, Star, Wrench, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogEmptyState } from "@/data/blog";
import { companyConfig, trustSignals, urgentSymptoms } from "@/data/site";
import { serviceAreas as areaData } from "@/data/areas";
import { faqSchema } from "@/data/schemas";
import { services } from "@/data/services";
import { getPublishedBlogPosts } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ReviewsSlider } from "@/components/ui/ReviewsSlider";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "İnallar Elektrik | Çorlu Acil Elektrik Arıza, Tesisat ve Pano",
  description:
    "İnallar Elektrik ile Çorlu elektrikçi hizmeti: elektrik arıza tespiti, acil elektrikçi, tesisat yenileme, pano düzenleme, kaçak akım, priz, avize ve aydınlatma işleri.",
  path: "/",
});

const homeFaqs = [
  {
    question: "Acil elektrik arızasında ilk olarak ne yapmalıyım?",
    answer:
      "Yanık kokusu, priz ısınması veya sürekli atan sigorta varsa ilgili sigortayı kapatın ve arızalı hatta yeniden enerji vermeden profesyonel destek alın.",
  },
  {
    question: "Teklif almadan önce keşif gerekiyor mu?",
    answer:
      "Küçük işlemler telefonda netleşebilir. Tesisat, pano ve kapsamlı arıza işlerinde yerinde kontrol daha sağlıklı teklif verilmesini sağlar.",
  },
  {
    question: "Hangi elektrik hizmetlerini veriyorsunuz?",
    answer:
      "Arıza tespiti, ev ve iş yeri tesisatı, pano yenileme, kaçak akım rölesi, priz-anahtar, aydınlatma, avize, topraklama ve inşaat elektrik işleri için destek veriyoruz.",
  },
  {
    question: "Çorlu'da hangi bölgelere elektrikçi hizmeti veriyorsunuz?",
    answer:
      "Çorlu Merkez, Alipaşa, Muhittin, Şeyhsinan, Reşadiye, Nusratiye, Kazımiye, Hürriyet, Zafer, Rumeli ve çevre mahallelerde talepleri değerlendiriyoruz.",
  },
];

const process = [
  {
    title: "Talebi netleştiririz",
    description: "Arıza belirtisini, adresi, aciliyet durumunu ve varsa fotoğraf bilgilerini alırız.",
  },
  {
    title: "Kontrol ve teklif sunarız",
    description: "Sorunun kaynağını ve uygulanacak işçilik-malzemeyi sade bir kapsamla paylaşırız.",
  },
  {
    title: "Güvenli uygulama yaparız",
    description: "Enerji kesme, izolasyon, montaj ve test adımlarını düzenli şekilde tamamlarız.",
  },
  {
    title: "Teslim sonrası kontrol ederiz",
    description: "Hat, pano, priz veya aydınlatma çalışmasını son kez test edip kullanımı açıklarız.",
  },
];

// Service images are now defined directly on the service items in data/services.ts

const customerReviews = [
  {
    name: "Murat Y.",
    location: "Çorlu / Alipaşa",
    rating: 5,
    text: "Gece yarısı sigorta kutusundan ses gelmeye başladı ve elektrikler kesildi. Hemen aradık, 20 dakika içinde gelip arızayı çözdüler. Çok hızlı ve güvenilir bir hizmet.",
  },
  {
    name: "Ayşe K.",
    location: "Çorlu / Muhittin Mh.",
    rating: 5,
    text: "Yeni aldığımız avizelerin montajı ve salon LED aydınlatma uygulaması için destek aldık. Son derece temiz çalışıldı, kablolar tamamen gizlendi. Elinize sağlık.",
  },
  {
    name: "Ahmet T.",
    location: "Çorlu / Şeyhsinan",
    rating: 5,
    text: "İş yerimizin eskiyen elektrik panosunu tamamen yenilediler. Tüm şalterler etiketlendi ve kaçak akım rölesi takıldı. İşçilik kalitesi üst düzey, kesinlikle tavsiye ederim.",
  },
  {
    name: "Selim B.",
    location: "Çorlu / Zafer Mh.",
    rating: 5,
    text: "Evde sürekli atan sigorta problemini çözmek için geldiler. Elektrik tesisatını detaylıca kontrol edip kısa devre yapan kabloyu bulup değiştirdiler. Çok memnun kaldık.",
  },
  {
    name: "Elif D.",
    location: "Çorlu / Reşadiye",
    rating: 5,
    text: "Prizlerin yerlerinin değiştirilmesi ve yeni hat çekilmesi işlemlerini planlanan saatte gelip hızlıca tamamladılar. Fiyatlandırma şeffaf ve işçilik çok temiz.",
  },
  {
    name: "Mustafa A.",
    location: "Çorlu / Hürriyet Mh.",
    rating: 5,
    text: "Yeni taşındığımız evin tüm topraklama ölçümlerini ve tesisat kontrollerini yaptılar. Güvenle oturabilmemiz için her şeyi tek tek açıkladılar. Güven veren bir ekip.",
  },
];

export default async function HomePage() {
  const blogResult = await getPublishedBlogPosts();
  const latestPosts = blogResult.posts.slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="bg-electric-navy text-white">
        <div className="site-container grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-16">
          <div className="max-w-2xl">
            <Badge className="bg-electric-yellow text-electric-navy">Çorlu yerel elektrik hizmeti</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">İnallar Elektrik – Çorlu'nun Güvenilir Elektrikçisi</h1>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              {companyConfig.name}, Çorlu ve yakın çevrede konut ve iş yerleri için elektrik arıza tespiti, acil elektrikçi desteği, tesisat yenileme, pano düzenleme ve aydınlatma uygulamalarında güvenli işçilik odaklı çalışır.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ButtonLink href={phoneHref()} variant="primary">
                <Phone className="h-4 w-4" />
                Hemen Ara
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, elektrik hizmeti için bilgi almak istiyorum.")} variant="whatsapp">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
              <ButtonLink href="/iletisim" variant="secondary" className="border-white bg-white text-slate-950">
                Ücretsiz Teklif Al
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustSignals.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-electric-yellow" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-electric-coal shadow-2xl">
            <Image
              src="/images/electrician-hero.webp"
              alt="Elektrik panosunu kontrol eden profesyonel elektrikçi"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-electric-yellow">
        <div className="site-container">
          <div className="grid divide-y divide-electric-navy/10 sm:divide-x sm:divide-y-0 sm:grid-cols-3">
            {[
              { icon: Zap, value: "500+", label: "Tamamlanan iş" },
              { icon: Star, value: "4.8★", label: "Ortalama müşteri puanı" },
              { icon: ShieldCheck, value: "8+ Yıl", label: "Sektör deneyimi" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-4 px-6 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-navy/10">
                    <Icon className="h-5 w-5 text-electric-navy" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-electric-navy">{stat.value}</p>
                    <p className="text-xs font-semibold text-electric-navy/70">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Hakkımızda"
              title="Tesisata tahminle değil, kontrol ederek yaklaşırız."
              description="Elektrik işlerinde temiz görünüm kadar güvenli bağlantı, doğru malzeme ve test adımları da önemlidir. Bu nedenle her işi önce ihtiyacı anlayarak, sonra ölçülü ve açık bir kapsamla ele alıyoruz."
              className="mb-8"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Güvenli İşçilik", desc: "Enerji kesme, izolasyon ve son test adımları." },
                { title: "Kaliteli Malzeme", desc: "TSE ve CE onaylı, uzun ömürlü ekipmanlar." },
                { title: "Zamanında Teslim", desc: "Hızlı yanıt ve zamanında yerinde müdahale." },
                { title: "Müşteri Memnuniyeti", desc: "Şeffaf fiyatlandırma ve temiz çalışma garantisi." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-electric-yellow mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[440px] overflow-hidden rounded-2xl border border-slate-200/60 shadow-lg lg:h-[480px]">
            <Image
              src="/images/electrician-about.webp"
              alt="İnallar Elektrik - Hakkımızda"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <SectionHeading
            eyebrow="Öne çıkan hizmetler"
            title="Elektrik arıza, tesisat ve montaj işleri tek yerde."
            description="Küçük priz değişiminden pano yenilemeye kadar her hizmette iş kapsamını baştan netleştiririz."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => {
              const Icon = service.icon;
              const imageUrl = service.image;
              return (
                <div key={service.slug} className="rounded-lg border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    {imageUrl ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={service.title}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                          quality={60}
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-gradient-to-br from-electric-navy to-electric-coal flex items-center justify-center">
                        <Icon className="h-16 w-16 text-electric-yellow opacity-85" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        {imageUrl && (
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-navy text-electric-yellow shrink-0">
                            <Icon className="h-4 w-4" />
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-slate-950 leading-tight">{service.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.shortDescription}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 p-6 pt-0 border-t border-slate-100 mt-4">
                    <Link href={`/hizmetler/${service.slug}`} className="btn btn-ghost flex-1 py-2 text-xs">
                      Detay
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link href="/iletisim" className="btn btn-primary flex-1 py-2 text-xs">
                      Teklif al
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <ButtonLink href="/hizmetler" variant="secondary">
              Tüm hizmetleri incele
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Çorlu elektrik arıza"
            title="Sorunu tarif edin, doğru hizmete hızlı yönlendirelim."
            description="Sigorta atması, yanık kokusu, priz ısınması veya odada elektrik olmaması gibi belirtilerde hattı zorlamadan destek almak güvenlidir."
            className="mb-0"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {urgentSymptoms.map((symptom) => (
              <Link
                key={symptom}
                href="/iletisim"
                className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-900 transition-colors hover:border-electric-blue hover:bg-white"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-electric-blue" />
                {symptom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container">
          <SectionHeading
            eyebrow="Çalışma süreci"
            title="Basit, şeffaf ve kontrol edilebilir ilerleriz."
            description="Elektrik işlerinde güven veren sonuç, doğru sıra ve dikkatli testle gelir."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <Card key={step.title}>
                <div className="mb-5 grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-amber-300">{index + 1}</div>
                <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-electric-navy py-10 text-white">
        <div className="site-container grid gap-4 md:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "Kontrollü teslim", text: "İş bitiminde hat, pano veya armatür çalışması test edilir." },
            { icon: Wrench, title: "Bakımı kolay işçilik", text: "Pano ve bağlantılar sonradan izlenebilir şekilde düzenlenir." },
            { icon: MapPin, title: "Yerel hizmet odağı", text: `${companyConfig.city} ve yakın bölgeler için hızlı iletişim.` },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-5">
                <Icon className="h-8 w-8 shrink-0 text-electric-yellow" />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <Card>
            <SectionHeading
              eyebrow="Hizmet bölgeleri"
              title="Çorlu ve yakın çevrede elektrikçi hizmeti."
              description="Çorlu merkez mahallelerinden Ergene ve Çerkezköy'e kadar her bölge için ayrı detay sayfamızı inceleyin."
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {areaData.slice(0, 14).map((area) => (
                <Link
                  key={area.slug}
                  href={`/bolge/${area.slug}`}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold transition-colors hover:border-electric-blue/30 hover:bg-blue-50/40"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-electric-blue" />
                  {area.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/bolge" className="inline-flex items-center gap-2 text-sm font-bold text-electric-blue hover:underline">
                Tüm bölgeleri gör ({areaData.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
          <Card className="overflow-hidden border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 p-0 shadow-md flex flex-col">
            {/* Image box on top - increased height */}
            <div className="relative h-80 w-full bg-slate-900">
              <Image
                src="/images/home-emergency-alert.jpg"
                alt="Acil elektrik uyarısı"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
            </div>
            
            {/* Content box below */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-500/20">
                  <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                  Acil Elektrik Servisi
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-950 leading-tight">
                  Sigorta atıyor, priz ısınıyor veya yanık kokusu mu var?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Elektrik arızaları ihmal edildiğinde yangın veya çarpılma riski taşır. Güvenliğiniz için gecikmeden ilgili hattın sigortasını indirin ve profesyonel destek talep edin.
                </p>
                
                {/* Mini warning checklist */}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    "Sigortayı hemen indirin",
                    "Cihazları prizden çekin",
                    "Islak elle müdahale etmeyin",
                    "Hemen profesyonel çağırın",
                  ].map((step) => (
                    <div key={step} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <ButtonLink href={phoneHref()} variant="secondary" className="bg-amber-600 text-white hover:bg-amber-700 border-none font-bold">
                  Hemen Ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl("Merhaba, acil elektrik arızası için destek istiyorum.")} variant="whatsapp">
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </ButtonLink>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container">
          <SectionHeading
            eyebrow="Müşteri Yorumları"
            title="Hizmet alan müşterilerimizin değerlendirmeleri"
            description="Çorlu ve çevre bölgelerde sunduğumuz elektrik arıza, montaj ve tesisat hizmetleri hakkında yapılan yorumlar."
          />
          <ReviewsSlider reviews={customerReviews} />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Blog"
              title="Elektrik ve güvenlik rehberleri."
              description="Uzman ipuçları, bakım tavsiyeleri ve güvenli kullanım kılavuzları."
              className="mb-0"
            />
            <Link
              href="/blog"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Tüm yazılar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {blogResult.error ? <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{blogResult.error}</p> : null}
          {latestPosts.length > 0 ? (
            <BlogGrid posts={latestPosts} />
          ) : (
            <Card>
              <h3 className="text-xl font-bold text-slate-950">{blogEmptyState.title}</h3>
              <p className="mt-2 text-slate-600">{blogResult.isConfigured ? blogEmptyState.description : "Elektrik arıza, tesisat güvenliği ve bakım rehberleri hazırlandığında burada yayınlanacak."}</p>
            </Card>
          )}
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="SSS" title="Sıkça sorulan sorular" description="Elektrik işine başlamadan önce en çok merak edilen konular." />
          <div className="grid gap-3">
            {homeFaqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer text-base font-bold text-slate-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge className="bg-amber-300 text-slate-950">Teklif al</Badge>
            <h2 className="mt-4 text-3xl font-bold leading-tight">Elektrik işiniz için kapsamlı ve net teklif alın.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/iletisim" variant="primary">
              İletişim Formu
            </ButtonLink>
            <ButtonLink href={phoneHref()} variant="ghost">
              Telefonla Ara
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
