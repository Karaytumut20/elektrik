"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Boxes, CalendarDays, CircleDollarSign, FileText, Gauge, LogOut, Menu, MessageSquare, MousePointerClick, Users, Wrench, X } from "lucide-react";
import { companyConfig } from "@/data/site";
import { signOutAdmin } from "@/lib/admin/blog-actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/admin/calendar", label: "Takvim", icon: CalendarDays },
  { href: "/admin/customers", label: "Müşteriler", icon: Users },
  { href: "/admin/staff", label: "Personel", icon: Users },
  { href: "/admin/work-orders", label: "İş Emirleri", icon: Wrench },
  { href: "/admin/inventory", label: "Stok", icon: Boxes },
  { href: "/admin/accounting", label: "Muhasebe", icon: CircleDollarSign },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/iletisim", label: "Mesajlar", icon: MessageSquare },
  { href: "/admin/click-logs", label: "Reklam Tıklamaları", icon: MousePointerClick },
];

export function AdminLayoutShell({ adminLabel, children }: { adminLabel: string | null; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/click-logs/login";

  useEffect(() => setMenuOpen(false), [pathname]);

  if (isLoginPage) return children;

  const navigation = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Admin menüsü">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch={false}
            onPointerEnter={() => router.prefetch(href)}
            onFocus={() => router.prefetch(href)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-amber-300 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-slate-950" : "text-slate-400"}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div data-admin-layout="true" className="min-h-dvh bg-slate-50 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
      {menuOpen ? <button type="button" className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[min(84vw,18rem)] border-r border-slate-800 bg-slate-950 text-white transition-transform lg:relative lg:inset-auto lg:z-auto lg:min-h-full lg:w-full lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex min-h-dvh flex-col lg:sticky lg:top-0 lg:h-dvh lg:min-h-0">
          <div className="flex items-center justify-between gap-3 px-4 py-5">
            <Link href="/admin/dashboard" prefetch={false} className="flex min-w-0 items-center gap-3 font-bold">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-300 text-slate-950"><Wrench className="h-5 w-5" /></span>
              <span className="truncate text-sm">{companyConfig.name}<span className="block text-xs font-medium text-slate-400">Yönetim Paneli</span></span>
            </Link>
            <button type="button" className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          {navigation}
          <div className="mt-auto border-t border-slate-800 p-3">
            {adminLabel ? <p className="mb-2 truncate px-2 text-xs text-slate-400" title={adminLabel}>{adminLabel}</p> : null}
            <form action={signOutAdmin}>
              <button type="submit" className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                <LogOut className="h-4 w-4" /> Çıkış Yap
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:px-5 lg:hidden">
          <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden" aria-label="Menüyü aç" onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" /></button>
          <span className="truncate px-3 text-sm font-bold text-slate-900">{companyConfig.name} Admin</span>
          <span className="h-10 w-10" aria-hidden="true" />
        </header>
        <main className="mx-auto w-full max-w-[1680px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
