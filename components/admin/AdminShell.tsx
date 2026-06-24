import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, LogOut, Plus } from "lucide-react";
import { companyConfig } from "@/data/site";
import { signOutAdmin } from "@/lib/admin/blog-actions";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="site-container flex min-h-16 flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/blog" className="flex items-center gap-3 font-bold text-slate-950">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-amber-300">
              <FileText className="h-5 w-5" />
            </span>
            {companyConfig.name} Admin
          </Link>
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
