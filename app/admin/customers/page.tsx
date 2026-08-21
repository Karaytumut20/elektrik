import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { OperationForm } from "@/components/admin/OperationForm";
import { createCustomer } from "@/lib/admin/operations-actions";
import { canWrite, requireAdmin } from "@/lib/admin/auth";
import { getCustomers } from "@/lib/admin/operations";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const admin = await requireAdmin();
  const { q = "" } = await searchParams;
  const result = await getCustomers(q);
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Cari kartlar</p><h1 className="text-3xl font-bold">Müşteriler</h1></div>
      <form className="mb-5 grid gap-2 sm:flex"><input name="q" defaultValue={q} aria-label="Müşteri ara" placeholder="Ad veya telefon ara" className="min-h-11 w-full rounded-lg border border-slate-300 px-3 sm:flex-1" /><button className="btn btn-secondary w-full sm:w-auto" type="submit">Ara</button></form>
      <div className="admin-mobile-list">
        {result.data.map((customer) => <article className="admin-mobile-item" key={customer.id}><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-slate-950">{customer.name}</h2><p className="mt-1 text-sm text-slate-500">{customer.contact_name ?? "Kayıtlı müşteri"}</p></div><span className="status-badge">{customer.customer_type === "corporate" ? "Kurumsal" : "Bireysel"}</span></div><dl className="admin-mobile-metrics"><div><dt>Telefon</dt><dd>{customer.primary_phone}</dd></div><div><dt>Konum</dt><dd>{customer.district}, {customer.city}</dd></div>{customer.email ? <div className="col-span-2"><dt>E-posta</dt><dd className="truncate">{customer.email}</dd></div> : null}</dl><Link className="btn btn-secondary mt-3 w-full" href={`/admin/customers/${customer.id}`} prefetch={false}>Cari Profili Aç</Link></article>)}
        {result.data.length === 0 ? <div className="admin-mobile-item text-sm text-slate-500">{result.error ? "Müşteri tablosu henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</div> : null}
      </div>
      <div className="hidden sm:block"><div className="admin-table-wrap">
        <table className="admin-table"><thead><tr><th>Müşteri</th><th>Telefon</th><th>Konum</th><th>Tip</th><th /></tr></thead><tbody>
          {result.data.map((customer) => <tr key={customer.id}><td><strong>{customer.name}</strong><br /><span className="text-xs text-slate-500">{customer.contact_name}</span></td><td>{customer.primary_phone}<br />{customer.email}</td><td>{customer.district}, {customer.city}</td><td>{customer.customer_type === "corporate" ? "Kurumsal" : "Bireysel"}</td><td><Link className="font-semibold text-blue-700" href={`/admin/customers/${customer.id}`} prefetch={false}>Cari profil</Link></td></tr>)}
          {result.data.length === 0 ? <tr><td colSpan={5}>{result.error ? "Müşteri tablosu henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</td></tr> : null}
        </tbody></table>
      </div></div>
      {canWrite(admin.role) ? <section className="admin-card mt-6"><h2 className="mb-4 text-xl font-bold">Yeni Müşteri</h2><OperationForm action={createCustomer} submitLabel="Müşteriyi Kaydet" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-field"><label htmlFor="customer_type">Müşteri tipi</label><select id="customer_type" name="customer_type"><option value="individual">Bireysel</option><option value="corporate">Kurumsal</option></select></div>
        <div className="admin-field"><label htmlFor="name">Ad / unvan</label><input id="name" name="name" required /></div>
        <div className="admin-field"><label htmlFor="contact_name">Yetkili kişi</label><input id="contact_name" name="contact_name" /></div>
        <div className="admin-field"><label htmlFor="primary_phone">Birincil telefon</label><input id="primary_phone" name="primary_phone" required /></div>
        <div className="admin-field"><label htmlFor="secondary_phone">İkincil telefon</label><input id="secondary_phone" name="secondary_phone" /></div>
        <div className="admin-field"><label htmlFor="email">E-posta</label><input id="email" name="email" type="email" /></div>
        <div className="admin-field"><label htmlFor="tax_number">Vergi numarası</label><input id="tax_number" name="tax_number" /></div>
        <div className="admin-field"><label htmlFor="tax_office">Vergi dairesi</label><input id="tax_office" name="tax_office" /></div>
        <div className="admin-field"><label htmlFor="city">Şehir</label><input id="city" name="city" defaultValue="Tekirdağ" /></div>
        <div className="admin-field"><label htmlFor="district">İlçe</label><input id="district" name="district" defaultValue="Çorlu" /></div>
        <div className="admin-field lg:col-span-2"><label htmlFor="address">Adres</label><textarea id="address" name="address" /></div>
        <div className="admin-field lg:col-span-3"><label htmlFor="notes">Not</label><textarea id="notes" name="notes" /></div>
      </OperationForm></section> : null}
    </AdminShell>
  );
}
