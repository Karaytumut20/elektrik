import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { serviceAreas } from "@/data/areas";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İnallar Elektrik Hizmet Bölgeleri | Mahalle Bazında Elektrik Hizmeti",
  description: "İnallar Elektrik olarak Çorlu Merkez, Alipaşa, Muhittin, Şeyhsinan, Reşadiye ve tüm mahallelerde elektrik arıza, tesisat, pano ve montaj hizmetleri.",
  path: "/bolge",
});

export default function BolgeListPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-electric-navy text-white">
        <div className="site-container relative py-12">
          <Breadcrumbs items={[{ label: "Hizmet Bölgeleri", href: "/bolge" }]} />
          <div className="mt-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <MapPin className="h-4 w-4" />
              Çorlu ve Çevre
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Hizmet Bölgelerimiz
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Çorlu merkez mahallelerinden Ergene ve Çerkezköy&apos;e kadar geniş bir alanda elektrik arıza, tesisat, pano ve montaj hizmetleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/bolge/${area.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={area.heroImage}
                    alt={area.name}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    quality={60}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-electric-navy/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-lg bg-electric-yellow">
                    <MapPin className="h-3.5 w-3.5 text-electric-navy" />
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-slate-950 group-hover:text-electric-blue transition-colors">
                    {area.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-5 text-slate-500 line-clamp-2">
                    {area.metaDescription.split(".")[0]}.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-electric-blue">
                    Detaya git
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
