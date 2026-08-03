"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { moveAppointment } from "@/lib/admin/operations-actions";
import type { Appointment } from "@/lib/admin/operations-types";
import { appointmentStatusLabel, dateTime, money } from "@/lib/admin/operations-types";

const statusColor: Record<string, string> = {
  planned: "border-blue-200 bg-blue-50 text-blue-800",
  started: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  waiting_material: "border-violet-200 bg-violet-50 text-violet-800",
  waiting_payment: "border-orange-200 bg-orange-50 text-orange-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-500",
};

function dayKey(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(value));
}

export function CalendarBoard({ initialAppointments, monthStart, view }: { initialAppointments: Appointment[]; monthStart: string; view: string }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const days = useMemo(() => {
    const start = new Date(monthStart);
    return Array.from({ length: 42 }, (_, i) => new Date(start.getTime() + i * 86400000));
  }, [monthStart]);

  async function dropOn(day: Date) {
    const appointment = appointments.find((item) => item.id === draggedId);
    setDraggedId(null);
    if (!appointment) return;
    const oldStart = new Date(appointment.starts_at);
    const oldEnd = new Date(appointment.estimated_ends_at);
    const duration = oldEnd.getTime() - oldStart.getTime();
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(oldStart);
    const target = new Date(`${dayKey(day)}T${time}:00+03:00`);
    const newEnd = new Date(target.getTime() + duration);
    const previous = appointments;
    setAppointments((items) => items.map((item) => item.id === appointment.id ? {
      ...item, starts_at: target.toISOString(), estimated_ends_at: newEnd.toISOString(),
    } : item));
    const result = await moveAppointment(appointment.id, target.toISOString(), newEnd.toISOString());
    if (result.error) {
      setAppointments(previous);
      window.alert(result.error);
    }
  }

  if (view !== "month") {
    return (
      <div className="space-y-3">
        {appointments.length === 0 ? <div className="admin-card text-sm text-slate-500">Bu dönemde randevu yok.</div> : appointments.map((item) => (
          <article className={`rounded-xl border p-4 ${statusColor[item.status] ?? statusColor.planned}`} key={item.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{item.service_name}</p>
                <p className="text-sm">{item.customer?.name} · {dateTime(item.starts_at)}</p>
                <p className="mt-1 text-xs">{appointmentStatusLabel(item.status)}{item.primary_staff?.full_name ? ` · ${item.primary_staff.full_name}` : ""}</p>
              </div>
              <div className="text-right text-sm font-semibold">
                {item.amount_due != null ? money(item.amount_due, item.currency) : "Tutar girilmedi"}
                <Link className="mt-2 block text-blue-700" href={`/admin/calendar?view=${view}&edit=${item.id}`}>Düzenle</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-7 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((name) => <div className="bg-slate-50 p-3 text-center text-xs font-bold text-slate-500" key={name}>{name}</div>)}
        {days.map((day) => {
          const key = dayKey(day);
          const items = appointments.filter((item) => dayKey(item.starts_at) === key);
          return (
            <div key={key} className="min-h-32 bg-white p-2" onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(day)}>
              <p className="mb-2 text-xs font-bold text-slate-500">{new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" }).format(day)}</p>
              <div className="space-y-1">
                {items.slice(0, 3).map((item) => (
                  <div
                    draggable
                    onDragStart={() => setDraggedId(item.id)}
                    className={`block w-full cursor-grab rounded-md border px-2 py-1.5 text-left text-xs ${statusColor[item.status] ?? statusColor.planned}`}
                    key={item.id}
                    title={`${item.customer?.name} - ${appointmentStatusLabel(item.status)}`}
                  >
                    <Link href={`/admin/calendar?view=month&edit=${item.id}`} className="block truncate font-bold">{new Date(item.starts_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" })} {item.customer?.name}</Link>
                    <span className="block truncate">{item.service_name}</span>
                  </div>
                ))}
                {items.length > 3 ? <Link className="block text-xs font-semibold text-blue-700" href={`/admin/calendar?view=day&date=${key}`}>+{items.length - 3} daha fazla</Link> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
