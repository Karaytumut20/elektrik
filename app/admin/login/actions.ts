"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

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
    return { error: "Giris basarisiz. Bilgileri ve Supabase Auth kullanicisini kontrol edin." };
  }

  redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin/blog");
}
