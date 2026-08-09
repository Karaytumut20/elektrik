import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { FullPaymentForm } from "@/components/admin/FullPaymentForm";
import { requireRole } from "@/lib/admin/auth";
import { getServiceOrders } from "@/lib/admin/operations";
import { money, orderStatusLabel } from "@/lib/admin/operations-types";

export const dynamic = "force-dynamic";

export default async function AccountingPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string }> }) {
  const admin = await requireRole(["super_admin", "manager", "editor", "viewer"]);
  const { q = "", filter } = await searchParams;
  const result = await getServiceOrders(q);
  const valid = result.data.filter((order) => order.status !== "cancelled");
  const rows = filter === "waiting" ? valid.filter((order) => Number(order.grand_total) - Number(order.paid_amount) > 0.01) : valid;
  const summarize = (currency: "TRY" | "USD") => {
    const selected = valid.filter((item) => item.currency === currency);
    return {
      invoiced: selected.reduce((s, o) => s + Number(o.grand_total), 0),
      paid: selected.reduce((s, o) => s + Number(o.paid_amount), 0),
      cost: selected.reduce((s, o) => s + Number(o.total_cost), 0),
    };
  };
  const tryBox = summarize("TRY");
  const usdBox = summarize("USD");
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Cari ve finans</p><h1 className="text-3xl font-bold">Muhasebe</h1></div>
      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        {([["TRY", tryBox], ["USD", usdBox]] as const).map(([currency, box]) => <section className="admin-card" key={currency}><h2 className="mb-4 text-xl font-bold">{currency} Kasası</h2><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-slate-500">Faturalanan</p><strong>{money(box.invoiced, currency)}</strong></div><div><p className="text-slate-500">Tahsil Edilen</p><strong>{money(box.paid, currency)}</strong></div><div><p className="text-slate-500">Kalan Alacak</p><strong>{money(Math.max(0, box.invoiced - box.paid), currency)}</strong></div><div><p className="text-slate-500">Toplam Maliyet</p><strong>{money(box.cost, currency)}</strong></div></div></section>)}
      </div>
      <form className="mb-5 flex gap-2"><input name="q" defaultValue={q} placeholder="Müşteri veya iş emri ara" aria-label="Muhasebede ara" className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3" /><button className="btn btn-secondary" type="submit">Ara</button></form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>İş Emri</th><th>Müşteri</th><th>İşlem Tutarı</th><th>Tahsil Edilen</th><th>Kalan</th><th>Net Kâr</th><th>Servis</th><th /></tr></thead><tbody>
        {rows.map((order) => { const remaining = Math.max(0, Number(order.grand_total) - Number(order.paid_amount)); return <tr key={order.id}><td><Link className="font-semibold text-blue-700" href={`/admin/work-orders/${order.id}`} prefetch={false}>{order.order_number}</Link></td><td>{order.customer?.name}</td><td>{money(order.grand_total, order.currency)}</td><td>{money(order.paid_amount, order.currency)}</td><td>{money(remaining, order.currency)}</td><td>{money(order.net_profit, order.currency)}</td><td>{orderStatusLabel(order.status)}</td><td>{remaining > 0.01 && admin.role !== "viewer" ? <FullPaymentForm customerId={order.customer_id} orderId={order.id} amount={remaining} currency={order.currency} exchangeRate={order.exchange_rate} /> : remaining <= 0.01 ? "Ödendi" : "Salt görüntüleme"}</td></tr>; })}
        {rows.length === 0 ? <tr><td colSpan={8}>{result.error ? "Muhasebe tabloları henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</td></tr> : null}
      </tbody></table></div>
    </AdminShell>
  );
}
