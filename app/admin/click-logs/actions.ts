"use server";

import { redirect } from "next/navigation";
import {
  clearClickLogSession,
  createClickLogSession,
  hasClickLogAdminEnv,
  validateClickLogCredentials,
} from "@/lib/click-tracking/auth";

export type ClickLogLoginState = { error?: string };

export async function signInClickLogs(_: ClickLogLoginState, formData: FormData): Promise<ClickLogLoginState> {
  if (!hasClickLogAdminEnv()) return { error: "Yönetici ortam değişkenleri henüz tanımlı değil." };
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string") return { error: "Kullanıcı adı ve parola zorunludur." };
  if (!validateClickLogCredentials(username, password)) return { error: "Kullanıcı adı veya parola hatalı." };
  await createClickLogSession();
  redirect("/admin/click-logs");
}

export async function signOutClickLogs() {
  await clearClickLogSession();
  redirect("/admin/click-logs/login");
}
