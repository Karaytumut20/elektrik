import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CopyIpButton } from "@/components/admin/CopyIpButton";
import { requireAdmin } from "@/lib/admin/auth";
import { getGroupedAdClicks } from "@/lib/click-tracking/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Google Ads Tıklama Kayıtları", robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "medium" }).format(new Date(value));
}

export default async function ClickLogsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin();
  const requested = Number((await searchParams).days ?? "7");
  const days = ([1, 7, 30, 60].includes(requested) ? requested : 7) as 1 | 7 | 30 | 60;
  let report: Awaited<ReturnType<typeof getGroupedAdClicks>> | null = null;
  let loadError = false;
  try { report = await getGroupedAdClicks(days); } catch { loadError = true; }
  const suspicious = report?.groups.filter((group) => group.suspicious).length ?? 0;

  return (
    <AdminShell>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-amber-600">Yalnızca gclid / gbraid / wbraid</p><h1 className="text-3xl font-bold text-slate-950">Reklam Trafiği Raporu</h1></div>
          <nav className="flex gap-2" aria-label="Tarih filtresi">{[1, 7, 30, 60].map((value) => <Link key={value} href={`/admin/click-logs?days=${value}`} className={`btn ${days === value ? "btn-primary" : "btn-secondary"}`}>{value} gün</Link>)}</nav>
        </div>

        {loadError ? <div className="admin-card flex gap-3 text-amber-800"><AlertTriangle className="h-5 w-5 shrink-0" /><p>`ad_clicks` migration&apos;ı uygulanmamış veya Supabase service-role ayarı eksik. Kurulum tamamlanmadan rapor okunamaz.</p></div> : report ? <>
          <div className="admin-grid mb-6">
            <div className="admin-card"><p className="text-sm text-slate-500">Reklam tıklaması</p><p className="mt-1 text-3xl font-bold">{report.total}</p></div>
            <div className="admin-card"><p className="text-sm text-slate-500">Benzersiz IP</p><p className="mt-1 text-3xl font-bold">{report.groups.length}</p></div>
            <div className="admin-card"><p className="text-sm text-slate-500">24 saatte şüpheli IP</p><p className="mt-1 text-3xl font-bold text-red-700">{suspicious}</p></div>
            <div className="admin-card"><ShieldCheck className="mb-2 h-5 w-5 text-emerald-600" /><p className="text-sm text-slate-600">Kayıtlar en fazla 60 gün saklanır.</p></div>
          </div>
          {report.truncated ? <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Bu dönemde ilk 5.000 kayıt gösteriliyor.</p> : null}
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>IP / Ülke</th><th>Tıklama</th><th>İlk / Son ziyaret</th><th>Cihaz</th><th>Girilen sayfalar</th><th>Tıklama kodları</th><th>Durum</th></tr></thead><tbody>
            {report.groups.map((group) => <tr key={group.ip} className={group.suspicious ? "bg-red-50/60" : ""}>
              <td><code className="font-semibold text-slate-900">{group.ip}</code><p className="my-1 text-xs text-slate-500">{group.country}</p><CopyIpButton ip={group.ip} /></td>
              <td><strong>{group.clickCount}</strong><p className="text-xs text-slate-500">{group.distinctClickCount} farklı kod</p></td>
              <td><span className="text-xs">{formatDate(group.firstVisit)}</span><br /><span className="text-xs font-semibold">{formatDate(group.lastVisit)}</span></td>
              <td>{group.device}</td>
              <td><div className="max-w-xs space-y-1">{group.landingPages.slice(0, 4).map((page) => <code className="block truncate text-xs" title={page} key={page}>{page}</code>)}{group.landingPages.length > 4 ? <span className="text-xs text-slate-500">+{group.landingPages.length - 4} sayfa</span> : null}</div></td>
              <td><details><summary className="cursor-pointer text-sm font-semibold">{group.clickCodes.length} kod</summary><div className="mt-2 max-w-xs space-y-1">{group.clickCodes.map((code) => <code className="block break-all text-xs" key={code.id}>{code.type}: {code.id}</code>)}</div></details></td>
              <td>{group.suspicious ? <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700"><AlertTriangle className="h-3.5 w-3.5" /> Şüpheli</span> : <span className="status-badge">Normal</span>}</td>
            </tr>)}
            {report.groups.length === 0 ? <tr><td colSpan={7}>Seçilen dönemde reklam parametreli ziyaret yok.</td></tr> : null}
          </tbody></table></div>
        </> : null}
    </AdminShell>
  );
}
