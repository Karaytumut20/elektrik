import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { CalendarBoard } from "@/components/admin/CalendarBoard";
import { OperationForm } from "@/components/admin/OperationForm";
import { createCustomer, createStaff, saveAppointment } from "@/lib/admin/operations-actions";
import { requireAdmin, canWrite } from "@/lib/admin/auth";
import { getAppointments, getCustomers, getStaff } from "@/lib/admin/operations";

export const dynamic = "force-dynamic";

function localInput(date: Date) {
  const shifted = new Date(date.getTime() + 3 * 3600000);
  return shifted.toISOString().slice(0, 16);
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const view = ["month", "week", "day", "upcoming"].includes(params.view ?? "") ? params.view! : "month";
  const base = params.date ? new Date(`${params.date}T12:00:00+03:00`) : new Date();
  if (params.offset) base.setDate(base.getDate() + Number(params.offset));
  let from: Date;
  let to: Date;
  let gridStart: Date;
  if (view === "day") {
    from = new Date(base); from.setHours(0, 0, 0, 0);
    to = new Date(from.getTime() + 86400000);
    gridStart = from;
  } else if (view === "week") {
    from = new Date(base);
    const day = (from.getDay() + 6) % 7;
    from.setDate(from.getDate() - day); from.setHours(0, 0, 0, 0);
    to = new Date(from.getTime() + 7 * 86400000);
    gridStart = from;
  } else if (view === "upcoming") {
    from = new Date();
    to = new Date(from.getTime() + 30 * 86400000);
    gridStart = from;
  } else {
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    gridStart = new Date(first); gridStart.setDate(first.getDate() - offset); gridStart.setHours(0, 0, 0, 0);
    from = gridStart;
    to = new Date(gridStart.getTime() + 42 * 86400000);
  }
  const [appointmentResult, customerResult, staffResult] = await Promise.all([
    getAppointments(from.toISOString(), to.toISOString()), getCustomers(), getStaff(),
  ]);
  const editing = params.edit ? appointmentResult.data.find((item) => item.id === params.edit) : null;
  const dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(base);
  const previous = new Date(base); previous.setMonth(previous.getMonth() - (view === "month" ? 1 : 0)); previous.setDate(previous.getDate() - (view === "week" ? 7 : view === "day" ? 1 : 0));
  const next = new Date(base); next.setMonth(next.getMonth() + (view === "month" ? 1 : 0)); next.setDate(next.getDate() + (view === "week" ? 7 : view === "day" ? 1 : 0));
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 3600000);

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold text-amber-600">Planlama</p><h1 className="text-3xl font-bold text-slate-950">Takvim ve Randevular</h1></div>
        <div className="flex flex-wrap gap-2">
          {["month", "week", "day", "upcoming"].map((item) => <Link key={item} href={`/admin/calendar?view=${item}&date=${dateKey}`} className={`btn ${view === item ? "btn-primary" : "btn-secondary"}`}>{({ month: "Aylık", week: "Haftalık", day: "Günlük", upcoming: "Yaklaşan" } as Record<string, string>)[item]}</Link>)}
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Link className="btn btn-secondary" href={`/admin/calendar?view=${view}&date=${previous.toISOString().slice(0,10)}`}>Önceki</Link>
        <Link className="btn btn-ghost" href={`/admin/calendar?view=${view}`}>Bugün</Link>
        <Link className="btn btn-secondary" href={`/admin/calendar?view=${view}&date=${next.toISOString().slice(0,10)}`}>Sonraki</Link>
      </div>
      {appointmentResult.error ? <div className="admin-card mb-5 text-amber-800">Takvim tabloları henüz kurulmamış olabilir.</div> : <CalendarBoard initialAppointments={appointmentResult.data} monthStart={gridStart.toISOString()} view={view} />}

      {canWrite(admin.role) ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-[2fr_1fr]">
          <section className="admin-card">
            <h2 className="mb-4 text-xl font-bold">{editing ? "Randevuyu Düzenle" : "Yeni Randevu"}</h2>
            <OperationForm action={saveAppointment} submitLabel="Randevuyu Kaydet" className="grid gap-4 sm:grid-cols-2">
              {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
              <div className="admin-field sm:col-span-2"><label htmlFor="customer_id">Müşteri</label><select id="customer_id" name="customer_id" defaultValue={editing?.customer_id ?? ""} required><option value="">Seçin</option>{customerResult.data.map((c) => <option value={c.id} key={c.id}>{c.name} · {c.primary_phone}</option>)}</select></div>
              <div className="admin-field sm:col-span-2"><label htmlFor="service_name">Hizmet</label><input id="service_name" name="service_name" defaultValue={editing?.service_name ?? ""} required /></div>
              <div className="admin-field"><label htmlFor="starts_at">Başlangıç</label><input id="starts_at" name="starts_at" type="datetime-local" defaultValue={editing ? localInput(new Date(editing.starts_at)) : localInput(now)} required /></div>
              <div className="admin-field"><label htmlFor="estimated_ends_at">Tahmini bitiş</label><input id="estimated_ends_at" name="estimated_ends_at" type="datetime-local" defaultValue={editing ? localInput(new Date(editing.estimated_ends_at)) : localInput(defaultEnd)} required /></div>
              <div className="admin-field"><label htmlFor="primary_staff_id">Görevli</label><select id="primary_staff_id" name="primary_staff_id" defaultValue={editing?.primary_staff_id ?? ""}><option value="">Atanmadı</option>{staffResult.data.map((s) => <option value={s.id} key={s.id}>{s.full_name}</option>)}</select></div>
              <div className="admin-field"><label htmlFor="assistant_staff_id">Yardımcı</label><select id="assistant_staff_id" name="assistant_staff_id" defaultValue={editing?.assistant_staff_id ?? ""}><option value="">Atanmadı</option>{staffResult.data.map((s) => <option value={s.id} key={s.id}>{s.full_name}</option>)}</select></div>
              <div className="admin-field"><label htmlFor="priority">Öncelik</label><select id="priority" name="priority" defaultValue={editing?.priority ?? "normal"}><option value="normal">Normal</option><option value="important">Önemli</option><option value="urgent">Acil</option></select></div>
              <div className="admin-field"><label htmlFor="status">Durum</label><select id="status" name="status" defaultValue={editing?.status ?? "planned"}><option value="planned">Planlandı</option><option value="customer_called">Müşteri Arandı</option><option value="on_the_way">Yola Çıkıldı</option><option value="started">İşlem Başladı</option><option value="waiting_material">Malzeme Bekleniyor</option><option value="completed">İşlem Tamamlandı</option><option value="cancelled">İptal Edildi</option><option value="postponed">Ertelendi</option><option value="waiting_payment">Tahsilat Bekleniyor</option></select></div>
              <div className="admin-field"><label htmlFor="amount_due">Alınacak tutar</label><input id="amount_due" name="amount_due" type="number" min="0" step="0.01" defaultValue={editing?.amount_due ?? ""} /></div>
              <div className="admin-field"><label htmlFor="currency">Para birimi</label><select id="currency" name="currency" defaultValue={editing?.currency ?? "TRY"}><option>TRY</option><option>USD</option></select></div>
              <div className="admin-field"><label htmlFor="exchange_rate">USD/TL işlem kuru (USD ise)</label><input id="exchange_rate" name="exchange_rate" type="number" min="0" step="0.0001" inputMode="decimal" defaultValue={editing?.exchange_rate ?? ""} /></div>
              <input type="hidden" name="exchange_rate_date" value={editing?.exchange_rate_date ?? ""} />
              <div className="admin-field sm:col-span-2"><label htmlFor="reported_issue">Müşterinin bildirdiği sorun</label><textarea id="reported_issue" name="reported_issue" /></div>
              <div className="admin-field sm:col-span-2"><label htmlFor="service_address">Hizmet adresi</label><textarea id="service_address" name="service_address" /></div>
              <div className="admin-field"><label htmlFor="city">Şehir</label><input id="city" name="city" defaultValue="Tekirdağ" /></div>
              <div className="admin-field"><label htmlFor="district">İlçe</label><input id="district" name="district" defaultValue="Çorlu" /></div>
              <div className="admin-field"><label htmlFor="internal_note">İç not</label><textarea id="internal_note" name="internal_note" /></div>
              <div className="admin-field"><label htmlFor="customer_note">Müşteri notu</label><textarea id="customer_note" name="customer_note" /></div>
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="reminder_enabled" /> Hatırlatma oluştur</label>
            </OperationForm>
          </section>
          <aside className="space-y-5">
            <details className="admin-card" open><summary className="cursor-pointer font-bold">Hızlı müşteri ekle</summary><OperationForm action={createCustomer} submitLabel="Müşteri Ekle" className="mt-4 space-y-3" targetSelectId="customer_id"><div className="admin-field"><label htmlFor="quick_customer_name">Ad / unvan</label><input id="quick_customer_name" name="name" required /></div><div className="admin-field"><label htmlFor="quick_phone">Telefon</label><input id="quick_phone" name="primary_phone" required /></div><input type="hidden" name="customer_type" value="individual" /></OperationForm></details>
            <details className="admin-card"><summary className="cursor-pointer font-bold">Hızlı personel ekle</summary><OperationForm action={createStaff} submitLabel="Personel Ekle" className="mt-4 space-y-3" targetSelectId="primary_staff_id" createdLabelField="full_name"><div className="admin-field"><label htmlFor="quick_staff_name">Ad soyad</label><input id="quick_staff_name" name="full_name" required /></div><div className="admin-field"><label htmlFor="quick_staff_phone">Telefon</label><input id="quick_staff_phone" name="phone" /></div></OperationForm></details>
          </aside>
        </div>
      ) : null}
    </AdminShell>
  );
}
