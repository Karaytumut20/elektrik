import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export type CurrentAdmin = {
  id: string;
  email: string | null;
};

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return { id: user.id, email: user.email ?? null };
});

export async function requireAdmin() {
  if (!hasSupabasePublicEnv()) redirect("/admin/login?setup=missing-env");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
