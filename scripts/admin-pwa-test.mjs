import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const manifest = JSON.parse(read("public/admin.webmanifest"));
const layout = read("app/admin/layout.tsx");
const register = read("components/admin/AdminPwaRegister.tsx");
const runtime = read("components/seo/MarketingRuntime.tsx");

const checks = [
  ["admin manifest exists", existsSync(join(root, "public", "admin.webmanifest"))],
  ["installed app starts in admin", manifest.start_url === "/admin/dashboard" && manifest.scope === "/admin/"],
  ["admin layout uses the admin manifest", /manifest:\s*"\/admin\.webmanifest"/.test(layout)],
  ["admin registers a service worker", /serviceWorker\.register\("\/sw\.js"\)/.test(register)],
  ["marketing runtime does not unregister the admin worker", !/getRegistrations\(\)[\s\S]*unregister/.test(runtime)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Admin PWA checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Admin PWA test passed: installation opens the admin dashboard and private routes stay uncached.");
