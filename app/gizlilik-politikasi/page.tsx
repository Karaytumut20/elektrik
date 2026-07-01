import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { CheckCircle2, ShieldAlert, FileText, Scale } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata = buildMetadata({
  title: "Gizlilik Politikası | Çorlu Elektrikçi",
  description: "Elektrik hizmetleri web sitesi gizlilik politikası ve kişisel veri işleme prensipleri.",
  path: "/gizlilik-politikasi",
});

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Veri Sorumlusu ve Kapsam",
      desc: "Bu gizlilik politikası, web sitemiz üzerinden paylaştığınız kişisel verilerin toplanması, işlenmesi ve korunması ile ilgili detayları içerir.",
      details: [
        `Veri Sorumlusu: ${companyConfig.legalName}`,
        `E-posta İletişim: ${companyConfig.email}`,
        `Hizmet Bölgesi: ${companyConfig.address}`,
      ]
    },
    {
      title: "2. Hangi Verileri İşliyoruz?",
      desc: "Hizmet talebinizi karşılamak ve sizinle iletişim kurmak amacıyla sınırlı olarak aşağıdaki veriler işlenmektedir:",
      details: [
        "Adınız, Soyadınız ve iletişim kurulacak Telefon Numaranız",
        "E-posta adresiniz (form ile gönderildiğinde)",
        "Talep ettiğiniz hizmet tipi ve adres detaylarınız",
        "İletişim formlarında kendi rızanızla belirttiğiniz mesaj içeriği",
      ]
    },
    {
      title: "3. Verilerin İşlenme Amacı ve Aktarımı",
      desc: "Kişisel verileriniz, yalnızca size elektrik arıza, pano kurulumu veya tesisat teklifi hazırlamak amacıyla işlenir. Kesinlikle üçüncü şahıslara satılmaz veya ticari amaçla paylaşılmaz.",
      details: [
        "Teklif hazırlama ve arıza tespit randevusu planlama",
        "Hizmet sonrası kalite kontrol ve garanti süreçlerinin takibi",
        "Yasal yükümlülüklerin (fatura vb.) yerine getirilmesi",
      ]
    },
    {
      title: "4. Veri Güvenliği",
      desc: "Verileriniz, yetkisiz erişim, kayıp veya kötüye kullanım risklerine karşı koruma amacıyla makul düzeydeki teknik ve idari güvenlik önlemleri altında saklanır.",
      details: [
        "SSL sertifikalı güvenli hat iletişimi",
        "Sınırlı erişim ve yetki kontrolleri",
      ]
    }
  ];

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-electric-navy text-white py-16 lg:py-20">
        <div className="site-container relative">
          <Breadcrumbs
            items={[{ label: "Gizlilik Politikası", href: "/gizlilik-politikasi" }]}
            className="[&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-slate-500"
          />
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <Scale className="h-4 w-4" />
              Yasal Bilgilendirme
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Gizlilik Politikası
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Web sitemizi ziyaret ederken veya hizmet talebi oluştururken paylaştığınız kişisel verilerin güvenliği ve işlenme şartları.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BODY SECTIONS */}
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950 mb-3">{section.title}</h2>
                <p className="text-sm leading-6 text-slate-600 mb-4">{section.desc}</p>
                <ul className="space-y-2.5">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="h-4.5 w-4.5 text-electric-blue shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-white/10">
              <ShieldAlert className="h-10 w-10 text-electric-yellow mb-4" />
              <h3 className="text-lg font-bold">Kullanıcı Hakları</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                KVKK kapsamında verilerinizin silinmesini, güncellenmesini isteme veya hangi verilerinizin işlendiğini öğrenme hakkına sahipsiniz.
              </p>
              <div className="mt-6">
                <ButtonLink href="/iletisim" variant="primary" className="w-full justify-center">
                  Talep Gönder
                </ButtonLink>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-950 mb-3">Hızlı İletişim</h3>
              <p className="text-sm leading-6 text-slate-600 mb-4">
                Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için bizimle doğrudan iletişime geçebilirsiniz.
              </p>
              <div className="space-y-3">
                <ButtonLink href={phoneHref()} variant="secondary" className="w-full justify-center">
                  Hemen Ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl("Gizlilik politikası hakkında bilgi almak istiyorum.")} variant="whatsapp" className="w-full justify-center">
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
