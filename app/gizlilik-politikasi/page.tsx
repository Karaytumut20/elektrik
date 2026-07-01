import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description: "Elektrik hizmetleri web sitesi gizlilik politikası ve kişisel veri işleme prensipleri.",
  path: "/gizlilik-politikasi",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description="Elektrik hizmet talebi kapsamında paylaştığınız kişisel verilerin nasıl işlendiğine dair bilgilendirme."
      sections={[
        {
          title: "Veri sorumlusu",
          text: `Bu web sitesi üzerinden iletilen talepler ${companyConfig.legalName} tarafından değerlendirilir. İletişim için ${companyConfig.email} adresini veya iletişim sayfasındaki kanalları kullanabilirsiniz.`,
        },
        {
          title: "Toplanan bilgiler",
          text: "İletişim formu, telefon, e-posta ve WhatsApp üzerinden paylaştığınız ad soyad, telefon, e-posta, hizmet seçimi ve mesaj içeriği talebinize dönüş yapmak amacıyla işlenebilir.",
        },
        {
          title: "Saklama ve güvenlik",
          text: "Kişisel veriler hizmet talebinin değerlendirilmesi, iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi için gerekli süre boyunca saklanır. Yetkisiz erişime karşı makul teknik ve idari tedbirler alınır.",
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
