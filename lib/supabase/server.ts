import { cookies } from "next/headers";
import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { requireSupabasePublicEnv, requireSupabaseServiceEnv } from "@/lib/supabase/env";
import { customFetch } from "@/lib/supabase/fetch";

let serviceClient: SupabaseClient | undefined;

const getSupabaseServerClient = cache(async () => {
  const env = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware and actions can.
        }
      },
    },
    global: {
      fetch: customFetch,
    },
  });
});

export async function createSupabaseServerClient() {
  return getSupabaseServerClient();
}

export function createSupabaseServiceClient() {
  if (serviceClient) return serviceClient;

  const env = requireSupabaseServiceEnv();
  serviceClient = createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: customFetch,
    },
  });
  return serviceClient;
}
