import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Çerez Politikası",
  description: "Web sitesinde kullanılabilecek zorunlu, performans ve iletişim amaçlı çerezlere ilişkin bilgilendirme.",
  path: "/cerez-politikasi",
});

export default function CookiePage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Çerez Politikası", href: "/cerez-politikasi" }]} />
          <SectionHeading
            eyebrow="Yasal"
            title="Çerez Politikası"
            description="Web sitesinin güvenli ve verimli çalışması için kullanılabilecek çerezlere ilişkin bilgilendirme."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-4">
          {[
            {
              title: "Zorunlu çerezler",
              text: "Site güvenliği, oturum yönetimi ve temel gezinme için gerekli teknik çerezler kullanılabilir.",
            },
            {
              title: "Performans çerezleri",
              text: "Site performansını ve ziyaretçi deneyimini anlamak için anonimleştirilmiş ölçüm araçları kullanılabilir. Reklam veya gelişmiş analiz araçları devreye alınırsa bu politika güncellenir.",
            },
            {
              title: "Tercih yönetimi",
              text: "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Bu durumda bazı site özellikleri sınırlı çalışabilir.",
            },
          ].map((section) => (
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
