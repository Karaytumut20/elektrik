"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation } from "@/data/site";
import { cn } from "@/lib/cn";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">


      <div className="site-container flex min-h-20 items-center justify-between gap-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana navigasyon">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                pathname === item.href && "bg-amber-100 text-slate-950",
              )}
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
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 text-slate-900 lg:hidden"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="site-container grid gap-2 py-4" aria-label="Mobil navigasyon">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-base font-bold text-slate-800 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid gap-2 pt-2 sm:grid-cols-2">
              <ButtonLink href={phoneHref()} variant="secondary" onClick={() => setOpen(false)}>
                Hemen Ara
              </ButtonLink>
              <ButtonLink href={whatsappUrl("Merhaba, elektrik hizmeti için bilgi almak istiyorum.")} variant="whatsapp" onClick={() => setOpen(false)}>
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
