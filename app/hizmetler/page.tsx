import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İnallar Elektrik Hizmetleri | Arıza, Tesisat ve Pano",
  description:
    "Çorlu elektrikçi hizmetleri: arıza tespiti, acil elektrikçi, ev ve iş yeri tesisatı, pano yenileme, kaçak akım rölesi, priz, aydınlatma ve topraklama.",
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
            title="Çorlu elektrik hizmetleri"
            description="Konut, iş yeri, apartman, mağaza ve tadilat projelerinde ihtiyaca göre planlanan elektrik arıza, tesisat, pano ve montaj işleri."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            const imageUrl = service.image;
            return (
              <div key={service.slug} className="rounded-lg border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={service.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        quality={60}
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 w-full bg-gradient-to-br from-electric-navy to-electric-coal flex items-center justify-center">
                      <Icon className="h-16 w-16 text-electric-yellow opacity-85" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      {imageUrl && (
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-navy text-electric-yellow shrink-0">
                          <Icon className="h-4 w-4" />
                        </span>
                      )}
                      <h2 className="text-lg font-bold text-slate-950 leading-tight">{service.title}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.shortDescription}</p>
                  </div>
                </div>
                <div className="flex gap-2 p-6 pt-0 border-t border-slate-100 mt-4">
                  <Link href={`/hizmetler/${service.slug}`} className="btn btn-ghost flex-1 py-2 text-xs">
                    Detay
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/iletisim" className="btn btn-primary flex-1 py-2 text-xs">
                    Teklif al
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
