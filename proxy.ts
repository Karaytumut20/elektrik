import { type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSupabaseSession(request);
}

export const config = {
  // Authentication is used only by the admin application. Avoid running a
  // Supabase session check for every public page, feed and API request.
  matcher: ["/admin/:path*"],
};
