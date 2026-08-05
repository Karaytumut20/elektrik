export default function AdminLoading() {
  return (
    <div className="site-container animate-pulse py-8" role="status" aria-label="Yönetim paneli yükleniyor">
      <div className="mb-6 h-9 w-64 rounded-lg bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div className="h-28 rounded-xl border border-slate-200 bg-white" key={item} />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-xl border border-slate-200 bg-white" />
      <span className="sr-only">Yükleniyor…</span>
    </div>
  );
}
