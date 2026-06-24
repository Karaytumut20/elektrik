import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cerez Politikasi",
  description: "Web sitesinde kullanilabilecek zorunlu, performans ve iletisim amacli cerezlere iliskin bilgilendirme.",
  path: "/cerez-politikasi",
});

export default function CookiePage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Cerez Politikasi", href: "/cerez-politikasi" }]} />
          <SectionHeading
            eyebrow="Yasal"
            title="Cerez Politikasi"
            description="Bu sayfa, kullanilacak analiz veya reklam araclari kesinlestiginde guncellenmelidir."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-4">
          {[
            {
              title: "Zorunlu cerezler",
              text: "Site guvenligi, oturum yonetimi ve temel gezinme icin gerekli teknik cerezler kullanilabilir.",
            },
            {
              title: "Performans cerezleri",
              text: "Analitik araclari kullanilacaksa hangi araclarin devrede oldugu, veri saklama suresi ve devre disi birakma yontemi bu alana eklenmelidir.",
            },
            {
              title: "Tercih yonetimi",
              text: "Tarayici ayarlarinizdan cerezleri silebilir veya engelleyebilirsiniz. Bu durumda bazi site ozellikleri sinirli calisabilir.",
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
