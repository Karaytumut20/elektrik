import { AdminShell } from "@/components/admin/AdminShell";
import { OperationForm } from "@/components/admin/OperationForm";
import { createInventoryItem } from "@/lib/admin/operations-actions";
import { canSeeFinance, requireAdmin } from "@/lib/admin/auth";
import { getInventory } from "@/lib/admin/operations";
import { money } from "@/lib/admin/operations-types";

export const dynamic = "force-dynamic";

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const admin = await requireAdmin();
  const { filter } = await searchParams;
  const result = await getInventory();
  const items = filter === "low" ? result.data.filter((item) => Number(item.stock_quantity) <= Number(item.minimum_stock)) : result.data;
  const finance = canSeeFinance(admin.role);
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Malzeme yönetimi</p><h1 className="text-3xl font-bold">Stok</h1></div>
      <div className="admin-mobile-list">
        {items.map((item) => { const low = Number(item.stock_quantity) <= Number(item.minimum_stock); return <article className="admin-mobile-item" key={item.id}><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-950">{item.name}</h2><p className="mt-1 text-sm text-slate-500">{item.category ?? "Genel"} · {item.brand ?? "Markasız"}</p></div><span className={low ? "status-badge bg-red-50 text-red-700" : "status-badge"}>{low ? "Düşük stok" : "Stokta"}</span></div><dl className="admin-mobile-metrics"><div><dt>Stok</dt><dd>{item.stock_quantity} {item.unit}</dd></div><div><dt>Minimum</dt><dd>{item.minimum_stock} {item.unit}</dd></div><div><dt>SKU / Konum</dt><dd>{item.sku ?? item.storage_location ?? "—"}</dd></div><div><dt>Tedarikçi</dt><dd>{item.supplier_name ?? "—"}</dd></div>{finance ? <><div><dt>Alış</dt><dd>{money(item.unit_purchase_price, "TRY")}</dd></div><div><dt>Satış</dt><dd>{item.unit_sale_price == null ? "—" : money(item.unit_sale_price, "TRY")}</dd></div></> : null}</dl></article>; })}
        {items.length === 0 ? <div className="admin-mobile-item text-sm text-slate-500">{result.error ? "Stok tablosu henüz kurulmamış olabilir." : "Malzeme bulunamadı."}</div> : null}
      </div>
      <div className="hidden sm:block"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Malzeme</th><th>SKU / Konum</th><th>Stok</th><th>Minimum</th>{finance ? <><th>Alış</th><th>Satış</th></> : null}<th>Tedarikçi</th></tr></thead><tbody>
        {items.map((item) => { const low = Number(item.stock_quantity) <= Number(item.minimum_stock); return <tr key={item.id}><td><strong>{item.name}</strong><br /><span className="text-xs text-slate-500">{item.category} · {item.brand} {item.model}</span></td><td>{item.sku ?? "—"}<br /><span className="text-xs">{item.storage_location ?? "Konum yok"}</span></td><td><span className={low ? "rounded-full bg-red-50 px-2 py-1 font-bold text-red-700" : ""}>{item.stock_quantity} {item.unit}</span></td><td>{item.minimum_stock} {item.unit}</td>{finance ? <><td>{money(item.unit_purchase_price, "TRY")}</td><td>{item.unit_sale_price == null ? "—" : money(item.unit_sale_price, "TRY")}</td></> : null}<td>{item.supplier_name ?? "—"}</td></tr>; })}
        {items.length === 0 ? <tr><td colSpan={finance ? 7 : 5}>{result.error ? "Stok tablosu henüz kurulmamış olabilir." : "Malzeme bulunamadı."}</td></tr> : null}
      </tbody></table></div></div>
      {finance ? <section className="admin-card mt-6"><h2 className="mb-4 text-xl font-bold">Yeni Malzeme</h2><OperationForm action={createInventoryItem} submitLabel="Malzemeyi Kaydet" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-field lg:col-span-2"><label htmlFor="name">Malzeme / ürün adı</label><input id="name" name="name" required /></div><div className="admin-field"><label htmlFor="category">Kategori</label><input id="category" name="category" /></div><div className="admin-field"><label htmlFor="brand">Marka</label><input id="brand" name="brand" /></div><div className="admin-field"><label htmlFor="model">Model</label><input id="model" name="model" /></div><div className="admin-field"><label htmlFor="barcode">Barkod</label><input id="barcode" name="barcode" /></div><div className="admin-field"><label htmlFor="sku">SKU</label><input id="sku" name="sku" /></div><div className="admin-field"><label htmlFor="unit">Birim</label><input id="unit" name="unit" defaultValue="adet" /></div>
        <div className="admin-field"><label htmlFor="stock_quantity">Stok miktarı</label><input id="stock_quantity" name="stock_quantity" type="number" min="0" step="0.001" /></div><div className="admin-field"><label htmlFor="minimum_stock">Minimum stok</label><input id="minimum_stock" name="minimum_stock" type="number" min="0" step="0.001" /></div><div className="admin-field"><label htmlFor="unit_purchase_price">Birim alış fiyatı</label><input id="unit_purchase_price" name="unit_purchase_price" type="number" min="0" step="0.01" /></div><div className="admin-field"><label htmlFor="unit_sale_price">Opsiyonel satış fiyatı</label><input id="unit_sale_price" name="unit_sale_price" type="number" min="0" step="0.01" /></div>
        <div className="admin-field"><label htmlFor="supplier_name">Tedarikçi</label><input id="supplier_name" name="supplier_name" /></div><div className="admin-field"><label htmlFor="purchase_date">Alış tarihi</label><input id="purchase_date" name="purchase_date" type="date" /></div><div className="admin-field"><label htmlFor="document_number">Fatura / irsaliye</label><input id="document_number" name="document_number" /></div><div className="admin-field"><label htmlFor="warranty_months">Garanti (ay)</label><input id="warranty_months" name="warranty_months" type="number" min="0" /></div><div className="admin-field"><label htmlFor="storage_location">Depo / raf konumu</label><input id="storage_location" name="storage_location" /></div><div className="admin-field lg:col-span-3"><label htmlFor="description">Açıklama</label><textarea id="description" name="description" /></div>
      </OperationForm></section> : null}
    </AdminShell>
  );
}
