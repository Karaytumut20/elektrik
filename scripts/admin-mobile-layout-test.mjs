import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path) => readFileSync(join(process.cwd(), path), "utf8");
const layout = read("components/admin/AdminLayoutShell.tsx");
const css = read("app/globals.css");
const operationForm = read("components/admin/OperationForm.tsx");
const workOrders = read("app/admin/work-orders/page.tsx");
const pages = [
  workOrders,
  read("app/admin/customers/page.tsx"),
  read("app/admin/inventory/page.tsx"),
  read("app/admin/accounting/page.tsx"),
  read("app/admin/staff/page.tsx"),
  read("app/admin/work-orders/[id]/page.tsx"),
].join("\n");

const checks = [
  ["mobile has a persistent five-item quick navigation", /grid-cols-5[\s\S]*Hızlı admin menüsü/.test(layout)],
  ["content clears the mobile navigation and safe area", /pb-\[calc\(5\.5rem\+env\(safe-area-inset-bottom\)\)\]/.test(layout)],
  ["dashboard metrics use a two-column mobile grid", /\.admin-grid[\s\S]*grid-cols-2/.test(css)],
  ["common mobile card-list layout is defined", /\.admin-mobile-list[\s\S]*sm:hidden/.test(css) && /\.admin-mobile-metrics/.test(css)],
  ["primary operational tables have mobile card views", (pages.match(/admin-mobile-list/g) ?? []).length >= 6],
  ["server action forms have full-width mobile submit buttons", /btn btn-primary w-full sm:w-auto/.test(operationForm)],
  ["search and filter controls stack on mobile", /grid gap-2 sm:flex/.test(workOrders)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Admin mobile layout checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Admin mobile layout test passed: navigation, grids, cards and mobile actions are configured.");
