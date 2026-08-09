import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
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

const hasExtendedAdminProfileSchema = unstable_cache(async () => {
  const { error } = await createSupabaseServiceClient()
    .from("admin_profiles")
    .select("app_role, staff_id")
    .limit(0);
  if (!error) return true;
  if (error.code === "42703") return false;
  throw error;
}, ["admin-profile-schema-v1"], { revalidate: 300 });

const getCachedAdminProfile = unstable_cache(async (userId: string) => {
  const service = createSupabaseServiceClient();
  const supportsExtendedProfile = await hasExtendedAdminProfileSchema();
  let displayName: string | null;
  let rawRole: string | null;
  let staffId: string | null;

  if (!supportsExtendedProfile) {
    const { data: legacyProfile, error: legacyProfileError } = await service
      .from("admin_profiles")
      .select("display_name, role, is_active")
      .eq("user_id", userId)
      .maybeSingle();
    if (legacyProfileError) throw legacyProfileError;
    if (!legacyProfile?.is_active) return null;
    displayName = legacyProfile.display_name ?? null;
    rawRole = legacyProfile.role;
    staffId = null;
  } else {
    const { data: extendedProfile, error: extendedProfileError } = await service
      .from("admin_profiles")
      .select("display_name, role, app_role, staff_id, is_active")
      .eq("user_id", userId)
      .maybeSingle();
    if (extendedProfileError) throw extendedProfileError;
    if (!extendedProfile?.is_active) return null;
    displayName = extendedProfile.display_name ?? null;
    rawRole = extendedProfile.app_role ?? extendedProfile.role;
    staffId = extendedProfile.staff_id ?? null;
  }

  const role = (rawRole === "admin" ? "super_admin" : rawRole) as AdminRole;
  if (!["super_admin", "manager", "editor", "support", "service_staff", "viewer"].includes(role)) return null;
  return { displayName, role, staffId };
}, ["admin-profile-by-user-v1"], { revalidate: 30 });

function isInvalidSessionError(error: { name?: string; status?: number }) {
  return error.name === "AuthSessionMissingError"
    || error.name === "AuthInvalidJwtError"
    || error.status === 400
    || error.status === 401
    || error.status === 403;
}

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  if (!hasSupabasePublicEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    if (isInvalidSessionError(error)) return null;
    throw error;
  }

  const claims = data?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return null;

  const profile = await getCachedAdminProfile(userId);
  if (!profile) return null;
  return {
    id: userId,
    email: typeof claims?.email === "string" ? claims.email : null,
    ...profile,
  };
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
