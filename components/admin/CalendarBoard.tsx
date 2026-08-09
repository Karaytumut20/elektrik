"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Clock3, Plus, UserRound } from "lucide-react";
import { AppointmentModal } from "@/components/admin/AppointmentModal";
import { moveAppointment } from "@/lib/admin/operations-actions";
import type { Appointment, Customer, Staff } from "@/lib/admin/operations-types";
import { appointmentStatusLabel, dateTime, money } from "@/lib/admin/operations-types";

const statusColor: Record<string, string> = {
  planned: "border-blue-200 bg-blue-50 text-blue-800",
  customer_called: "border-cyan-200 bg-cyan-50 text-cyan-800",
  on_the_way: "border-indigo-200 bg-indigo-50 text-indigo-800",
  started: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  waiting_material: "border-violet-200 bg-violet-50 text-violet-800",
  waiting_payment: "border-orange-200 bg-orange-50 text-orange-800",
  postponed: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-500",
};

const weekDays = [
  ["P", "Pzt"], ["S", "Sal"], ["Ç", "Çar"], ["P", "Per"], ["C", "Cum"], ["C", "Cmt"], ["P", "Paz"],
];

function dayKey(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(value));
}

function shortTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}

function longDay(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${value}T12:00:00+03:00`));
}

type ModalState = { appointment: Appointment | null; date: string } | null;

export function CalendarBoard({
  initialAppointments,
  monthStart,
  displayDate,
  view,
  customers,
  staff,
  canEdit,
}: {
  initialAppointments: Appointment[];
  monthStart: string;
  displayDate: string;
  view: string;
  customers: Customer[];
  staff: Staff[];
  canEdit: boolean;
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDay, setSelectedDay] = useState(displayDate);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const today = dayKey(new Date());
  const displayMonth = displayDate.slice(0, 7);

  useEffect(() => setAppointments(initialAppointments), [initialAppointments]);
  useEffect(() => setSelectedDay(displayDate), [displayDate]);

  const closeModal = useCallback(() => setModal(null), []);
  const openNew = useCallback((date: string) => {
    if (!canEdit) return;
    setSelectedDay(date);
    setModal({ appointment: null, date });
  }, [canEdit]);
  const openEdit = useCallback((appointment: Appointment) => {
    setSelectedDay(dayKey(appointment.starts_at));
    setModal({ appointment, date: dayKey(appointment.starts_at) });
  }, []);

  const days = useMemo(() => {
    const start = new Date(monthStart);
    return Array.from({ length: 42 }, (_, index) => new Date(start.getTime() + index * 86400000));
  }, [monthStart]);

  const appointmentsByDay = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const key = dayKey(appointment.starts_at);
      const current = grouped.get(key) ?? [];
      current.push(appointment);
      grouped.set(key, current);
    }
    return grouped;
  }, [appointments]);

  const selectedAppointments = appointmentsByDay.get(selectedDay) ?? [];

  async function dropOn(day: Date) {
    if (!canEdit) return;
    const appointment = appointments.find((item) => item.id === draggedId);
    setDraggedId(null);
    if (!appointment) return;
    const oldStart = new Date(appointment.starts_at);
    const oldEnd = new Date(appointment.estimated_ends_at);
    const duration = Math.max(1800000, oldEnd.getTime() - oldStart.getTime());
    const target = new Date(`${dayKey(day)}T${shortTime(appointment.starts_at)}:00+03:00`);
    const newEnd = new Date(target.getTime() + duration);
    const previous = appointments;
    setAppointments((items) => items.map((item) => item.id === appointment.id ? {
      ...item,
      starts_at: target.toISOString(),
      estimated_ends_at: newEnd.toISOString(),
    } : item));
    const result = await moveAppointment(appointment.id, target.toISOString(), newEnd.toISOString());
    if (result.error) {
      setAppointments(previous);
      window.alert(result.error);
    }
  }

  const toolbar = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Seçili gün</p>
        <p className="font-bold capitalize text-slate-950">{longDay(selectedDay)}</p>
        <p className="text-xs text-slate-500">{selectedAppointments.length ? `${selectedAppointments.length} iş kayıtlı` : "Kayıtlı iş yok"}</p>
      </div>
      {canEdit ? (
        <button type="button" className="btn btn-primary flex-1 gap-2 sm:flex-none" onClick={() => openNew(selectedDay)}>
          <CalendarPlus className="h-4 w-4" /> Yeni İş
        </button>
      ) : null}
    </div>
  );

  const modalElement = modal ? (
    <AppointmentModal
      key={modal.appointment?.id ?? `new-${modal.date}`}
      appointment={modal.appointment}
      selectedDate={modal.date}
      customers={customers}
      staff={staff}
      canEdit={canEdit}
      onClose={closeModal}
    />
  ) : null;

  if (view !== "month") {
    return (
      <>
        {toolbar}
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="admin-card flex flex-col items-center py-10 text-center">
              <CalendarPlus className="mb-3 h-8 w-8 text-slate-300" />
              <p className="font-semibold text-slate-700">Bu dönemde kayıtlı iş yok.</p>
              <p className="mt-1 text-sm text-slate-500">Yeni İş düğmesiyle doğrudan takvime ekleyebilirsiniz.</p>
            </div>
          ) : appointments.map((item) => (
            <button
              type="button"
              className={`block w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${statusColor[item.status] ?? statusColor.planned}`}
              key={item.id}
              onClick={() => openEdit(item)}
            >
              <span className="flex flex-wrap items-start justify-between gap-3">
                <span>
                  <span className="block font-bold">{item.service_name || "Yeni iş"}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm"><Clock3 className="h-4 w-4" />{dateTime(item.starts_at)}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs"><UserRound className="h-3.5 w-3.5" />{item.customer?.name ?? "Müşteri seçilmedi"}</span>
                </span>
                <span className="text-right text-xs font-semibold">
                  <span className="block">{appointmentStatusLabel(item.status)}</span>
                  <span className="mt-1 block">{item.amount_due != null ? money(item.amount_due, item.currency) : "Tutar girilmedi"}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        {modalElement}
      </>
    );
  }

  return (
    <>
      {toolbar}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {weekDays.map(([mobile, desktop], index) => (
            <div className={`bg-slate-50 px-0.5 py-2 text-center text-[10px] font-bold text-slate-500 sm:p-3 sm:text-xs ${index > 4 ? "bg-slate-100" : ""}`} key={desktop}>
              <span className="sm:hidden">{mobile}</span><span className="hidden sm:inline">{desktop}</span>
            </div>
          ))}
          {days.map((day) => {
            const key = dayKey(day);
            const items = appointmentsByDay.get(key) ?? [];
            const selected = key === selectedDay;
            const outsideMonth = key.slice(0, 7) !== displayMonth;
            const isToday = key === today;
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                aria-label={`${longDay(key)}, ${items.length} iş`}
                className={`group relative min-h-[5.5rem] cursor-pointer overflow-hidden bg-white p-1 transition sm:min-h-32 sm:p-2 ${outsideMonth ? "bg-slate-50 text-slate-400" : ""} ${selected ? "z-10 ring-2 ring-inset ring-amber-400" : "hover:bg-amber-50/40"}`}
                onClick={() => setSelectedDay(key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedDay(key);
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void dropOn(day);
                }}
              >
                <div className="mb-1 flex items-center justify-between gap-1 sm:mb-2">
                  <span className={`grid h-6 min-w-6 place-items-center rounded-full text-[11px] font-bold sm:h-7 sm:min-w-7 sm:text-xs ${isToday ? "bg-slate-950 text-white" : "text-slate-600"}`}>
                    {new Intl.DateTimeFormat("tr-TR", { day: "numeric", timeZone: "Europe/Istanbul" }).format(day)}
                  </span>
                  {canEdit ? (
                    <button
                      type="button"
                      className={`grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-slate-950 transition hover:bg-amber-400 sm:h-7 sm:w-7 ${selected ? "opacity-100" : "hidden opacity-0 group-hover:opacity-100 sm:grid"}`}
                      aria-label={`${longDay(key)} gününe iş ekle`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openNew(key);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
                <div className="space-y-1">
                  {items.slice(0, 3).map((item, index) => (
                    <button
                      type="button"
                      draggable={canEdit}
                      onDragStart={(event) => {
                        event.stopPropagation();
                        setDraggedId(item.id);
                      }}
                      onDragEnd={() => setDraggedId(null)}
                      onClick={(event) => {
                        event.stopPropagation();
                        openEdit(item);
                      }}
                      className={`w-full cursor-pointer truncate rounded-md border px-1 py-1 text-left text-[9px] font-bold leading-tight sm:px-2 sm:py-1.5 sm:text-xs ${index > 0 ? "hidden sm:block" : "block"} ${statusColor[item.status] ?? statusColor.planned}`}
                      key={item.id}
                      title={`${item.service_name || "Yeni iş"} · ${item.customer?.name ?? "Müşteri yok"}`}
                    >
                      <span className="sm:hidden">{shortTime(item.starts_at)}</span>
                      <span className="hidden truncate sm:block">{shortTime(item.starts_at)} · {item.service_name || item.customer?.name || "Yeni iş"}</span>
                    </button>
                  ))}
                  {items.length > 1 ? (
                    <Link href={`/admin/calendar?view=day&date=${key}`} prefetch={false} className="block truncate text-center text-[9px] font-bold text-blue-700 sm:hidden" onClick={(event) => event.stopPropagation()}>+{items.length - 1} iş</Link>
                  ) : null}
                  {items.length > 3 ? (
                    <Link href={`/admin/calendar?view=day&date=${key}`} prefetch={false} className="hidden text-xs font-semibold text-blue-700 sm:block" onClick={(event) => event.stopPropagation()}>+{items.length - 3} daha</Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div><p className="font-bold capitalize text-slate-950">{longDay(selectedDay)}</p><p className="text-xs text-slate-500">{selectedAppointments.length} iş</p></div>
          {canEdit ? <button type="button" className="btn btn-primary h-10 min-h-10 gap-1.5 px-3" onClick={() => openNew(selectedDay)}><Plus className="h-4 w-4" /> İş Ekle</button> : null}
        </div>
        <div className="space-y-2">
          {selectedAppointments.length ? selectedAppointments.map((item) => (
            <button type="button" key={item.id} onClick={() => openEdit(item)} className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left ${statusColor[item.status] ?? statusColor.planned}`}>
              <span className="min-w-0"><span className="block truncate font-bold">{item.service_name || "Yeni iş"}</span><span className="block truncate text-xs">{shortTime(item.starts_at)} · {item.customer?.name ?? "Müşteri seçilmedi"}</span></span>
              <span className="shrink-0 text-xs font-semibold">Düzenle</span>
            </button>
          )) : <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">Bu gün için kayıt yok.</p>}
        </div>
      </section>
      {modalElement}
    </>
  );
}
