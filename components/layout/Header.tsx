import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/site";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="site-container flex min-h-20 items-center justify-between gap-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana navigasyon">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={phoneHref()} variant="ghost">
            Hemen Ara
          </ButtonLink>
          <ButtonLink href="/iletisim" variant="primary">
            Ücretsiz Teklif Al
          </ButtonLink>
        </div>
        <details className="group relative lg:hidden">
          <summary
            className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-md border border-slate-200 text-slate-900 [&::-webkit-details-marker]:hidden"
            aria-label="Menüyü aç veya kapat"
          >
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 top-[calc(100%+0.75rem)] grid w-[min(22rem,calc(100vw-2rem))] gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
            aria-label="Mobil navigasyon"
          >
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <ButtonLink href={phoneHref()} variant="secondary">
                Hemen Ara
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, elektrik hizmeti için bilgi almak istiyorum.")} variant="whatsapp">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
