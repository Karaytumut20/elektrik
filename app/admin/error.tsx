"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
      <AlertTriangle className="h-7 w-7 text-amber-600" />
      <h1 className="mt-4 text-2xl font-bold text-slate-950">Panel geçici olarak yüklenemedi</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Oturumunuz kapatılmadı. Sunucu bağlantısı kısa süreli kesilmiş olabilir; yeniden deneyin.
      </p>
      <button type="button" className="btn btn-primary mt-5" onClick={reset}>
        <RefreshCw className="h-4 w-4" /> Yeniden dene
      </button>
    </section>
  );
}
