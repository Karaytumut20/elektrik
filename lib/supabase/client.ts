"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";
import { customFetch } from "@/lib/supabase/fetch";

export function createSupabaseBrowserClient() {
  const env = requireSupabasePublicEnv();
  return createBrowserClient(env.url, env.anonKey, {
    global: {
      fetch: customFetch,
    },
  });
}
