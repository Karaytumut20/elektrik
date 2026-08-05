import type { ReactNode } from "react";

// Kept as a lightweight compatibility wrapper for existing admin pages.
// The persistent chrome now lives in app/admin/layout.tsx.
export function AdminShell({ children }: { children: ReactNode }) {
  return children;
}
