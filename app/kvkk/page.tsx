import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { companyConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { CheckCircle2, ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni | Çorlu Elektrikçi",
  description: "Elektrik hizmet talebi kapsamında işlenen kişisel verilere ilişkin KVKK aydınlatma metni.",
  path: "/kvkk",
});

export default function KvkkPage() {
  const sections = [
    {
      title: "1. Kişisel Verilerin Hangi Amaçla İşleneceği",
      desc: "İletişim formları, WhatsApp, telefon görüşmeleri veya e-posta yoluyla bizimle paylaştığınız ad, soyad, iletişim numarası, adres ve mesaj içeriği aşağıdaki amaçlar doğrultusunda işlenmektedir:",
      details: [
        "Hizmet talebinizin niteliğinin belirlenmesi (arıza tespiti, tesisat projesi vb.)",
        "İlgili bölgeye veya adrese servis yönlendirilmesi ve randevu takibi",
        "Hizmet tekliflerinin oluşturulması ve fiyatlandırılması",
        "Tüketici hakları kapsamında fatura, garanti ve servis belgelerinin düzenlenmesi",
      ]
    },
    {
      title: "2. İşlenen Kişisel Verilerin Aktarılması",
      desc: "Kişisel verileriniz yasal zorunluluklar haricinde hiçbir şekilde üçüncü taraflara ticari veya reklam amacıyla aktarılmaz. Yalnızca aşağıdaki durumlarda paylaşım yapılabilir:",
      details: [
        "Yasal yükümlülüklerin yerine getirilmesi amacıyla ilgili kamu kurum ve kuruluşları ile",
        "Fatura, muhasebe süreçleri kapsamında yetkili mali müşavirlik birimleri ile",
      ]
    },
    {
      title: "3. Veri Toplama Yöntemi ve Hukuki Sebebi",
      desc: "Kişisel verileriniz, sitemizdeki teklif formları, doğrudan telefon aramalarınız ve WhatsApp yazışmalarınız kanalıyla tamamen dijital ortamda toplanmaktadır. İşleme faaliyeti şu hukuki sebeplere dayanır:",
      details: [
        "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (Hizmet verilmesi)",
        "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi",
        "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatler",
      ]
    },
    {
      title: "4. İlgili Kişi Olarak Haklarınız (11. Madde)",
      desc: "KVKK 11. maddesi kapsamında dilediğiniz zaman veri sorumlusuna başvurarak haklarınızı kullanabilirsiniz:",
      details: [
        "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
        "İşlenmişse buna ilişkin bilgi talep etme ve işlenme amacını öğrenme",
        "Eksik veya yanlış işlenmişse düzeltilmesini, yasal şartlar oluştuğunda silinmesini isteme",
        "İşlenen verilerin kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme",
      ]
    }
  ];

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-electric-navy text-white py-16 lg:py-20">
        <div className="site-container relative">
          <Breadcrumbs
            items={[{ label: "KVKK Aydınlatma Metni", href: "/kvkk" }]}
            className="[&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-slate-500"
          />
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-4 py-1.5 text-sm font-semibold text-electric-yellow">
              <ShieldCheck className="h-4 w-4" />
              Veri Güvenliği Standardı
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              KVKK Aydınlatma Metni
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu uyarınca kişisel verilerinizin işlenme amaçları ve yasal haklarınız hakkında bilgilendirme.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-3">
          {/* Detailed Clauses */}
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

          {/* Right Info blocks */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-white/10">
              <ExternalLink className="h-10 w-10 text-electric-yellow mb-4" />
              <h3 className="text-lg font-bold">Nasıl Başvurabilirsiniz?</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Kanun kapsamındaki taleplerinizi kimliğinizi teyit edecek belgelerle birlikte doğrudan firmamızın e-posta adresine iletebilirsiniz.
              </p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${companyConfig.email}`} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg border border-white/10 text-sm font-semibold transition-colors justify-center">
                  <Mail className="h-4.5 w-4.5" />
                  {companyConfig.email}
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-950 mb-3">Hızlı İletişim</h3>
              <p className="text-sm leading-6 text-slate-600 mb-4">
                Kişisel verilerinizin saklanması ve korunması ile ilgili detaylar hakkında telefonla da bilgi alabilirsiniz.
              </p>
              <div className="space-y-3">
                <ButtonLink href={phoneHref()} variant="secondary" className="w-full justify-center">
                  Hemen Ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl("KVKK aydınlatma metni hakkında bilgi almak istiyorum.")} variant="whatsapp" className="w-full justify-center">
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
