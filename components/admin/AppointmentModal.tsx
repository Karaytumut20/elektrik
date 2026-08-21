"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CalendarClock, Plus, X } from "lucide-react";
import { createCustomer, saveAppointment } from "@/lib/admin/operations-actions";
import type { Appointment, Customer, Staff } from "@/lib/admin/operations-types";

type CustomerOption = Pick<Customer, "id" | "name" | "primary_phone">;

function localDateTime(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function SaveButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
      {pending ? "Kaydediliyor…" : editing ? "Değişiklikleri Kaydet" : "İşi Takvime Ekle"}
    </button>
  );
}

function QuickCustomerForm({ disabled, onCreated }: { disabled: boolean; onCreated: (customer: CustomerOption) => void }) {
  const [state, formAction] = useActionState(createCustomer, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok || !state.createdId) return;
    const fields = formRef.current?.elements;
    const name = state.selectedName ?? (fields?.namedItem("name") as HTMLInputElement | null)?.value.trim() ?? "Yeni müşteri";
    const phone = state.selectedPhone ?? (fields?.namedItem("primary_phone") as HTMLInputElement | null)?.value.trim() ?? "";
    onCreated({ id: state.createdId, name, primary_phone: phone });
    formRef.current?.reset();
  }, [onCreated, state.createdId, state.ok, state.selectedName, state.selectedPhone]);

  return (
    <details className="shrink-0 border-b border-slate-200 bg-amber-50/60">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-bold text-slate-800 marker:hidden sm:px-6">
        <Plus className="h-4 w-4" /> Müşteri listede yok mu? Hızlı müşteri ekle
      </summary>
      <form ref={formRef} action={formAction} className="grid gap-3 border-t border-amber-100 px-4 py-4 sm:grid-cols-[1fr_1fr_auto] sm:px-6">
        <input type="hidden" name="customer_type" value="individual" />
        <div className="admin-field"><label htmlFor="quick_appointment_customer_name">Ad / unvan</label><input id="quick_appointment_customer_name" name="name" minLength={2} required disabled={disabled} /></div>
        <div className="admin-field"><label htmlFor="quick_appointment_customer_phone">Telefon</label><input id="quick_appointment_customer_phone" name="primary_phone" minLength={7} required disabled={disabled} inputMode="tel" /></div>
        <button type="submit" className="btn btn-secondary self-end" disabled={disabled}>Müşteriyi Ekle</button>
        {state.error ? <p role="alert" className="text-sm font-semibold text-red-700 sm:col-span-3">{state.error}</p> : null}
        {state.ok ? <p role="status" className="text-sm font-semibold text-emerald-700 sm:col-span-3">{state.message}</p> : null}
      </form>
    </details>
  );
}

