import { isIP } from "node:net";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const payloadSchema = z.object({
  clickType: z.enum(["gclid", "gbraid", "wbraid"]),
  clickId: z.string().trim().min(6).max(512).regex(/^[A-Za-z0-9._~-]+$/),
  landingPage: z.string().trim().min(1).max(2048).startsWith("/"),
  pageReferrer: z.string().trim().max(2048).optional().default(""),
});

function empty(status = 204) {
  return new Response(null, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 4096 || !request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return empty(415);

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  const origin = request.headers.get("origin");
  if (!host || !origin || origin !== `${protocol}://${host}`) return empty(403);
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return empty(403);

  const forwarded = request.headers.get("x-vercel-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  if (!ip || isIP(ip) === 0) return empty();

  let json: unknown;
  try { json = await request.json(); } catch { return empty(400); }
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) return empty(400);

  const requestReferrer = request.headers.get("referer");
  try {
    if (!requestReferrer) return empty(403);
    const landingUrl = new URL(requestReferrer);
    if (landingUrl.host !== host || landingUrl.searchParams.get(parsed.data.clickType) !== parsed.data.clickId) return empty(403);
  } catch {
    return empty(403);
  }

  const countryHeader = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  const country = countryHeader && /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
  const userAgent = request.headers.get("user-agent")?.slice(0, 1024) || null;
  const pageReferrer = parsed.data.pageReferrer || null;
  const db = createSupabaseServiceClient();

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const rate = await db.from("ad_clicks").select("id", { count: "exact", head: true }).eq("ip_address", ip).gte("clicked_at", tenMinutesAgo);
  if (rate.error) return empty(503);
  if ((rate.count ?? 0) >= 30) return empty(429);

  const { error } = await db.from("ad_clicks").insert({
    click_id: parsed.data.clickId,
    click_type: parsed.data.clickType,
    ip_address: ip,
    landing_page: parsed.data.landingPage,
    user_agent: userAgent,
    referrer: pageReferrer,
    country,
  });
  if (error?.code === "23505") return empty();
  if (error) return empty(503);
  return empty();
}
