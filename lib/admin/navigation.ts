const DEFAULT_ADMIN_PATH = "/admin/dashboard";

export function safeAdminDestination(value: unknown) {
  if (typeof value !== "string") return DEFAULT_ADMIN_PATH;

  const isAdminPath = value === "/admin" || value.startsWith("/admin/") || value.startsWith("/admin?");
  const isLoginPath = value === "/admin/login"
    || value.startsWith("/admin/login?")
    || value === "/admin/click-logs/login"
    || value.startsWith("/admin/click-logs/login?");

  return isAdminPath && !isLoginPath ? value : DEFAULT_ADMIN_PATH;
}
