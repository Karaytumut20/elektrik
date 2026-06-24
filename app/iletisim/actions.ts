"use server";

import { z } from "zod";

export type ContactState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const contactSchema = z.object({
  name: z.string().trim().min(3, "Ad soyad en az 3 karakter olmali."),
  phone: z.string().trim().min(10, "Telefon numarasi zorunludur."),
  email: z.string().trim().email("Gecerli bir e-posta girin.").optional().or(z.literal("")),
  service: z.string().trim().min(2, "Hizmet secimi zorunludur."),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmali."),
  consent: z.literal("on", { errorMap: () => ({ message: "KVKK onayi zorunludur." }) }),
});

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

export async function sendContactRequest(_: ContactState, formData: FormData): Promise<ContactState> {
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
    return { message: "Form alanlarini kontrol edin.", fieldErrors };
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
      return { message: "Mesaj dogrulandi ancak iletim servisi yanit vermedi. Lutfen telefon veya WhatsApp ile ulasin." };
    }
  }

  return {
    ok: true,
    message: webhookUrl
      ? "Talebiniz alindi. En kisa surede donus yapilacak."
      : "Form dogrulandi. Gonderim servisi baglanana kadar lutfen telefon veya WhatsApp ile iletisime gecin.",
  };
}
