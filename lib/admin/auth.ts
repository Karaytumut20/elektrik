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
    const { data: extendedProfile, error: extendedProfileError } = await service
      .from("admin_profiles")
      .select("display_name, role, app_role, staff_id, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    // Older installations do not have app_role/staff_id until the operations
    // migration is applied. Falling back keeps the existing admin login usable.
    const needsLegacyFallback = extendedProfileError?.code === "42703";
    let displayName: string | null;
    let rawRole: string | null;
    let staffId: string | null;

    if (needsLegacyFallback) {
      const { data: legacyProfile, error: legacyProfileError } = await service
        .from("admin_profiles")
        .select("display_name, role, is_active")
        .eq("user_id", user.id)
        .maybeSingle();
      if (legacyProfileError || !legacyProfile?.is_active) return null;
      displayName = legacyProfile.display_name ?? null;
      rawRole = legacyProfile.role;
      staffId = null;
    } else {
      if (extendedProfileError || !extendedProfile?.is_active) return null;
      displayName = extendedProfile.display_name ?? null;
      rawRole = extendedProfile.app_role ?? extendedProfile.role;
      staffId = extendedProfile.staff_id ?? null;
    }

    const role = (rawRole === "admin" ? "super_admin" : rawRole) as AdminRole;
    if (!["super_admin", "manager", "editor", "support", "service_staff", "viewer"].includes(role)) return null;
    return {
      id: user.id,
      email: user.email ?? null,
      displayName,
      role,
      staffId,
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
