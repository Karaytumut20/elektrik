import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClickLogLoginForm } from "@/components/admin/ClickLogLoginForm";
import { hasValidClickLogSession } from "@/lib/click-tracking/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reklam Tıklama Kayıtları Girişi", robots: { index: false, follow: false } };

export default async function ClickLogLoginPage() {
  if (await hasValidClickLogSession()) redirect("/admin/click-logs");
  return <section className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10"><div className="w-full max-w-md"><p className="mb-2 text-sm font-semibold text-amber-300">Yalnızca yönetici</p><h1 className="mb-6 text-3xl font-bold text-white">Reklam Tıklama Kayıtları</h1><ClickLogLoginForm /></div></section>;
}
