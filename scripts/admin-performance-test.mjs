import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const shell = read("components/admin/AdminShell.tsx");
const layoutShell = read("components/admin/AdminLayoutShell.tsx");
const marketingRuntime = read("components/seo/MarketingRuntime.tsx");
const auth = read("lib/admin/auth.ts");
const operations = read("lib/admin/operations.ts");
const clickData = read("lib/click-tracking/data.ts");
const serviceWorker = read("public/sw.js");

const checks = [
  ["admin has no blocking TCMB request", !/TCMB|tcmb\.gov\.tr|getTcmbRate/.test(`${shell}\n${layoutShell}\n${operations}`)],
  ["admin navigation does not prefetch every dynamic page", /links\.map[\s\S]*prefetch=\{false\}/.test(layoutShell)],
  ["desktop navigation uses a persistent sidebar", /<aside[\s\S]*lg:relative[\s\S]*lg:h-dvh/.test(layoutShell) && existsSync(join(root, "app", "admin", "layout.tsx"))],
  ["admin profile schema detection is cached", /unstable_cache[\s\S]*admin-profile-schema-v1[\s\S]*revalidate: 300/.test(auth)],
  ["admin profile lookup is cached", /admin-profile-by-user-v1[\s\S]*revalidate: 30/.test(auth)],
  ["verified JWT claims are used for identity", /auth\.getClaims\(\)/.test(auth)],
  ["marketing and PWA runtime are skipped in admin", /if \(isAdmin\) return null/.test(marketingRuntime)],
  ["service worker bypasses private admin and API routes", /pathname\.startsWith\("\/admin"\)[\s\S]*pathname\.startsWith\("\/api"\)/.test(serviceWorker)],
  ["click report is briefly cached", /grouped-ad-clicks-v1[\s\S]*revalidate: 15/.test(clickData)],
  ["admin route has an immediate loading state", existsSync(join(root, "app", "admin", "loading.tsx"))],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Admin performance checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Admin performance test passed: blocking work is removed or cached and navigation is persistent.");
