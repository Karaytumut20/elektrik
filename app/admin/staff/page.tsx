import { AdminShell } from "@/components/admin/AdminShell";
import { OperationForm } from "@/components/admin/OperationForm";
import { createStaff } from "@/lib/admin/operations-actions";
import { requireRole } from "@/lib/admin/auth";
import { getStaff } from "@/lib/admin/operations";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requireRole(["super_admin", "manager", "editor"]);
  const result = await getStaff();
  return (
    <AdminShell>
      <div className="mb-6"><p className="text-sm font-semibold text-amber-600">Ekip yönetimi</p><h1 className="text-3xl font-bold">Personel</h1></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ad soyad</th><th>Görev</th><th>Telefon</th><th>Çalışma saatleri</th></tr></thead><tbody>
        {result.data.map((staff) => <tr key={staff.id}><td><strong>{staff.full_name}</strong></td><td>{staff.title ?? "—"}</td><td>{staff.phone ?? "—"}</td><td>{staff.work_start.slice(0,5)} – {staff.work_end.slice(0,5)}</td></tr>)}
        {result.data.length === 0 ? <tr><td colSpan={4}>{result.error ? "Personel tablosu henüz kurulmamış olabilir." : "Personel kaydı yok."}</td></tr> : null}
      </tbody></table></div>
      <section className="admin-card mt-6"><h2 className="mb-4 text-xl font-bold">Yeni Personel</h2><OperationForm action={createStaff} submitLabel="Personeli Kaydet" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-field"><label htmlFor="full_name">Ad soyad</label><input id="full_name" name="full_name" required /></div><div className="admin-field"><label htmlFor="title">Görev / unvan</label><input id="title" name="title" /></div><div className="admin-field"><label htmlFor="phone">Telefon</label><input id="phone" name="phone" /></div><div className="admin-field"><label htmlFor="email">E-posta</label><input id="email" name="email" type="email" /></div><div className="admin-field"><label htmlFor="work_start">Başlangıç</label><input id="work_start" name="work_start" type="time" defaultValue="08:00" /></div><div className="admin-field"><label htmlFor="work_end">Bitiş</label><input id="work_end" name="work_end" type="time" defaultValue="19:00" /></div><div className="admin-field sm:col-span-2 lg:col-span-3"><label htmlFor="notes">Not</label><textarea id="notes" name="notes" /></div>
      </OperationForm></section>
    </AdminShell>
  );
}
