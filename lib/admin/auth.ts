import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export type AdminRole = "super_admin" | "manager" | "editor" | "support" | "service_staff" | "viewer";

export type CurrentAdmin = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: AdminRole;
  staffId: string | null;
};

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  try {
    const service = createSupabaseServiceClient();
    const { data: profile, error: profileError } = await service
      .from("admin_profiles")
      .select("display_name, role, app_role, staff_id, is_active")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profileError || !profile?.is_active) return null;
    const rawRole = profile.app_role ?? profile.role;
    const role = (rawRole === "admin" ? "super_admin" : rawRole) as AdminRole;
    if (!["super_admin", "manager", "editor", "support", "service_staff", "viewer"].includes(role)) return null;
    return {
      id: user.id,
      email: user.email ?? null,
      displayName: profile.display_name ?? null,
      role,
      staffId: profile.staff_id ?? null,
    };
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  if (!hasSupabasePublicEnv()) redirect("/admin/login?setup=missing-env");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireRole(roles: AdminRole[]) {
  const admin = await requireAdmin();
  if (!roles.includes(admin.role)) redirect("/admin?error=unauthorized");
  return admin;
}

export function canSeeFinance(role: AdminRole) {
  return ["super_admin", "manager", "editor"].includes(role);
}

export function canWrite(role: AdminRole) {
  return role !== "viewer";
}
