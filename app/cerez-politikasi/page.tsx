import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { CheckCircle2, Shield, Eye, HelpCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata = buildMetadata({
  title: "Çerez Politikası | Çorlu Elektrikçi",
  description: "Web sitesinde kullanılabilecek zorunlu, performans ve iletişim amaçlı çerezlere ilişkin bilgilendirme.",
  path: "/cerez-politikasi",
});

export default function CookiePage() {
  const sections = [
    {
      title: "1. Çerez (Cookie) Nedir?",
      desc: "Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet veya telefon) yerleştirilen küçük metin dosyalarıdır. Sitenin güvenli, verimli ve tercihlerinize uygun çalışmasını sağlamak için kullanılır.",
      details: [
        "Geçici Çerezler: Ziyaretiniz boyunca geçerlidir, tarayıcı kapandığında silinir.",
        "Kalıcı Çerezler: Belirli bir son kullanma tarihine kadar cihazınızda kalır."
      ]
    },
    {
      title: "2. Hangi Çerezleri Kullanıyoruz?",
      desc: "Web sitemizde yalnızca temel işlevlerin yerine getirilmesi amacıyla sınırlı çerez türleri kullanılmaktadır:",
      details: [
        "Zorunlu Çerezler: Site güvenliği, gezinti ve form gönderimlerinin sağlıklı çalışması için zorunludur.",
        "Performans Çerezleri: Ziyaretçilerin siteyi nasıl kullandığını anlamak üzere kullanılan anonim istatistik araçları."
      ]
    },
    {
      title: "3. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?",
      desc: "Tarayıcınızın ayarlarını değiştirerek çerez kullanımını kısıtlama, engelleme veya silme haklarına sahipsiniz. Popüler tarayıcılarda çerez yönetimi için aşağıdaki adımları izleyebilirsiniz:",
      details: [
        "Google Chrome: Ayarlar > Gizlilik ve Güvenlik > Üçüncü Taraf Çerezleri",
        "Mozilla Firefox: Seçenekler > Gizlilik ve Güvenlik > Çerezler ve Site Verileri",
        "Safari: Tercihler > Gizlilik > Çerezleri ve web sitesi verilerini engelle",
      ]
    }
  ];

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-electric-navy text-white py-16 lg:py-20">
        <div className="site-container relative">
          <Breadcrumbs
            items={[{ label: "Çerez Politikası", href: "/cerez-politikasi" }]}
            className="[&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-slate-500"
          />
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <Eye className="h-4 w-4" />
              Veri İzleme Şeffaflığı
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Çerez Politikası
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Web sitemizin güvenli ve kararlı çalışması için kullanılan çerezler, kullanım amaçları ve tercihlerinizi yönetme yöntemleri.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BODY GRID */}
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
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

          {/* Right Info sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-white/10">
              <Shield className="h-10 w-10 text-electric-yellow mb-4" />
              <h3 className="text-lg font-bold">Gizlilik Önceliğimizdir</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Sitemizde kesinlikle reklam veya üçüncü taraf takip çerezleri barındırılmaz. Amacımız yalnızca temiz ve kesintisiz bir kullanıcı deneyimi sunmaktır.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60">
              <HelpCircle className="h-10 w-10 text-electric-blue mb-4" />
              <h3 className="text-lg font-bold text-slate-950 mb-2">Sorularınız mı var?</h3>
              <p className="text-sm leading-6 text-slate-600 mb-4">
                Çerez kullanım politikamız ile ilgili aklınıza takılan soruları bize doğrudan iletebilirsiniz.
              </p>
              <div className="space-y-3">
                <ButtonLink href={phoneHref()} variant="secondary" className="w-full justify-center">
                  Hemen Ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl("Çerez politikası hakkında bilgi almak istiyorum.")} variant="whatsapp" className="w-full justify-center">
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
