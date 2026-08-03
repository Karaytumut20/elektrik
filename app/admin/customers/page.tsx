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
      <form className="mb-5 flex gap-2"><input name="q" defaultValue={q} aria-label="Müşteri ara" placeholder="Ad veya telefon ara" className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3" /><button className="btn btn-secondary" type="submit">Ara</button></form>
      <div className="admin-table-wrap">
        <table className="admin-table"><thead><tr><th>Müşteri</th><th>Telefon</th><th>Konum</th><th>Tip</th><th /></tr></thead><tbody>
          {result.data.map((customer) => <tr key={customer.id}><td><strong>{customer.name}</strong><br /><span className="text-xs text-slate-500">{customer.contact_name}</span></td><td>{customer.primary_phone}<br />{customer.email}</td><td>{customer.district}, {customer.city}</td><td>{customer.customer_type === "corporate" ? "Kurumsal" : "Bireysel"}</td><td><Link className="font-semibold text-blue-700" href={`/admin/customers/${customer.id}`}>Cari profil</Link></td></tr>)}
          {result.data.length === 0 ? <tr><td colSpan={5}>{result.error ? "Müşteri tablosu henüz kurulmamış olabilir." : "Kayıt bulunamadı."}</td></tr> : null}
        </tbody></table>
      </div>
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
