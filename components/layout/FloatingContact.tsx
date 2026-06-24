import { MessageCircle, Phone } from "lucide-react";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-40 grid gap-2 sm:bottom-6 sm:right-6">
      <a className="grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-white shadow-lg" href={phoneHref()} aria-label="Telefonla ara">
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
      <a
        className="grid h-12 w-12 place-items-center rounded-md bg-emerald-600 text-white shadow-lg"
        href={whatsappUrl("Merhaba, elektrik hizmeti icin bilgi almak istiyorum.")}
        aria-label="WhatsApp ile yaz"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
