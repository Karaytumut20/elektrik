import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Hakkimizda",
  description:
    "Volta Elektrik yaklasimi: guvenli iscilik, kaliteli malzeme, zamaninda teslim ve musteri memnuniyeti odakli elektrik hizmetleri.",
  path: "/hakkimizda",
});

const principles = [
  "Guvenli calisma ve enerji kesme prosedurlerine dikkat",
  "Ise uygun kablo, sigorta ve ekipman secimi",
  "Pano, priz ve hatlarda duzenli baglanti anlayisi",
  "Zamaninda bilgilendirme ve net is kapsami",
  "Teslim oncesi test ve kullanici bilgilendirmesi",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Hakkimizda", href: "/hakkimizda" }]} />
          <SectionHeading
            eyebrow={companyConfig.name}
            title="Guvenli ve duzenli elektrik isciligi icin sade bir yaklasim."
            description="Firma bilgileri, yasal unvan ve deneyim yili kesinlestiginde merkezi ayarlardan guncellenmelidir. Bu sayfada dogrulanmamis sertifika, calisan sayisi veya proje sayisi kullanilmaz."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <Card>
            <h2 className="text-2xl font-bold text-slate-950">Firma tanitimi</h2>
            <p className="mt-4 leading-7 text-slate-700">
              {companyConfig.name}, konut ve is yerlerinde elektrik ariza, tesisat, pano, aydinlatma ve montaj islerinde kontrollu calismayi onceliklendirir. Amac, ihtiyaci netlestirmek, gereksiz islemden kacinmak ve yapilan isi test ederek teslim etmektir.
            </p>
            <p className="mt-4 leading-7 text-slate-700">
              Vizyonumuz; elektrik hizmetlerinde ulasilabilir, seffaf ve guven veren bir yerel cozum ortagi olmaktir. Misyonumuz; her islemde guvenli uygulama, dogru malzeme ve temiz teslim standardini korumaktir.
            </p>
          </Card>
          <Card className="bg-slate-950 text-white">
            <h2 className="text-2xl font-bold">Calisma prensipleri</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-200">
              {principles.map((principle) => (
                <li key={principle} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  {principle}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="site-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Elektrik isiniz icin net teklif alin.</h2>
            <p className="mt-2 text-slate-600">Ariza belirtisini veya proje kapsamını paylasin, uygun yol haritasini birlikte netlestirelim.</p>
          </div>
          <ButtonLink href="/iletisim">Iletisime gec</ButtonLink>
        </div>
      </section>
    </>
  );
}
