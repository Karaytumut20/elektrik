import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminPwaRegister } from "@/components/admin/AdminPwaRegister";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  applicationName: "İnallar Elektrik Admin",
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Elektrik Admin",
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // A temporary Supabase/network failure must not turn into a false logout.
  // Protected pages surface the failure through the admin error boundary.
  const admin = await getCurrentAdmin().catch(() => null);
  return <><AdminPwaRegister /><AdminLayoutShell adminLabel={admin?.displayName ?? admin?.email ?? null}>{children}</AdminLayoutShell></>;
}
