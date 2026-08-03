import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const migration = read("supabase/migrations/20260803000000_ad_click_tracking.sql");
const api = read("app/api/ad-clicks/route.ts");
const tracker = read("components/seo/AdClickTracker.tsx");
const auth = read("lib/click-tracking/auth.ts");
const layout = read("app/layout.tsx");

const checks = [
  ["only ad parameters are selected", /\["gclid", "gbraid", "wbraid"\]/.test(tracker)],
  ["non-ad visits return before fetch", tracker.indexOf("if (!clickType) return") < tracker.indexOf('fetch("/api/ad-clicks"')],
  ["sessionStorage duplicate suppression exists", /sessionStorage\.getItem\(sessionKey\)/.test(tracker)],
  ["database click id is unique", /unique index if not exists ad_clicks_click_id_uidx/.test(migration)],
  ["trusted Vercel IP header is used", /get\("x-vercel-forwarded-for"\)/.test(api) && /split\(","\)\[0\]/.test(api)],
  ["API has no public GET handler", !/export async function GET/.test(api)],
  ["database public access is revoked", /revoke all on public\.ad_clicks from anon, authenticated/.test(migration)],
  ["60 day cleanup exists", /interval '60 days'/.test(migration)],
  ["admin cookie is httpOnly", /httpOnly: true/.test(auth)],
  ["admin secret is not public", !/NEXT_PUBLIC_CLICK_LOG/.test(auth)],
  ["no direct Google Ads conversion event in layout", !/gtag\(['"]event['"],\s*['"]conversion['"]/.test(layout)],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  console.error(`Ad click tracking checks failed:\n${failed.join("\n")}`);
  process.exit(1);
}

console.log("Ad click tracking contract test passed: scope, deduplication, privacy and auth guards verified.");
