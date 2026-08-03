import Link from "next/link";
import { AlertTriangle, CalendarDays, CircleDollarSign, PackageSearch, Users, Wrench } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/admin/operations";
import { money } from "@/lib/admin/operations-types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();
  const result = await getDashboardData();
  const data = result.data;
  const cards = data ? [
    ["Bugün Randevu", data.todayAppointments, CalendarDays, "/admin/calendar?view=day"],
    ["Yarın Randevu", data.tomorrowAppointments, CalendarDays, "/admin/calendar?view=day&offset=1"],
    ["Aktif İşler", data.activeOrders, Wrench, "/admin/work-orders?status=active"],
    ["Haftalık Biten", data.weeklyFinished, Wrench, "/admin/work-orders?status=completed"],
    ["Tahsilat Bekleyen", data.waitingPayment, CircleDollarSign, "/admin/accounting?filter=waiting"],
    ["Toplam Müşteri", data.customers, Users, "/admin/customers"],
    ["Düşük Stok", data.lowStock, PackageSearch, "/admin/inventory?filter=low"],
  ] as const : [];
  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-sm font-semibold text-amber-600">Operasyon merkezi</p>
        <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>
      {result.error || !data ? (
        <div className="admin-card flex gap-3 text-amber-800"><AlertTriangle className="h-5 w-5 shrink-0" /><p>Operasyon şeması henüz uygulanmamış olabilir. Migration dosyasını çalıştırdıktan sonra göstergeler burada görünecek.</p></div>
      ) : (
        <>
          <div className="admin-grid">
            {cards.map(([label, value, Icon, href]) => (
              <Link href={href} className="admin-card transition hover:-translate-y-0.5 hover:shadow-md" key={label}>
                <Icon className="mb-4 h-5 w-5 text-amber-500" />
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="admin-card">
              <p className="text-sm font-medium text-slate-500">TRY Kalan Alacak</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{money(data.receivableTRY, "TRY")}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm font-medium text-slate-500">USD Kalan Alacak</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{money(data.receivableUSD, "USD")}</p>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
