import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Boxes, CalendarDays, CircleDollarSign, FileText, Gauge, LogOut, MessageSquare, MousePointerClick, Users, Wrench } from "lucide-react";
import { companyConfig } from "@/data/site";
import { signOutAdmin } from "@/lib/admin/blog-actions";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { getTcmbRate } from "@/lib/admin/operations";

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

export async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="site-container flex min-h-16 flex-col gap-3 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 font-bold text-slate-950">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-amber-300">
                <Wrench className="h-5 w-5" />
              </span>
              {companyConfig.name} Admin
            </Link>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Suspense fallback={null}>
                <ExchangeRateBadge />
              </Suspense>
              <span className="hidden sm:inline">{admin?.displayName ?? admin?.email}</span>
              <form action={signOutAdmin}>
                <button type="submit" className="btn btn-ghost" aria-label="Çıkış yap">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 pt-2" aria-label="Admin menüsü">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">
                <Icon className="h-4 w-4 text-slate-400" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-container py-8">{children}</main>
    </div>
  );
}

async function ExchangeRateBadge() {
  let rate: Awaited<ReturnType<typeof getTcmbRate>> | null = null;
  try {
    rate = await getTcmbRate();
  } catch {
    rate = null;
  }
  if (!rate) return null;
  return (
    <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 md:inline">
      1 USD = {rate.rate.toLocaleString("tr-TR", { minimumFractionDigits: 4 })} TL · TCMB · {rate.rateDate}
      {rate.stale ? " · güncel değil" : ""}
    </span>
  );
}

