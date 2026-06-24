import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig, legalPlaceholders } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gizlilik Politikasi",
  description: "Elektrik hizmetleri web sitesi gizlilik politikasi ve kisisel veri isleme prensipleri.",
  path: "/gizlilik-politikasi",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikasi"
      description="Bu metin yayin oncesi firma bilgileri ve hukuk danismani kontroluyle guncellenmelidir."
      sections={[
        {
          title: "Veri sorumlusu",
          text: `${companyConfig.name} icin veri sorumlusu bilgileri: ${legalPlaceholders.dataController}`,
        },
        {
          title: "Toplanan bilgiler",
          text: "Iletisim formu, telefon, e-posta ve WhatsApp uzerinden paylastiginiz ad soyad, telefon, e-posta, hizmet secimi ve mesaj icerigi talebinize donus yapmak amaciyla islenebilir.",
        },
        {
          title: "Saklama ve guvenlik",
          text: "Kisisel veriler yalnizca hizmet talebinin degerlendirilmesi ve yasal yukumlulukler icin gerekli sure boyunca saklanmalidir. Kesin saklama sureleri firma politikasi ile belirlenmelidir.",
        },
      ]}
    />
  );
}

function LegalPage({ title, description, sections }: { title: string; description: string; sections: { title: string; text: string }[] }) {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: title, href: "/gizlilik-politikasi" }]} />
          <SectionHeading eyebrow="Yasal" title={title} description={description} className="mb-0 mt-8" as="h1" />
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
