import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin, canSeeFinance } from "@/lib/admin/auth";
import { getCustomerProfile } from "@/lib/admin/operations";
import { appointmentStatusLabel, dateTime, money, orderStatusLabel } from "@/lib/admin/operations-types";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const result = await getCustomerProfile(id);
  if (!result.data) notFound();
  const { customer, appointments, orders, payments, materials, notes } = result.data;
  const validOrders = orders.filter((order) => order.status !== "cancelled");
  const tryTotal = validOrders.filter((o) => o.currency === "TRY").reduce((s, o) => s + Number(o.grand_total), 0);
  const tryPaid = validOrders.filter((o) => o.currency === "TRY").reduce((s, o) => s + Number(o.paid_amount), 0);
  const usdTotal = validOrders.filter((o) => o.currency === "USD").reduce((s, o) => s + Number(o.grand_total), 0);
  const usdPaid = validOrders.filter((o) => o.currency === "USD").reduce((s, o) => s + Number(o.paid_amount), 0);
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Müşteri cari profili</p><h1 className="text-3xl font-bold">{customer.name}</h1><p className="mt-1 text-slate-500">{customer.primary_phone} · {customer.district}, {customer.city}</p></div>
      {canSeeFinance(admin.role) ? <div className="admin-grid mb-6"><div className="admin-card"><p className="text-sm text-slate-500">TRY Faturalanan</p><strong>{money(tryTotal, "TRY")}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">TRY Kalan</p><strong>{money(Math.max(0, tryTotal - tryPaid), "TRY")}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">USD Faturalanan</p><strong>{money(usdTotal, "USD")}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">USD Kalan</p><strong>{money(Math.max(0, usdTotal - usdPaid), "USD")}</strong></div></div> : null}
      <div className="space-y-5">
        <section className="admin-card"><h2 className="mb-3 text-xl font-bold">Randevular</h2>{appointments.length ? appointments.map((a) => <p className="border-b border-slate-100 py-2 text-sm" key={a.id}>{dateTime(a.starts_at)} · {a.service_name} · {appointmentStatusLabel(a.status)}</p>) : <p className="text-sm text-slate-500">Randevu yok.</p>}</section>
        <section className="admin-card"><h2 className="mb-3 text-xl font-bold">Aktif ve Tamamlanan İşler</h2>{orders.length ? orders.map((o) => <p className="border-b border-slate-100 py-2 text-sm" key={o.id}>{o.order_number} · {o.service_name} · {orderStatusLabel(o.status)} {canSeeFinance(admin.role) ? `· ${money(o.grand_total, o.currency)}` : ""}</p>) : <p className="text-sm text-slate-500">İş emri yok.</p>}</section>
        <section className="admin-card"><h2 className="mb-3 text-xl font-bold">Kullanılan Malzemeler ve Garanti</h2>{materials.length ? materials.map((m) => { const end = m.warranty_end_date ? new Date(m.warranty_end_date) : null; const state = !end ? "Garanti bilgisi yok" : end < new Date() ? "Süresi doldu" : end.getTime() - Date.now() < 90 * 86400000 ? "Bitmesine az kaldı" : "Garanti devam ediyor"; return <p className="border-b border-slate-100 py-2 text-sm" key={m.id}><strong>{m.name}</strong> · Seri: {m.serial_number ?? "—"} · {m.supplier_name ?? "Tedarikçi yok"} · <span className="status-badge">{state}</span></p>; }) : <p className="text-sm text-slate-500">Malzeme geçmişi yok.</p>}</section>
        <section className="admin-card"><h2 className="mb-3 text-xl font-bold">Tahsilatlar</h2>{payments.length ? payments.map((p) => <p className="border-b border-slate-100 py-2 text-sm" key={p.id}>{dateTime(p.paid_at)} · {money(p.amount, p.currency)} · {p.description ?? "Tahsilat"}</p>) : <p className="text-sm text-slate-500">Tahsilat yok.</p>}</section>
        <section className="admin-card"><h2 className="mb-3 text-xl font-bold">Notlar</h2>{notes.length ? notes.map((n) => <p className="border-b border-slate-100 py-2 text-sm" key={n.id}>{n.note}</p>) : <p className="text-sm text-slate-500">Not yok.</p>}</section>
      </div>
    </AdminShell>
  );
}
