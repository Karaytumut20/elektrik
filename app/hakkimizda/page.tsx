import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Çorlu Elektrikçi Hakkımızda",
  description:
    "Çorlu Elektrikçi yaklaşımı: güvenli işçilik, kaliteli malzeme, düzenli kablolama, net teklif ve teslim sonrası kontrol odaklı elektrik hizmetleri.",
  path: "/hakkimizda",
});

const principles = [
  "Güvenli çalışma ve enerji kesme prosedürlerine dikkat",
  "İşe uygun kablo, sigorta ve ekipman seçimi",
  "Pano, priz ve hatlarda düzenli bağlantı anlayışı",
  "Zamanında bilgilendirme ve net iş kapsamı",
  "Teslim öncesi test ve kullanıcı bilgilendirmesi",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Hakkımızda", href: "/hakkimizda" }]} />
          <SectionHeading
            eyebrow={companyConfig.name}
            title="Çorlu'da güvenli ve düzenli elektrik işçiliği."
            description="Konut, apartman ve iş yerlerinde elektrik arıza, tesisat, pano ve montaj işlerini önce ihtiyacı anlayarak, sonra ölçülü bir kapsamla planlarız."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-6">
            <Card className="flex-1">
              <h2 className="text-2xl font-bold text-slate-950">Firma tanıtımı</h2>
              <p className="mt-4 leading-7 text-slate-700">
                {companyConfig.name}, konut ve iş yerlerinde elektrik arıza, tesisat, pano, aydınlatma ve montaj işlerinde kontrollü çalışmayı önceliklendirir. Amaç, ihtiyacı netleştirmek, gereksiz işlemden kaçınmak ve yapılan işi test ederek teslim etmektir.
              </p>
              <p className="mt-4 leading-7 text-slate-700">
                Vizyonumuz; elektrik hizmetlerinde ulaşılabilir, şeffaf ve güven veren bir yerel çözüm ortağı olmaktır. Misyonumuz; her işlemde güvenli uygulama, doğru malzeme ve temiz teslim standardını korumaktır.
              </p>
            </Card>
            <Card className="flex-1">
              <h2 className="text-2xl font-bold text-slate-950">Çalışma prensipleri</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-800">
                {principles.map((principle) => (
                  <li key={principle} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-yellow" />
                    {principle}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="relative min-h-[400px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src="/images/electrician-about.webp"
              alt="Çorlu Elektrikçi - Çalışma Ortamı"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="site-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Elektrik işiniz için net teklif alın.</h2>
            <p className="mt-2 text-slate-600">Arıza belirtisini veya proje kapsamını paylaşın, uygun yol haritasını birlikte netleştirelim.</p>
          </div>
          <ButtonLink href="/iletisim">İletişime geç</ButtonLink>
        </div>
      </section>
    </>
  );
}
