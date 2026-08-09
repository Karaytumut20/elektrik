"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { safeAdminDestination } from "@/lib/admin/navigation";

export type LoginState = {
  error?: string;
};

export async function signInAdmin(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!hasSupabasePublicEnv()) {
    return { error: "Supabase ortam degiskenleri tanimli degil. .env.example dosyasini kullanarak kurulum yapin." };
  }

  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "E-posta ve sifre zorunludur." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.status !== 400 && error.status !== 401) {
      return { error: "Giriş servisine şu anda ulaşılamıyor. Lütfen kısa süre sonra tekrar deneyin." };
    }
    return { error: "Giris basarisiz. Bilgileri ve Supabase Auth kullanicisini kontrol edin." };
  }

  let adminCheckCompleted = false;
  let admin = null;
  try {
    admin = await getCurrentAdmin();
    adminCheckCompleted = true;
  } catch {
    // The session was created successfully. Let the destination page show its
    // retry state instead of sending the user back through the login form.
  }

  if (adminCheckCompleted && !admin) {
    await supabase.auth.signOut({ scope: "local" });
    return { error: "Bu hesap için aktif bir admin paneli yetkisi bulunamadı." };
  }

  redirect(safeAdminDestination(next));
}
