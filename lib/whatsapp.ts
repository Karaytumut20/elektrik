import { companyConfig } from "@/data/site";

export function phoneHref(phone = companyConfig.phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappUrl(message: string, phone = companyConfig.whatsapp) {
  const normalizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
