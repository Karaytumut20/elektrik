import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  return <AdminLayoutShell adminLabel={admin?.displayName ?? admin?.email ?? null}>{children}</AdminLayoutShell>;
}