export function AppointmentModal({
  appointment,
  selectedDate,
  customers,
  staff,
  canEdit,
  onClose,
}: {
  appointment: Appointment | null;
  selectedDate: string;
  customers: Customer[];
  staff: Staff[];
  canEdit: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(saveAppointment, {});
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>(customers);
  const [customerId, setCustomerId] = useState(appointment?.customer_id ?? "");
  const editing = Boolean(appointment);
  const startsAt = appointment ? localDateTime(appointment.starts_at) : `${selectedDate}T09:00`;
  const endsAt = appointment ? localDateTime(appointment.estimated_ends_at) : `${selectedDate}T10:00`;

  useEffect(() => {
    if (!state.ok) return;
    router.refresh();
    onClose();
  }, [onClose, router, state.ok]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const selectNewCustomer = useCallback((customer: CustomerOption) => {
    setCustomerOptions((current) => current.some((item) => item.id === customer.id) ? current : [...current, customer]);
    setCustomerId(customer.id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <h2 id="appointment-modal-title" className="text-lg font-bold text-slate-950 sm:text-xl">
                {editing ? "İş Detayı ve Düzenleme" : "Takvime Yeni İş Ekle"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{canEdit ? "Tüm alanlar isteğe bağlıdır; boş alanlar kaydetmeye engel olmaz." : "Bu kayıt salt görüntüleme modunda açıldı."}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100" aria-label="Pencereyi kapat">
            <X className="h-5 w-5" />
          </button>
        </header>

        {canEdit ? <QuickCustomerForm disabled={!canEdit} onCreated={selectNewCustomer} /> : null}

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <fieldset disabled={!canEdit} className="space-y-5 border-0 p-0">
              {appointment ? <input type="hidden" name="id" value={appointment.id} /> : null}

              <div className="grid gap-4 sm:grid-cols-2">
              <div className="admin-field sm:col-span-2">
                <label htmlFor="appointment_service_name">İş / hizmet başlığı</label>
                <input id="appointment_service_name" name="service_name" maxLength={160} defaultValue={appointment?.service_name ?? ""} placeholder="Örn. Sigorta arızası" />
              </div>
              <div className="admin-field sm:col-span-2">
                <label htmlFor="appointment_customer_id">Müşteri</label>
                <select id="appointment_customer_id" name="customer_id" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                  <option value="">Müşteri seçmeden devam et</option>
                  {customerOptions.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}{customer.primary_phone ? ` · ${customer.primary_phone}` : ""}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-500">Müşteri ve fiyat girildiğinde iş emri otomatik olarak oluşturulur.</p>
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_starts_at">Başlangıç</label>
                <input id="appointment_starts_at" name="starts_at" type="datetime-local" defaultValue={startsAt} />
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_ends_at">Tahmini bitiş</label>
                <input id="appointment_ends_at" name="estimated_ends_at" type="datetime-local" defaultValue={endsAt} />
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_status">Durum</label>
                <select id="appointment_status" name="status" defaultValue={appointment?.status ?? "planned"}>
                  <option value="planned">Planlandı</option>
                  <option value="customer_called">Müşteri Arandı</option>
                  <option value="on_the_way">Yola Çıkıldı</option>
                  <option value="started">İşlem Başladı</option>
                  <option value="waiting_material">Malzeme Bekleniyor</option>
                  <option value="completed">İşlem Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                  <option value="postponed">Ertelendi</option>
                  <option value="waiting_payment">Tahsilat Bekleniyor</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_priority">Öncelik</label>
                <select id="appointment_priority" name="priority" defaultValue={appointment?.priority ?? "normal"}>
                  <option value="normal">Normal</option>
                  <option value="important">Önemli</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_amount">Alınacak tutar / iş emri satış fiyatı</label>
                <input id="appointment_amount" name="amount_due" type="number" min="0" step="0.01" inputMode="decimal" defaultValue={appointment?.amount_due ?? ""} placeholder="Örn. 1500" />
              </div>
              <div className="admin-field">
                <label htmlFor="appointment_currency">Para birimi</label>
                <select id="appointment_currency" name="currency" defaultValue={appointment?.currency ?? "TRY"}><option>TRY</option><option>USD</option></select>
              </div>
              <div className="admin-field sm:col-span-2">
                <label htmlFor="appointment_exchange_rate">USD/TL işlem kuru <span className="font-normal text-slate-500">(yalnızca USD için)</span></label>
                <input id="appointment_exchange_rate" name="exchange_rate" type="number" min="0" step="0.0001" inputMode="decimal" defaultValue={appointment?.exchange_rate ?? ""} />
                <input type="hidden" name="exchange_rate_date" value={appointment?.exchange_rate_date ?? ""} />
              </div>
              <div className="admin-field sm:col-span-2">
                <label htmlFor="appointment_reported_issue">Sorun / yapılacak iş</label>
                <textarea id="appointment_reported_issue" name="reported_issue" defaultValue={appointment?.reported_issue ?? ""} placeholder="Kısa bir açıklama yazabilirsiniz" />
              </div>
              </div>

              <details className="rounded-2xl border border-slate-200 bg-slate-50/70">
              <summary className="cursor-pointer list-none px-4 py-4 font-bold text-slate-800 marker:hidden">
                Diğer isteğe bağlı detaylar <span className="ml-1 text-xs font-medium text-slate-500">(personel, adres ve notlar)</span>
              </summary>
              <div className="grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2">
                <div className="admin-field">
                  <label htmlFor="appointment_primary_staff">Görevli</label>
                  <select id="appointment_primary_staff" name="primary_staff_id" defaultValue={appointment?.primary_staff_id ?? ""}>
                    <option value="">Atanmadı</option>
                    {staff.map((person) => <option value={person.id} key={person.id}>{person.full_name}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="appointment_assistant_staff">Yardımcı</label>
                  <select id="appointment_assistant_staff" name="assistant_staff_id" defaultValue={appointment?.assistant_staff_id ?? ""}>
                    <option value="">Atanmadı</option>
                    {staff.map((person) => <option value={person.id} key={person.id}>{person.full_name}</option>)}
                  </select>
                </div>
                <div className="admin-field sm:col-span-2">
                  <label htmlFor="appointment_description">Açıklama</label>
                  <textarea id="appointment_description" name="description" defaultValue={appointment?.description ?? ""} />
                </div>
                <div className="admin-field sm:col-span-2">
                  <label htmlFor="appointment_address">Hizmet adresi</label>
                  <textarea id="appointment_address" name="service_address" defaultValue={appointment?.service_address ?? ""} />
                </div>
                <div className="admin-field">
                  <label htmlFor="appointment_city">Şehir</label>
                  <input id="appointment_city" name="city" defaultValue={appointment?.city ?? ""} placeholder="Tekirdağ" />
                </div>
                <div className="admin-field">
                  <label htmlFor="appointment_district">İlçe</label>
                  <input id="appointment_district" name="district" defaultValue={appointment?.district ?? ""} placeholder="Çorlu" />
                </div>
                <div className="admin-field sm:col-span-2">
                  <label htmlFor="appointment_map_url">Harita bağlantısı</label>
                  <input id="appointment_map_url" name="map_url" type="url" defaultValue={appointment?.map_url ?? ""} placeholder="https://maps.google.com/…" />
                </div>
                <div className="admin-field">
                  <label htmlFor="appointment_internal_note">İç not</label>
                  <textarea id="appointment_internal_note" name="internal_note" defaultValue={appointment?.internal_note ?? ""} />
                </div>
                <div className="admin-field">
                  <label htmlFor="appointment_customer_note">Müşteri notu</label>
                  <textarea id="appointment_customer_note" name="customer_note" defaultValue={appointment?.customer_note ?? ""} />
                </div>
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold sm:col-span-2">
                  <input type="checkbox" name="reminder_enabled" defaultChecked={appointment?.reminder_enabled ?? false} className="h-5 w-5" />
                  Hatırlatma oluştur
                </label>
              </div>
              </details>
            </fieldset>

            {state.error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p> : null}
          </div>

          <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex sm:justify-end sm:px-6">
            {canEdit ? <SaveButton editing={editing} /> : <p className="w-full text-center text-sm font-semibold text-slate-500 sm:text-right">Bu rol değişiklik yapamaz.</p>}
          </footer>
        </form>
      </section>
    </div>
  );
}
