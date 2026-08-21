import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { OperationForm } from "@/components/admin/OperationForm";
import { createCustomer, createInventoryItem, createQuickServiceOrder } from "@/lib/admin/operations-actions";
import { canSeeFinance, canWrite, requireAdmin } from "@/lib/admin/auth";
import { getCustomers, getInventory, getServiceOrders } from "@/lib/admin/operations";
import { money, orderStatusLabel } from "@/lib/admin/operations-types";

export const dynamic = "force-dynamic";

export default async function WorkOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; payment?: string }> }) {
  const admin = await requireAdmin();
  const { q = "", payment } = await searchParams;
  const [ordersResult, customersResult, inventoryResult] = await Promise.all([getServiceOrders(q), getCustomers(), getInventory()]);
  const filtered = ordersResult.data.filter((order) => {
    const remaining = Number(order.grand_total) - Number(order.paid_amount);
    if (payment === "unpaid") return Number(order.paid_amount) <= 0 && remaining > 0.01;
    if (payment === "partial") return Number(order.paid_amount) > 0 && remaining > 0.01;
    if (payment === "paid") return remaining <= 0.01;
    return true;
  });
  const active = ordersResult.data.filter((o) => !["completed", "cancelled"].includes(o.status)).length;
  const completed = ordersResult.data.filter((o) => o.status === "completed").length;
  const remainingTRY = ordersResult.data.filter((o) => o.currency === "TRY" && o.status !== "cancelled").reduce((s, o) => s + Math.max(0, Number(o.grand_total) - Number(o.paid_amount)), 0);
  const remainingUSD = ordersResult.data.filter((o) => o.currency === "USD" && o.status !== "cancelled").reduce((s, o) => s + Math.max(0, Number(o.grand_total) - Number(o.paid_amount)), 0);
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Servis operasyonu</p><h1 className="text-3xl font-bold">İş Emirleri</h1></div>
      <div className="admin-grid mb-6"><div className="admin-card"><p className="text-sm text-slate-500">Aktif İşler</p><strong className="text-2xl">{active}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">Tamamlanan İşler</p><strong className="text-2xl">{completed}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">TRY Kalan Alacak</p><strong>{money(remainingTRY, "TRY")}</strong></div><div className="admin-card"><p className="text-sm text-slate-500">USD Kalan Alacak</p><strong>{money(remainingUSD, "USD")}</strong></div></div>
      <form className="mb-5 grid gap-2 sm:flex"><input name="q" defaultValue={q} placeholder="İş emri, hizmet veya müşteri ara" aria-label="İş emri ara" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 sm:flex-1" /><select name="payment" defaultValue={payment} aria-label="Ödeme filtresi" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 sm:w-auto"><option value="">Tüm ödemeler</option><option value="unpaid">Hiç ödenmeyen</option><option value="partial">Kısmi ödenen</option><option value="paid">Tamamı ödenen</option></select><button className="btn btn-secondary w-full sm:w-auto" type="submit">Filtrele</button></form>
      <div className="admin-mobile-list">
        {filtered.map((order) => { const remaining = Math.max(0, Number(order.grand_total) - Number(order.paid_amount)); const paymentState = remaining <= 0.01 ? "Tamamı ödendi" : Number(order.paid_amount) > 0 ? "Kısmi ödendi" : "Ödenmedi"; return <article className="admin-mobile-item" key={order.id}><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-slate-950">{order.order_number}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString("tr-TR")}</p></div><span className="status-badge">{paymentState}</span></div><div className="mt-3"><p className="font-semibold text-slate-900">{order.customer?.name}</p><p className="mt-0.5 text-sm text-slate-500">{order.service_name}</p></div><dl className="admin-mobile-metrics"><div><dt>Toplam</dt><dd>{money(order.grand_total, order.currency)}</dd></div><div><dt>Kalan</dt><dd>{money(remaining, order.currency)}</dd></div><div><dt>Servis</dt><dd>{orderStatusLabel(order.status)}</dd></div><div><dt>Ödeme</dt><dd>{paymentState}</dd></div></dl><Link className="btn btn-secondary mt-3 w-full" href={`/admin/work-orders/${order.id}`} prefetch={false}>Detayı Aç</Link></article>; })}
        {filtered.length === 0 ? <div className="admin-mobile-item text-sm text-slate-500">{ordersResult.error ? "İş emri tablosu henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</div> : null}
      </div>
      <div className="hidden sm:block"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>İş emri</th><th>Müşteri / Hizmet</th><th>Toplam</th><th>Kalan</th><th>Ödeme</th><th>Servis</th><th /></tr></thead><tbody>
        {filtered.map((order) => { const remaining = Math.max(0, Number(order.grand_total) - Number(order.paid_amount)); const paymentState = remaining <= 0.01 ? "Tamamı ödendi" : Number(order.paid_amount) > 0 ? "Kısmi ödendi" : "Ödenmedi"; return <tr key={order.id}><td><strong>{order.order_number}</strong><br /><span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString("tr-TR")}</span></td><td>{order.customer?.name}<br /><span className="text-xs text-slate-500">{order.service_name}</span></td><td>{money(order.grand_total, order.currency)}</td><td>{money(remaining, order.currency)}</td><td><span className="status-badge">{paymentState}</span></td><td>{orderStatusLabel(order.status)}</td><td><Link className="font-semibold text-blue-700" href={`/admin/work-orders/${order.id}`} prefetch={false}>Detay</Link></td></tr>; })}
        {filtered.length === 0 ? <tr><td colSpan={7}>{ordersResult.error ? "İş emri tablosu henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</td></tr> : null}
      </tbody></table></div></div>
      {canWrite(admin.role) ? <section className="admin-card mt-6"><h2 className="mb-1 text-xl font-bold">Hızlı İşlem</h2><p className="mb-4 text-sm text-slate-500">İş emri, opsiyonel stok çıkışı, peşin tahsilat ve ileri tarihli randevu tek transaction içinde kaydedilir.</p><OperationForm action={createQuickServiceOrder} submitLabel="Hızlı İşlemi Tamamla" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input type="hidden" name="idempotency_key" value={crypto.randomUUID()} />
        <div className="admin-field lg:col-span-2"><label htmlFor="order_customer">Müşteri</label><select id="order_customer" name="customer_id" required><option value="">Seçin</option>{customersResult.data.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.primary_phone}</option>)}</select></div>
        <div className="admin-field"><label htmlFor="order_status">Durum</label><select id="order_status" name="status"><option value="draft">Taslak</option><option value="started">İşlem Başladı</option></select></div>
        <div className="admin-field lg:col-span-2"><label htmlFor="order_service">Hizmet / işlem</label><input id="order_service" name="service_name" required /></div>
        <div className="admin-field"><label htmlFor="order_price">Hizmet satış fiyatı</label><input id="order_price" name="labor_sale" type="number" min="0" step="0.01" /></div>
        <div className="admin-field"><label htmlFor="order_currency">Para birimi</label><select id="order_currency" name="currency"><option>TRY</option><option>USD</option></select></div>
        <div className="admin-field"><label htmlFor="order_rate">USD/TL işlem kuru (USD ise)</label><input id="order_rate" name="exchange_rate" type="number" min="0" step="0.0001" inputMode="decimal" /></div>
        <input type="hidden" name="exchange_rate_date" value="" />
        <div className="admin-field lg:col-span-2"><label htmlFor="quick_material">Stoktan malzeme (opsiyonel)</label><select id="quick_material" name="material_id"><option value="">Seçilmedi</option>{inventoryResult.data.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.stock_quantity} {item.unit}</option>)}</select></div>
        <div className="admin-field"><label htmlFor="material_quantity">Malzeme miktarı</label><input id="material_quantity" name="material_quantity" type="number" min="0" step="0.001" /></div>
        <div className="admin-field lg:col-span-2"><label htmlFor="material_name">Harici malzeme adı (opsiyonel)</label><input id="material_name" name="material_name" /></div>
        <div className="admin-field"><label htmlFor="payment_method">Peşin ödeme yöntemi</label><select id="payment_method" name="payment_method"><option value="cash">Nakit</option><option value="credit_card">Kredi Kartı</option><option value="bank_transfer">Banka Havalesi</option><option value="eft">EFT</option></select></div>
        <label className="flex items-center gap-2 text-sm font-semibold lg:col-span-3"><input type="checkbox" name="paid" /> İşlem peşin ödendi</label>
        <div className="admin-field"><label htmlFor="appointment_starts_at">İleri tarihli randevu başlangıcı</label><input id="appointment_starts_at" name="appointment_starts_at" type="datetime-local" /></div>
        <div className="admin-field"><label htmlFor="appointment_ends_at">Randevu bitişi</label><input id="appointment_ends_at" name="appointment_ends_at" type="datetime-local" /></div>
        <div className="admin-field lg:col-span-3"><label htmlFor="order_note">Teknik not</label><textarea id="order_note" name="technician_note" /></div>
      </OperationForm>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <details className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer font-bold">Formdan ayrılmadan müşteri ekle</summary><OperationForm action={createCustomer} submitLabel="Müşteriyi Ekle ve Seç" className="mt-4 space-y-3" targetSelectId="order_customer"><div className="admin-field"><label htmlFor="quick_order_customer_name">Ad / unvan</label><input id="quick_order_customer_name" name="name" required /></div><div className="admin-field"><label htmlFor="quick_order_phone">Telefon</label><input id="quick_order_phone" name="primary_phone" required /></div><input type="hidden" name="customer_type" value="individual" /></OperationForm></details>
          {canSeeFinance(admin.role) ? <details className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer font-bold">Formdan ayrılmadan stok kartı ekle</summary><OperationForm action={createInventoryItem} submitLabel="Malzemeyi Ekle ve Seç" className="mt-4 space-y-3" targetSelectId="quick_material"><div className="admin-field"><label htmlFor="quick_stock_name">Malzeme adı</label><input id="quick_stock_name" name="name" required /></div><div className="admin-field"><label htmlFor="quick_stock_quantity">Stok miktarı</label><input id="quick_stock_quantity" name="stock_quantity" type="number" min="0" step="0.001" /></div><div className="admin-field"><label htmlFor="quick_stock_cost">Birim alış fiyatı</label><input id="quick_stock_cost" name="unit_purchase_price" type="number" min="0" step="0.01" /></div></OperationForm></details> : null}
        </div>
      </section> : null}
    </AdminShell>
  );
}
