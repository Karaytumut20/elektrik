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
