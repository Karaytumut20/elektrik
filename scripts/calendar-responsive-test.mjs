import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const board = read("components/admin/CalendarBoard.tsx");
const modal = read("components/admin/AppointmentModal.tsx");
const action = read("lib/admin/operations-actions.ts");
const migration = read("supabase/migrations/20260805000000_optional_calendar_customer.sql");

const checks = [
  ["month calendar fits mobile without a forced desktop width", !/min-w-\[(?:900|800)px\]/.test(board) && /grid-cols-7/.test(board)],
  ["calendar days can create jobs", /openNew\(key\)/.test(board)],
  ["existing jobs open the detail modal", /openEdit\(item\)/.test(board) && /AppointmentModal/.test(board)],
  ["mobile selected-day agenda exists", /sm:hidden[\s\S]*selectedAppointments/.test(board)],
  ["appointment timing fields are not marked required", !/name="starts_at"[^>]*\brequired\b/.test(modal) && !/name="estimated_ends_at"[^>]*\brequired\b/.test(modal)],
  ["empty customer and title receive safe server values", /customer_id: parsed\.data\.customer_id \|\| null/.test(action) && /service_name: parsed\.data\.service_name \|\| "Yeni iş"/.test(action)],
  ["calendar popup can add and select a customer", /QuickCustomerForm/.test(modal) && /createCustomer/.test(modal) && /selectNewCustomer/.test(modal)],
  ["existing phone numbers select the customer instead of exposing a database error", /findActiveCustomerByPhone/.test(action) && /customers_primary_phone_active_uidx/.test(action)],
  ["price is entered directly in the calendar popup", /Alınacak tutar \/ iş emri satış fiyatı/.test(modal)],
  ["calendar USD jobs require a valid exchange rate", /USD iş emri için geçerli USD\/TL kuru girilmelidir/.test(action)],
  ["empty dates receive server defaults", /parsedEnd \? new Date\(parsedEnd\.getTime\(\) - 3600000\)/.test(action) && /new Date\(startsAt\.getTime\(\) \+ 3600000\)/.test(action)],
  ["invalid appointment intervals are rejected before database writes", /function appointmentRange/.test(action) && /Randevu bitişi başlangıç saatinden sonra olmalıdır/.test(action)],
  ["quick work orders validate an optional appointment interval", /const range = appointmentStarts && appointmentEnds \? appointmentRange/.test(action)],
  ["existing databases allow customerless appointments", /alter column customer_id drop not null/i.test(migration)],
  ["local calendar input is stored with Turkey timezone", /\+03:00/.test(action)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Calendar responsive checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Calendar responsive test passed: mobile calendar, popup editing and optional fields verified.");
