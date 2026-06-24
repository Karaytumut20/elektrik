import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Admin Giris",
  description: "Blog yonetimi icin admin giris ekrani.",
  path: "/admin/login",
  noIndex: true,
});

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ setup?: string; logged_out?: string }> }) {
  const params = await searchParams;

  return (
    <section className="grid min-h-screen place-items-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <p className="text-sm font-semibold uppercase text-amber-300">{companyConfig.name}</p>
          <h1 className="mt-2 text-3xl font-bold">Admin girisi</h1>
          <p className="mt-2 text-sm text-slate-300">Bu panel yalnizca blog yazilarini yonetir.</p>
        </div>
        {params.setup === "missing-env" ? (
          <p className="mb-4 rounded-md bg-amber-100 p-3 text-sm font-semibold text-amber-900">
            Supabase ortam degiskenleri henuz tanimli degil. .env.example dosyasindaki degerleri doldurun.
          </p>
        ) : null}
        {params.logged_out ? <p className="mb-4 rounded-md bg-emerald-100 p-3 text-sm font-semibold text-emerald-900">Cikis yapildi.</p> : null}
        <Suspense fallback={<div className="rounded-lg bg-white p-6 text-slate-700">Form yukleniyor...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
