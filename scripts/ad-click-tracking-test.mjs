import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const migration = read("supabase/migrations/20260803000000_ad_click_tracking.sql");
const api = read("app/api/ad-clicks/route.ts");
const tracker = read("components/seo/AdClickTracker.tsx");
const clickLogsPage = read("app/admin/click-logs/page.tsx");
const layout = read("app/layout.tsx");
const marketingRuntime = read("components/seo/MarketingRuntime.tsx");

const checks = [
  ["only ad parameters are selected", /\["gclid", "gbraid", "wbraid"\]/.test(tracker)],
  ["non-ad visits return before fetch", tracker.indexOf("if (!clickType) return") < tracker.indexOf('fetch("/api/ad-clicks"')],
  ["sessionStorage duplicate suppression exists", /sessionStorage\.getItem\(sessionKey\)/.test(tracker)],
  ["database click id is unique", /unique index if not exists ad_clicks_click_id_uidx/.test(migration)],
  ["trusted Vercel IP header is used", /get\("x-vercel-forwarded-for"\)/.test(api) && /split\(","\)\[0\]/.test(api)],
  ["API has no public GET handler", !/export async function GET/.test(api)],
  ["database public access is revoked", /revoke all on public\.ad_clicks from anon, authenticated/.test(migration)],
  ["60 day cleanup exists", /interval '60 days'/.test(migration)],
  ["click logs require the shared Supabase admin session", /await requireAdmin\(\)/.test(clickLogsPage)],
  ["click logs use the shared admin shell", /<AdminShell>/.test(clickLogsPage)],
  ["marketing runtime is disabled on admin routes", /if \(isAdmin\) return null/.test(marketingRuntime)],
  ["no direct Google Ads conversion event in layout", !/gtag\(['"]event['"],\s*['"]conversion['"]/.test(`${layout}\n${marketingRuntime}`)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Ad click tracking checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Ad click tracking contract test passed: scope, deduplication, privacy and auth guards verified.");
