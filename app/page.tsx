import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, MapPin, MessageCircle, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogEmptyState } from "@/data/blog";
import { companyConfig, serviceAreas, trustSignals } from "@/data/site";
import { faqSchema } from "@/data/schemas";
import { services } from "@/data/services";
import { getPublishedBlogPosts } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: `${companyConfig.name} | Elektrik Ariza, Tesisat ve Pano Hizmetleri`,
  description:
    "Konut ve is yerleri icin elektrik ariza tespiti, tesisat yenileme, pano duzenleme, aydinlatma, topraklama ve acil elektrikci hizmetleri.",
});

const homeFaqs = [
  {
    question: "Acil elektrik arizasinda ilk olarak ne yapmaliyim?",
    answer:
      "Yanik kokusu, priz isinmasi veya surekli atan sigorta varsa ilgili sigortayi kapatin ve arizali hatta yeniden enerji vermeden profesyonel destek alin.",
  },
  {
    question: "Teklif almadan once kesif gerekiyor mu?",
    answer:
      "Kucuk islemler telefonda netlesebilir. Tesisat, pano ve kapsamli ariza islerinde yerinde kontrol daha saglikli teklif verilmesini saglar.",
  },
  {
    question: "Hangi elektrik hizmetlerini veriyorsunuz?",
    answer:
      "Ariza tespiti, ev ve is yeri tesisati, pano yenileme, kacak akim rolesi, priz-anahtar, aydinlatma, avize, topraklama ve insaat elektrik isleri icin destek veriyoruz.",
  },
];

const process = [
  {
    title: "Talebi netlestiririz",
    description: "Ariza belirtisini, adresi, aciliyet durumunu ve varsa fotograf bilgilerini aliriz.",
  },
  {
    title: "Kontrol ve teklif sunariz",
    description: "Sorunun kaynagini ve uygulanacak iscilik-malzemeyi sade bir kapsamla paylasiriz.",
  },
  {
    title: "Guvenli uygulama yapariz",
    description: "Enerji kesme, izolasyon, montaj ve test adimlarini duzenli sekilde tamamlariz.",
  },
  {
    title: "Teslim sonrasi kontrol ederiz",
    description: "Hat, pano, priz veya aydinlatma calismasini son kez test edip kullanimi aciklariz.",
  },
];

