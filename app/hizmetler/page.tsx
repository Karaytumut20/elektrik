import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Elektrik Hizmetleri",
  description:
    "Elektrik ariza tespiti, ev ve is yeri tesisati, pano yenileme, kacak akim rolesi, priz, aydinlatma, avize ve topraklama hizmetleri.",
  path: "/hizmetler",
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Hizmetler", href: "/hizmetler" }]} />
          <SectionHeading
            eyebrow={companyConfig.name}
            title="Elektrik hizmetleri"
            description="Konut, is yeri ve tadilat projelerinde ihtiyaca gore planlanan elektrik isleri."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.slug} className="grid gap-4">
                <Icon className="h-8 w-8 text-electric-blue" />
                <div>
                  <h2 className="text-xl font-bold text-slate-950">{service.title}</h2>
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
      </section>
    </>
  );
}
