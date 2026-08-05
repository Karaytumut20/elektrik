import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CalendarBoard } from "@/components/admin/CalendarBoard";
import { requireAdmin, canWrite } from "@/lib/admin/auth";
import { getAppointments, getCustomers, getStaff } from "@/lib/admin/operations";

export const dynamic = "force-dynamic";

const DAY = 86400000;
const views = [
  ["month", "Aylık"],
  ["week", "Haftalık"],
  ["day", "Günlük"],
  ["upcoming", "Yaklaşan"],
] as const;

function keyInIstanbul(value: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(value);
}

function atIstanbulMidnight(key: string) {
  return new Date(`${key}T00:00:00+03:00`);
}

function isValidDateKey(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function shiftKey(key: string, amount: number, unit: "day" | "month") {
  const date = new Date(`${key}T12:00:00Z`);
  if (unit === "month") {
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + amount);
  } else {
    date.setUTCDate(date.getUTCDate() + amount);
  }
  return date.toISOString().slice(0, 10);
}

function weekDayIndex(key: string) {
  return (new Date(`${key}T12:00:00Z`).getUTCDay() + 6) % 7;
}

function periodLabel(view: string, displayDate: string, from: Date, to: Date) {
  const display = new Date(`${displayDate}T12:00:00+03:00`);
  if (view === "month") return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(display);
  if (view === "day") return new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(display);
  const formatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });
  if (view === "upcoming") return `${formatter.format(from)} – ${formatter.format(new Date(to.getTime() - DAY))} · 30 gün`;
  return `${formatter.format(from)} – ${formatter.format(new Date(to.getTime() - DAY))}`;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const view = views.some(([key]) => key === params.view) ? params.view! : "month";
  const today = keyInIstanbul(new Date());
  let displayDate = isValidDateKey(params.date) ? params.date : today;
  const legacyOffset = Number(params.offset ?? 0);
  if (Number.isFinite(legacyOffset) && legacyOffset) displayDate = shiftKey(displayDate, legacyOffset, "day");

  let from: Date;
  let to: Date;
  let gridStart: Date;
  if (view === "day") {
    from = atIstanbulMidnight(displayDate);
    to = new Date(from.getTime() + DAY);
    gridStart = from;
  } else if (view === "week") {
    from = new Date(atIstanbulMidnight(displayDate).getTime() - weekDayIndex(displayDate) * DAY);
    to = new Date(from.getTime() + 7 * DAY);
    gridStart = from;
  } else if (view === "upcoming") {
    from = atIstanbulMidnight(displayDate);
    to = new Date(from.getTime() + 30 * DAY);
    gridStart = from;
  } else {
    const firstOfMonth = `${displayDate.slice(0, 7)}-01`;
    gridStart = new Date(atIstanbulMidnight(firstOfMonth).getTime() - weekDayIndex(firstOfMonth) * DAY);
    from = gridStart;
    to = new Date(gridStart.getTime() + 42 * DAY);
  }

  const [appointmentResult, customerResult, staffResult] = await Promise.all([
    getAppointments(from.toISOString(), to.toISOString()),
    getCustomers(),
    getStaff(),
  ]);

  const navigationStep = view === "month" ? 1 : view === "week" ? 7 : view === "upcoming" ? 30 : 1;
  const navigationUnit = view === "month" ? "month" : "day";
  const previousDate = shiftKey(displayDate, -navigationStep, navigationUnit);
  const nextDate = shiftKey(displayDate, navigationStep, navigationUnit);
  const label = periodLabel(view, displayDate, from, to);

  return (
    <AdminShell>
      <div className="mb-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-amber-600">Planlama</p>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Takvim ve İşler</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Bir gün seçin, işi ekleyin; kayıtlı işe dokunarak ayrıntıları görün veya düzenleyin.</p>
        </div>
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Takvim görünümü">
          {views.map(([key, title]) => (
            <Link
              key={key}
              href={`/admin/calendar?view=${key}&date=${displayDate}`}
              prefetch={false}
              aria-current={view === key ? "page" : undefined}
              className={`btn shrink-0 ${view === key ? "btn-primary" : "btn-secondary"}`}
            >
              {title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mb-4 grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-3">
        <Link className="btn btn-secondary h-11 min-h-11 px-0 sm:px-4" href={`/admin/calendar?view=${view}&date=${previousDate}`} prefetch={false} aria-label="Önceki dönem">
          <ChevronLeft className="h-5 w-5" /><span className="hidden sm:inline">Önceki</span>
        </Link>
        <div className="text-center">
          <p className="truncate text-sm font-bold capitalize text-slate-950 sm:text-base">{label}</p>
          <Link className="text-xs font-semibold text-blue-700" href={`/admin/calendar?view=${view}&date=${today}`} prefetch={false}>Bugüne dön</Link>
        </div>
        <Link className="btn btn-secondary h-11 min-h-11 px-0 sm:px-4" href={`/admin/calendar?view=${view}&date=${nextDate}`} prefetch={false} aria-label="Sonraki dönem">
          <span className="hidden sm:inline">Sonraki</span><ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {appointmentResult.error ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Takvim verileri alınamadı. Supabase operasyon tablolarının kurulu olduğunu kontrol edin.
        </div>
      ) : null}

      <CalendarBoard
        initialAppointments={appointmentResult.data}
        monthStart={gridStart.toISOString()}
        displayDate={displayDate}
        view={view}
        customers={customerResult.data}
        staff={staffResult.data}
        canEdit={canWrite(admin.role)}
      />
    </AdminShell>
  );
}
