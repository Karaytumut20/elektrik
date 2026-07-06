"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/site";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sayfa değiştiğinde mobil menüyü otomatik kapat
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="site-container flex min-h-20 items-center justify-between gap-4 py-3">
        <Logo />

        {/* Masaüstü Navigasyon */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana navigasyon">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Masaüstü Butonlar */}
        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={phoneHref()} variant="ghost">
            Hemen Ara
          </ButtonLink>
          <ButtonLink href="/iletisim" variant="primary">
            Ücretsiz Teklif Al
          </ButtonLink>
        </div>

        {/* Mobil Menü Butonu & Menüsü */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-100"
            aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>

          {isOpen && (
            <nav
              className="absolute right-0 top-[calc(100%+0.75rem)] grid w-[min(22rem,calc(100vw-2rem))] gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              aria-label="Mobil navigasyon"
            >
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid gap-2 pt-2 sm:grid-cols-2">
                <ButtonLink href={phoneHref()} variant="secondary" onClick={() => setIsOpen(false)}>
                  Hemen Ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl("Merhaba, elektrik hizmeti için bilgi almak istiyorum.")} variant="whatsapp" onClick={() => setIsOpen(false)}>
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </ButtonLink>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
