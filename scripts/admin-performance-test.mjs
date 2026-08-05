import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const shell = read("components/admin/AdminShell.tsx");
const auth = read("lib/admin/auth.ts");
const operations = read("lib/admin/operations.ts");

const checks = [
  ["exchange rate is streamed without blocking the admin shell", /<Suspense fallback=\{null\}>[\s\S]*<ExchangeRateBadge \/>/.test(shell)],
  ["TCMB request has a short timeout", /AbortSignal\.timeout\(1500\)/.test(operations)],
  ["admin profile schema detection is cached", /unstable_cache[\s\S]*admin-profile-schema-v1[\s\S]*revalidate: 300/.test(auth)],
  ["admin route has an immediate loading state", existsSync(join(root, "app", "admin", "loading.tsx"))],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Admin performance checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Admin performance test passed: blocking shared work is cached or streamed.");
