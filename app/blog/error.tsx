"use client";

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <section className="section-band bg-electric-mist">
      <div className="site-container rounded-lg border border-red-100 bg-red-50 p-6">
        <h1 className="text-2xl font-bold text-red-800">Blog yuklenemedi</h1>
        <p className="mt-2 text-red-700">Ag veya Supabase baglantisi gecici olarak yanit vermedi.</p>
        <button type="button" onClick={reset} className="btn btn-danger mt-4">
          Tekrar dene
        </button>
      </div>
    </section>
  );
}