export default async function HomePage() {
  const blogResult = await getPublishedBlogPosts();
  const latestPosts = blogResult.posts.slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="bg-slate-950 text-white">
        <div className="site-container grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-16">
          <div className="max-w-2xl">
            <Badge className="bg-amber-300 text-slate-950">Yerel elektrik hizmeti</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Elektrikci Hizmeti</h1>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              {companyConfig.name}, konut ve is yerlerinde elektrik ariza tespiti, tesisat yenileme, pano duzenleme ve aydinlatma uygulamalarinda guvenli iscilik odakli calisir.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ButtonLink href={phoneHref()} variant="primary">
                <Phone className="h-4 w-4" />
                Hemen Ara
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, elektrik hizmeti icin bilgi almak istiyorum.")} variant="ghost">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
              <ButtonLink href="/iletisim" variant="secondary" className="border-white bg-white text-slate-950">
                Ucretsiz Teklif Al
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustSignals.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-amber-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-2xl">
            <Image
              src="/images/electrician-hero.png"
              alt="Elektrik panosunu kontrol eden profesyonel elektrikci"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            eyebrow="Hakkimizda"
            title="Tesisata tahminle degil, kontrol ederek yaklasiriz."
            description="Elektrik islerinde temiz gorunum kadar guvenli baglanti, dogru malzeme ve test adimlari da onemlidir. Bu nedenle her isi once ihtiyaci anlayarak, sonra olculu ve acik bir kapsamla ele aliyoruz."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Guvenli iscilik yaklasimi",
              "Kaliteli ve uygun malzeme secimi",
              "Zamaninda ve duzenli teslim",
              "Musteri memnuniyetini onceliklendirme",
            ].map((item) => (
              <Card key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-electric-blue" />
                <p className="font-semibold text-slate-800">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <SectionHeading
            eyebrow="One cikan hizmetler"
            title="Elektrik ariza, tesisat ve montaj isleri tek yerde."
            description="Kucuk priz degisiminden pano yenilemeye kadar her hizmette is kapsamını bastan netlestiririz."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.slug} className="grid gap-4">
                  <Icon className="h-8 w-8 text-electric-blue" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.shortDescription}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/hizmetler/${service.slug}`} className="btn btn-ghost">
                      Detay
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/iletisim" className="btn btn-primary">
                      Teklif al
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="mt-8">
            <ButtonLink href="/hizmetler" variant="secondary">
              Tum hizmetleri incele
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container">
          <SectionHeading
            eyebrow="Calisma sureci"
            title="Basit, seffaf ve kontrol edilebilir ilerleriz."
            description="Elektrik islerinde guven veren sonuc, dogru sira ve dikkatli testle gelir."
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

      <section className="bg-slate-950 py-10 text-white">
        <div className="site-container grid gap-4 md:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "Kontrollu teslim", text: "Is bitiminde hat, pano veya armatür calismasi test edilir." },
            { icon: Wrench, title: "Bakimi kolay iscilik", text: "Pano ve baglantilar sonradan izlenebilir sekilde duzenlenir." },
            { icon: MapPin, title: "Yerel hizmet odagi", text: `${companyConfig.city} ve yakin bolgeler icin hizli iletisim.` },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-5">
                <Icon className="h-8 w-8 shrink-0 text-amber-300" />
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
              eyebrow="Hizmet bolgeleri"
              title="Adres bilgisi netlestiginde bolge listesi tek yerden guncellenir."
              description="Firma sehir ve bolge bilgileri merkezi config dosyasindan yonetilir; ayni bilgi sayfalarda tekrar edilmez."
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceAreas.map((area) => (
                <p key={area} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-electric-blue" />
                  {area}
                </p>
              ))}
            </div>
          </Card>
          <Card className="bg-amber-100">
            <Badge>Acil elektrikci</Badge>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-950">Sigorta atiyor, priz isiniyor veya yanik kokusu mu var?</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Riskli belirtilerde gecikmeden ilgili hattin enerjisini kesin ve profesyonel destek alin. Hemen arayarak durumu hizlica netlestirebilirsiniz.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={phoneHref()} variant="secondary">
                Hemen Ara
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, acil elektrik arizasi icin destek istiyorum.")} variant="ghost">
                WhatsApp
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Musteri yorumlari"
              title="Yorum alani yayina hazir."
              description="Dogrulanmis musteri yorumlari eklendiginde bu alan firma deneyimini gostermek icin kullanilabilir. Gercek olmayan yorum veya puan uydurulmaz."
            />
          </div>
          <Card>
            <p className="text-sm font-semibold uppercase text-slate-500">Hazir alan</p>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Ilk dogrulanmis yorumlar geldikten sonra ad, hizmet turu ve yorum metniyle bu bolum guncellenebilir.
            </p>
          </Card>
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <SectionHeading
            eyebrow="Blog"
            title="Elektrik tesisati ve guvenli kullanim rehberleri."
            description="Admin panelinden yayinlanan son yazilar burada listelenir."
          />
          {blogResult.error ? <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{blogResult.error}</p> : null}
          {latestPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Card key={post.id}>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {post.published_at ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(post.published_at)) : "Taslak degil"}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-electric-blue">
                    Oku
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <h3 className="text-xl font-bold text-slate-950">{blogEmptyState.title}</h3>
              <p className="mt-2 text-slate-600">{blogResult.isConfigured ? blogEmptyState.description : "Supabase baglantisi yapildiktan ve ilk yazi yayinlandiktan sonra blog alani dolacak."}</p>
            </Card>
          )}
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="SSS" title="Sikca sorulan sorular" description="Elektrik isine baslamadan once en cok merak edilen konular." />
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
            <h2 className="mt-4 text-3xl font-bold leading-tight">Elektrik isiniz icin kapsamli ve net teklif alin.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/iletisim" variant="primary">
              Iletisim Formu
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
