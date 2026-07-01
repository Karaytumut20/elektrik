import { companyConfig } from "@/data/site";

function hasUsablePhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 10 && !phone.includes("X");
}

export function phoneHref(phone = companyConfig.phone) {
  if (!hasUsablePhone(phone)) return "/iletisim";
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappUrl(message: string, phone = companyConfig.whatsapp) {
  if (!hasUsablePhone(phone)) return "/iletisim";
  const normalizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
