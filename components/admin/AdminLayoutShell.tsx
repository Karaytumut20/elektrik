"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/click-logs/login";

  useEffect(() => setMenuOpen(false), [pathname]);

  if (isLoginPage) return children;

  const navigation = (
    <nav className="space-y-1 px-3" aria-label="Admin menüsü">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch={false}
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
    <div data-admin-layout="true" className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {menuOpen ? <button type="button" className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-3 px-5 py-6">
          <Link href="/admin/dashboard" prefetch={false} className="flex items-center gap-3 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-amber-300 text-slate-950"><Wrench className="h-5 w-5" /></span>
            <span>{companyConfig.name} Admin</span>
          </Link>
          <button type="button" className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        {navigation}
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:justify-end">
          <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden" aria-label="Menüyü aç" onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex items-center gap-3">
            {adminLabel ? <span className="hidden text-sm text-slate-600 sm:inline">{adminLabel}</span> : null}
            <form action={signOutAdmin}>
              <button type="submit" className="btn btn-ghost" aria-label="Çıkış yap"><LogOut className="h-4 w-4" /></button>
            </form>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
