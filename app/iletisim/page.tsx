import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/cn";

export const metadata = buildMetadata({
  title: "İnallar Elektrik | İletişim",
  description: "İnallar Elektrik Çorlu elektrikçi iletişim: elektrik arıza, tesisat, pano, avize ve aydınlatma hizmetleri için telefon, WhatsApp veya formdan teklif alın.",
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "İletişim", href: "/iletisim" }]} />
          <SectionHeading
            eyebrow="İletişim"
            title="Çorlu elektrikçi desteği için hızlı bilgi alın."
            description="Telefon, WhatsApp veya form üzerinden arıza belirtisini, mahallenizi ve ihtiyacınızı paylaşabilirsiniz."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            <Info icon={Phone} title="Telefon" text={companyConfig.phone} href={phoneHref()} />
            <Info
              icon={WhatsAppIcon}
              title="WhatsApp"
              text="WhatsApp'tan yaz"
              href={whatsappUrl("Merhaba, elektrik hizmeti için bilgi almak istiyorum.")}
              className="border-[#075e54] bg-[#075e54] transition-colors duration-200 hover:bg-[#064f47]"
              iconClassName="text-white"
              titleClassName="text-white"
              textClassName="text-white font-medium"
            />
            <Info icon={Mail} title="E-posta" text={companyConfig.email} href={`mailto:${companyConfig.email}`} />
            <Info icon={MapPin} title="Adres" text={companyConfig.address} />
            <Info icon={Clock} title="Çalışma saatleri" text={companyConfig.workingHours} />
            <Card className="bg-amber-100">
              <h2 className="text-xl font-bold text-slate-950">Acil elektrikçi çağrısı</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Yanık kokusu, priz ısınması veya sürekli atan sigorta gibi riskli belirtilerde ilgili hattın enerjisini kesin ve hemen arayın.
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
              <h2 className="mt-4 text-2xl font-bold text-slate-950">Çorlu ve yakın çevre hizmet bölgesi</h2>
              <p className="mt-2 max-w-xl text-slate-600">
                Talebinizi iletirken mahalle, bina tipi ve arıza belirtisini paylaşırsanız keşif ve müdahale planı daha hızlı netleşir.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

interface InfoProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  href?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  textClassName?: string;
}

function Info({
  icon: Icon,
  title,
  text,
  href,
  className,
  iconClassName = "text-electric-blue",
  titleClassName = "text-slate-950",
  textClassName = "text-slate-600",
}: InfoProps) {
  const content = (
    <Card className={cn("flex gap-4", className)}>
      <Icon className={cn("mt-1 h-5 w-5 shrink-0", iconClassName)} />
      <div>
        <h2 className={cn("font-bold", titleClassName)}>{title}</h2>
        <p className={cn("mt-1 text-sm", textClassName)}>{text}</p>
      </div>
    </Card>
  );

  return href ? <a href={href}>{content}</a> : content;
}
