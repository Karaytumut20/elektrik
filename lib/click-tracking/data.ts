import "server-only";

import { unstable_cache } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export type AdClickRow = {
  click_id: string;
  click_type: "gclid" | "gbraid" | "wbraid";
  ip_address: string;
  clicked_at: string;
  landing_page: string;
  user_agent: string | null;
  country: string | null;
};

export type AdClickGroup = {
  ip: string;
  country: string;
  clickCount: number;
  distinctClickCount: number;
  firstVisit: string;
  lastVisit: string;
  device: string;
  landingPages: string[];
  clickCodes: { type: string; id: string }[];
  suspicious: boolean;
};

function deviceFromUserAgent(userAgent: string | null) {
  if (!userAgent) return "Bilinmiyor";
  if (/bot|crawler|spider|headless/i.test(userAgent)) return "Bot / otomasyon";
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "Mobil";
  return "Masaüstü";
}

async function fetchGroupedAdClicks(days: 1 | 7 | 30 | 60) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await createSupabaseServiceClient()
    .from("ad_clicks")
    .select("click_id,click_type,ip_address,clicked_at,landing_page,user_agent,country")
    .gte("clicked_at", since)
    .order("clicked_at", { ascending: false })
    .limit(5000);
  if (error) throw error;

  const rows = (data ?? []) as AdClickRow[];
  const last24Hours = Date.now() - 86400000;
  const recentDistinctByIp = new Map<string, Set<string>>();
  for (const row of rows) {
    if (new Date(row.clicked_at).getTime() >= last24Hours) {
      const set = recentDistinctByIp.get(row.ip_address) ?? new Set<string>();
      set.add(row.click_id);
      recentDistinctByIp.set(row.ip_address, set);
    }
  }

  const grouped = new Map<string, AdClickGroup>();
  for (const row of rows) {
    const current = grouped.get(row.ip_address);
    if (!current) {
      grouped.set(row.ip_address, {
        ip: row.ip_address,
        country: row.country ?? "--",
        clickCount: 1,
        distinctClickCount: 1,
        firstVisit: row.clicked_at,
        lastVisit: row.clicked_at,
        device: deviceFromUserAgent(row.user_agent),
        landingPages: [row.landing_page],
        clickCodes: [{ type: row.click_type, id: row.click_id }],
        suspicious: (recentDistinctByIp.get(row.ip_address)?.size ?? 0) >= 3,
      });
      continue;
    }
    current.clickCount += 1;
    if (!current.clickCodes.some((item) => item.id === row.click_id)) {
      current.clickCodes.push({ type: row.click_type, id: row.click_id });
      current.distinctClickCount += 1;
    }
    if (!current.landingPages.includes(row.landing_page)) current.landingPages.push(row.landing_page);
    if (row.clicked_at < current.firstVisit) current.firstVisit = row.clicked_at;
    if (row.clicked_at > current.lastVisit) current.lastVisit = row.clicked_at;
  }

  return { groups: [...grouped.values()].sort((a, b) => b.clickCount - a.clickCount), total: rows.length, truncated: rows.length === 5000 };
}

export const getGroupedAdClicks = unstable_cache(fetchGroupedAdClicks, ["grouped-ad-clicks-v1"], { revalidate: 15 });
