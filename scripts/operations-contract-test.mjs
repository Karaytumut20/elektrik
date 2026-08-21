import { readFileSync } from "node:fs";
import { join } from "node:path";

const migrationPath = join(process.cwd(), "supabase", "migrations", "20260728000000_operations_management.sql");
const sql = readFileSync(migrationPath, "utf8");

const forbidden = [
  /\bdrop\s+table\b/i,
  /\btruncate\b/i,
  /\bdelete\s+from\b/i,
  /\bdrop\s+column\b/i,
];

const required = [
  ["tek transaction kurulumu", /^\s*--[\s\S]*?\bbegin;[\s\S]*\bcommit;/i],
  ["müşteri tablosu", /create table if not exists public\.customers/i],
  ["personel tablosu", /create table if not exists public\.staff/i],
  ["takvim tablosu", /create table if not exists public\.appointments/i],
  ["iş emri tablosu", /create table if not exists public\.service_orders/i],
  ["stok tablosu", /create table if not exists public\.inventory_items/i],
  ["müşterisiz takvim kaydı", /alter table public\.appointments alter column customer_id drop not null/i],
  ["müşterisiz kayıtta güvenli iş emri tetikleyicisi", /v_order_id is null and v_appointment\.customer_id is not null/i],
  ["takvim ve iş emri entegrasyonu", /if v_order_id is null and v_appointment\.customer_id is not null then/i],
  ["randevu tekil iş emri", /appointment_id uuid unique references public\.appointments/i],
  ["personel çakışma kuralı", /p_starts_at < a\.estimated_ends_at[\s\S]*p_ends_at > a\.starts_at/i],
  ["negatif stok koruması", /if v_stock\.stock_quantity < p_quantity then raise exception 'Yetersiz stok\.'/i],
  ["atomik stok hareketi", /insert into public\.inventory_movements/i],
  ["malzeme snapshotı", /create table if not exists public\.service_order_materials/i],
  ["idempotent tahsilat", /idempotency_key text unique/i],
  ["fazla tahsilat koruması", /Tahsilat kalan tutari asamaz/i],
  ["TRY ve USD ayrımı", /currency text not null[\s\S]*check \(currency in \('TRY', 'USD'\)\)/i],
  ["soft delete", /deleted_at timestamptz/i],
  ["audit log", /create table if not exists public\.audit_logs/i],
  ["RLS", /enable row level security/i],
  ["özel dosya deposu", /'service-files', 'service-files', false/i],
  ["Supabase şema önbelleği yenileme", /notify pgrst, 'reload schema'/i],
];

const errors = [];
for (const pattern of forbidden) {
  if (pattern.test(sql)) errors.push(`Silici SQL bulundu: ${pattern}`);
}
for (const [name, pattern] of required) {
  if (!pattern.test(sql)) errors.push(`Eksik sözleşme: ${name}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Operations contract test passed: additive schema and critical consistency rules verified.");
