import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "Elektrik hizmet talebi kapsamında işlenen kişisel verilere ilişkin KVKK aydınlatma metni.",
  path: "/kvkk",
});

export default function KvkkPage() {
  const sections = [
    {
      title: "Veri sorumlusu",
      text: `Kişisel verileriniz ${companyConfig.legalName} tarafından, ${companyConfig.address} adres bilgisi ve ${companyConfig.email} iletişim kanalı üzerinden yürütülen hizmet talepleri kapsamında işlenir.`,
    },
    {
      title: "İşleme amacı",
      text: "Ad soyad, telefon, e-posta, hizmet seçimi ve mesaj içeriği; teklif hazırlamak, hizmet talebine dönüş yapmak ve iletişim kaydı oluşturmak amacıyla işlenebilir.",
    },
    {
      title: "Haklarınız",
      text: "KVKK kapsamındaki bilgi alma, düzeltme, silme, itiraz ve başvuru haklarınız için iletişim sayfasındaki telefon, e-posta veya form kanallarını kullanabilirsiniz.",
    },
  ];

  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "KVKK", href: "/kvkk" }]} />
          <SectionHeading
            eyebrow="Yasal"
            title="KVKK Aydınlatma Metni"
            description="Elektrik hizmet talebi için paylaşılan kişisel verilerin işlenme amacı, kapsamı ve başvuru kanalları."
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
