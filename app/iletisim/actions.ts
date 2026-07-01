"use server";

import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type ContactState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const contactSchema = z.object({
  name: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı."),
  phone: z.string().trim().min(10, "Telefon numarası zorunludur."),
  email: z.string().trim().email("Geçerli bir e-posta girin.").optional().or(z.literal("")),
  service: z.string().trim().min(2, "Hizmet seçimi zorunludur."),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı."),
  consent: z.literal("on", { errorMap: () => ({ message: "KVKK onayı zorunludur." }) }),
});

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

// Anti-spam in-memory rate-limiting
const ipSubmissions = new Map<string, number[]>();
const SHORT_WINDOW = 60 * 1000; // 1 minute
const SHORT_LIMIT = 5; // Max 5 submissions per minute
const LONG_WINDOW = 60 * 60 * 1000; // 1 hour
const LONG_LIMIT = 50; // Max 50 submissions per hour

export async function sendContactRequest(_: ContactState, formData: FormData): Promise<ContactState> {
  // 1. Honeypot check for bots
  const honeypot = formData.get("bot_trap_field");
  if (honeypot && typeof honeypot === "string" && honeypot.length > 0) {
    console.warn("[ContactForm] Honeypot triggered. Bot check field value:", honeypot);
    // Return silent success to trick spam bots without saving or executing webhook
    return {
      ok: true,
      message: "Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
    };
  }

  // 2. Rate limiting check by Client IP
  let ip = "127.0.0.1";
  try {
    const clientHeaders = await headers();
    ip = clientHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const now = Date.now();
    const times = ipSubmissions.get(ip) || [];
    
    // Clean up old timestamps
    const shortTerm = times.filter((t) => now - t < SHORT_WINDOW);
    const longTerm = times.filter((t) => now - t < LONG_WINDOW);

    if (shortTerm.length >= SHORT_LIMIT || longTerm.length >= LONG_LIMIT) {
      return {
        message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.",
      };
    }

    longTerm.push(now);
    ipSubmissions.set(ip, longTerm);
  } catch (e) {
    console.error("Rate limiting check failed:", e);
  }

  const parsed = contactSchema.safeParse({
    name: value(formData, "name"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    service: value(formData, "service"),
    message: value(formData, "message"),
    consent: value(formData, "consent"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { message: "Form alanlarını kontrol edin.", fieldErrors };
  }

  // Save to database
  try {
    const supabase = createSupabaseServiceClient();
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        service: parsed.data.service,
        message: parsed.data.message,
        ip_address: ip,
      });
    if (dbError) throw dbError;
  } catch (err) {
    console.error("[ContactForm] Database error:", err);
    return { message: "Mesajınız kaydedilirken sistemsel bir hata oluştu. Lütfen telefon veya WhatsApp ile ulaşın." };
  }

  const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Webhook failed");
    } catch {
      // Return success because it is already saved in the database!
    }
  }

  return {
    ok: true,
    message: "Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
  };
}
