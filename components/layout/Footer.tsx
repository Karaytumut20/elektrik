import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { companyConfig, mainNavigation } from "@/data/site";
import { serviceAreas } from "@/data/areas";
import { services } from "@/data/services";
import { phoneHref } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Ana satır: Logo+İletişim | Sayfalar | Hizmetler */}
      <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr_1fr]">
        {/* Sol: Logo + Açıklama + İletişim */}
        <div>
          <div className="inline-block">
            <Logo variant="white" size="lg" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Konut ve iş yerleri için elektrik arıza, tesisat, pano, topraklama ve aydınlatma hizmetlerinde temiz işçilik ve güvenli uygulama.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <a href={phoneHref()} className="flex items-center gap-2 hover:text-amber-200">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {companyConfig.phone}
            </a>
            <a href={`mailto:${companyConfig.email}`} className="flex items-center gap-2 hover:text-amber-200">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {companyConfig.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {companyConfig.address}
            </p>
          </div>
        </div>

        {/* Orta: Sayfalar */}
        <FooterColumn title="Sayfalar" links={mainNavigation} />

        {/* Sağ: Hizmetler */}
        <FooterColumn
          title="Hizmetler"
          links={services.slice(0, 8).map((service) => ({
            label: service.title,
            href: `/hizmetler/${service.slug}`,
          }))}
        />
      </div>

      {/* Hizmet Bölgeleri – tam genişlik bant */}
      <div className="border-t border-white/10">
        <div className="site-container py-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-200">
            Hizmet Verdiğimiz Bölgeler
          </h2>
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/bolge/${area.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-200"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alt bar: Telif + Yasal linkler */}
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {companyConfig.name}. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/gizlilik-politikasi" className="hover:text-amber-200">
              Gizlilik
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-amber-200">
              Çerez
            </Link>
            <Link href="/kvkk" className="hover:text-amber-200">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase text-amber-200">{title}</h2>
      <ul className="mt-4 grid gap-2 text-sm text-slate-300">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-amber-200">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
