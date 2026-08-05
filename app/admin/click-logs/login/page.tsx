import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ClickLogLoginPage() {
  redirect("/admin/login?next=/admin/click-logs");
}
