import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, MessageSquare, LogOut, Plus } from "lucide-react";
import { companyConfig } from "@/data/site";
import { signOutAdmin } from "@/lib/admin/blog-actions";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="site-container flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/admin/blog" className="flex items-center gap-3 font-bold text-slate-950">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-amber-300">
                <FileText className="h-5 w-5" />
              </span>
              {companyConfig.name} Admin
            </Link>
            <nav className="flex items-center gap-1 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
              <Link
                href="/admin/blog"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                Blog Yazıları
              </Link>
              <Link
                href="/admin/iletisim"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-slate-400" />
                Gelen Mesajlar
              </Link>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/blog/new" className="btn btn-secondary">
              <Plus className="h-4 w-4" />
              Yeni yazi
            </Link>
            <form action={signOutAdmin}>
              <button type="submit" className="btn btn-ghost">
                <LogOut className="h-4 w-4" />
                Cikis yap
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="site-container py-8">{children}</main>
    </div>
  );
}

