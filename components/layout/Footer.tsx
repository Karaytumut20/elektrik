import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { companyConfig, mainNavigation, serviceAreas } from "@/data/site";
import { services } from "@/data/services";
import { phoneHref } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="inline-block rounded-md bg-white p-3">
            <Logo />
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
            Konut ve iş yerleri için elektrik arıza, tesisat, pano, topraklama ve aydınlatma hizmetlerinde temiz işçilik ve güvenli uygulama.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
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

        <div className="grid gap-8 sm:grid-cols-3">
          <FooterColumn title="Sayfalar" links={mainNavigation} />
          <FooterColumn title="Hizmetler" links={services.slice(0, 6).map((service) => ({ label: service.title, href: `/hizmetler/${service.slug}` }))} />
          <div>
            <h2 className="text-sm font-bold uppercase text-amber-200">Hizmet Bölgeleri</h2>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300">
              {serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
