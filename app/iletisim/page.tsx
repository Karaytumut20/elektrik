import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";

export const metadata = buildMetadata({
  title: "Iletisim",
  description: "Elektrik ariza, tesisat, pano ve aydinlatma hizmetleri icin telefon, WhatsApp veya iletisim formu uzerinden teklif alin.",
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Iletisim", href: "/iletisim" }]} />
          <SectionHeading
            eyebrow="Iletisim"
            title="Elektrik isiniz icin hizli bilgi alin."
            description="Telefon, WhatsApp veya form uzerinden ariza belirtisini ve ihtiyacinizi paylasabilirsiniz."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            <Info icon={Phone} title="Telefon" text={companyConfig.phone} href={phoneHref()} />
            <Info icon={MessageCircle} title="WhatsApp" text="WhatsApp'tan yaz" href={whatsappUrl("Merhaba, elektrik hizmeti icin bilgi almak istiyorum.")} />
            <Info icon={Mail} title="E-posta" text={companyConfig.email} href={`mailto:${companyConfig.email}`} />
            <Info icon={MapPin} title="Adres" text={companyConfig.address} />
            <Info icon={Clock} title="Calisma saatleri" text={companyConfig.workingHours} />
            <Card className="bg-amber-100">
              <h2 className="text-xl font-bold text-slate-950">Acil elektrikci cagrisi</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Yanik kokusu, priz isinmasi veya surekli atan sigorta gibi riskli belirtilerde ilgili hattin enerjisini kesin ve hemen arayin.
              </p>
              <div className="mt-4">
                <ButtonLink href={phoneHref()} variant="secondary">
                  Hemen ara
                </ButtonLink>
              </div>
            </Card>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="site-container">
          <Card className="grid min-h-[260px] place-items-center bg-slate-100 text-center">
            <div>
              <MapPin className="mx-auto h-10 w-10 text-electric-blue" />
              <h2 className="mt-4 text-2xl font-bold text-slate-950">Harita alani</h2>
              <p className="mt-2 max-w-xl text-slate-600">
                Kesin firma adresi belirlendiginde harita iframe veya lokasyon baglantisi bu alana eklenecek.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

function Info({ icon: Icon, title, text, href }: { icon: typeof Phone; title: string; text: string; href?: string }) {
  const content = (
    <Card className="flex gap-4">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-electric-blue" />
      <div>
        <h2 className="font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </Card>
  );

  return href ? <a href={href}>{content}</a> : content;
}
