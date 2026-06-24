import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig, legalPlaceholders } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "KVKK Aydinlatma Metni",
  description: "Elektrik hizmet talebi kapsaminda islenen kisisel verilere iliskin KVKK aydinlatma metni taslagi.",
  path: "/kvkk",
});

export default function KvkkPage() {
  const sections = [
    {
      title: "Veri sorumlusu",
      text: `${companyConfig.name} icin kesin veri sorumlusu bilgileri yayin oncesi doldurulmalidir. ${legalPlaceholders.companyDetails}`,
    },
    {
      title: "Isleme amaci",
      text: "Ad soyad, telefon, e-posta, hizmet secimi ve mesaj icerigi; teklif hazirlamak, hizmet talebine donus yapmak ve iletisim kaydi olusturmak amaciyla islenebilir.",
    },
    {
      title: "Haklariniz",
      text: "KVKK kapsamindaki bilgi alma, duzeltme, silme, itiraz ve basvuru haklariniz icin firma iletisim adresleri kullanilabilir. Basvuru usulu firma tarafindan kesinlestirilmelidir.",
    },
  ];

  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "KVKK", href: "/kvkk" }]} />
          <SectionHeading
            eyebrow="Yasal"
            title="KVKK Aydinlatma Metni"
            description="Bu taslak, firma bilgileri kesinlestikten sonra hukuk danismani tarafindan kontrol edilmelidir."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-4">
          {sections.map((section) => (
            <Card key={section.title}>
              <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-700">{section.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
