import { Cable, LampCeiling, Plug, ShieldCheck, Siren, Zap } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type AreaService = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
};

export type AreaFaq = {
  question: string;
  answer: string;
};

export type ServiceArea = {
  slug: string;
  name: string;
  shortName: string;
  heroImage: string;      // rotates among 4 area images
  galleryImages: string[];
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  features: { title: string; description: string }[];
  services: AreaService[];
  faqs: AreaFaq[];
  nearbyAreas: string[];
};

// 4 high-quality images rotate across all area pages
const IMAGES = {
  city: "/images/area-city-dusk.jpg",
  electrician: "/images/area-electrician-apartment.jpg",
  interior: "/images/area-modern-interior.jpg",
  panel: "/images/area-clean-panel.jpg",
};

const commonServices: AreaService[] = [
  {
    icon: Zap,
    title: "Elektrik Arıza Tespiti",
    description: "Sigorta atması, hat kopukluğu, kısa devre ve kaçak akım arızaları için sistemli ölçüm ve tespit.",
    href: "/hizmetler/elektrik-ariza-tespiti",
  },
  {
    icon: Cable,
    title: "Ev & İş Yeri Tesisatı",
    description: "Priz, aydınlatma, mutfak ve yüksek güç hatları dahil tüm kablo altyapısı.",
    href: "/hizmetler/ev-elektrik-tesisati",
  },
  {
    icon: ShieldCheck,
    title: "Pano Yenileme",
    description: "Eski sigortaların, zayıf klemenslerin ve karışık hatların güvenli şekilde yenilenmesi.",
    href: "/hizmetler/sigorta-ve-elektrik-panosu-yenileme",
  },
  {
    icon: Plug,
    title: "Priz & Anahtar Montajı",
    description: "Yerinde veya yeni hat çekilerek priz ve anahtar kurulumu, yenilenmesi.",
    href: "/hizmetler/priz-ve-anahtar-montaji",
  },
  {
    icon: LampCeiling,
    title: "Avize & Aydınlatma",
    description: "Avize, spot, LED şerit ve sarkıt aydınlatma montajı ve kablo düzenlemesi.",
    href: "/hizmetler/avize-montaji",
  },
  {
    icon: Siren,
    title: "Acil Elektrikçi",
    description: "Gece veya gündüz elektrik kesintisi ve acil arıza durumlarında hızlı müdahale.",
    href: "/hizmetler/acil-elektrikci",
  },
];

const commonFeatures = [
  {
    title: "Aynı Gün Dönüş",
    description: "Talep iletildiğinde en kısa sürede yanıt veriliyor, planlama hemen yapılıyor.",
  },
  {
    title: "Şeffaf Teklif",
    description: "İşçilik ve malzeme kapsamı baştan net olarak paylaşılır, sürpriz ücret olmaz.",
  },
  {
    title: "Güvenli İşçilik",
    description: "Her işe başlamadan hat izole edilir; bitiş testleri yapılarak teslim gerçekleşir.",
  },
  {
    title: "TSE Onaylı Malzeme",
    description: "Kablo, sigorta ve ekipmanlarda yalnızca standartlara uygun ürünler kullanılır.",
  },
];

const primaryServiceAreas: ServiceArea[] = [
  {
    slug: "corlu-merkez",
    name: "Çorlu Merkez",
    shortName: "Çorlu Merkez",
    heroImage: IMAGES.city,
    galleryImages: [IMAGES.electrician, IMAGES.interior, IMAGES.panel],
    metaTitle: "Çorlu Merkez Elektrikçi | Arıza, Tesisat ve Pano",
    metaDescription: "Çorlu Merkez'de elektrik arıza tespiti, tesisat yenileme, pano düzenleme ve montaj hizmetleri. Aynı gün dönüş, şeffaf fiyat.",
    heroTitle: "Çorlu Merkez'de Elektrikçi Hizmeti",
    heroSubtitle: "Konut, iş yeri ve site elektrik işlerinde güvenilir çözüm",
    intro: "Çorlu Merkez'deki konutlar, apartmanlar, siteler ve küçük işletmeler için elektrik arıza tespitinden tesisat yenilemeye, pano düzenlemesinden aydınlatma montajına kadar kapsamlı elektrik hizmetleri sunuyoruz. İhtiyacı anlayarak, kapsam netleştirerek ve güvenli işçilikle tamamlıyoruz.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Çorlu Merkez'de acil elektrikçi desteği alabilir miyim?", answer: "Evet. Acil arıza ve güvenlik riski taşıyan durumlarda Çorlu Merkez'de öncelikli müdahale planlanmaktadır." },
      { question: "Apartman dairesi tesisatı için keşif gerekiyor mu?", answer: "Küçük priz ve aydınlatma işlerinde fotoğrafla ön değerlendirme yapılabilir. Kapsamlı tesisat için yerinde kontrol önerilir." },
      { question: "Pano yenileme kaç günde tamamlanır?", answer: "Standart konut panosu yenileme işlemi genellikle 1 iş gününde, büyük kapasiteli panolar 2 iş gününde tamamlanır." },
      { question: "Çorlu Merkez'de hangi saatlerde hizmet veriyorsunuz?", answer: "Pazartesi–Cumartesi 08:00–19:00 arası hizmet verilmektedir. Acil durumlar için aynı gün dönüş yapılır." },
    ],
    nearbyAreas: ["Alipaşa Mahallesi", "Muhittin Mahallesi", "Hürriyet Mahallesi", "Zafer Mahallesi"],
  },
  {
    slug: "alipasa",
    name: "Alipaşa Mahallesi",
    shortName: "Alipaşa",
    heroImage: IMAGES.electrician,
    galleryImages: [IMAGES.city, IMAGES.panel, IMAGES.interior],
    metaTitle: "Alipaşa Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Alipaşa Mahallesi'nde elektrik arıza tespiti, priz, pano ve tesisat hizmetleri. Hızlı yanıt, güvenli işçilik.",
    heroTitle: "Alipaşa Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Konut ve apartmanlarda güvenilir elektrik desteği",
    intro: "Alipaşa Mahallesi'ndeki konut ve apartmanlarda elektrik arızası, tesisat bakımı, pano düzenlemesi ve aydınlatma montajı için profesyonel destek sunuyoruz. Her işte kapsam baştan netleştirilir, güvenli uygulamayla tamamlanır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Alipaşa Mahallesi'nde elektrik arızasına ne kadar sürede gelinir?", answer: "Müsaitlik ve yoğunluk durumuna göre genellikle aynı gün veya ertesi gün ziyaret planlanmaktadır." },
      { question: "Eski bina tesisatı yenilenebilir mi?", answer: "Evet. Mevcut boru ve kanallar değerlendirilerek mümkün olan yerler korunur, yenilenmesi gereken kısımlar kapsama alınır." },
      { question: "Kaçak akım rölesi takılması zorunlu mu?", answer: "Zorunluluk yasal standartlara göre değişmekle birlikte, güvenlik açısından kesinlikle önerilmektedir." },
      { question: "Priz sayısı artırılabilir mi?", answer: "Evet. Mevcut tablo kapasitesine ve hat yapısına göre ek priz hattı çekilebilir." },
    ],
    nearbyAreas: ["Çorlu Merkez", "Muhittin Mahallesi", "Şeyhsinan Mahallesi"],
  },
  {
    slug: "muhittin",
    name: "Muhittin Mahallesi",
    shortName: "Muhittin",
    heroImage: IMAGES.interior,
    galleryImages: [IMAGES.city, IMAGES.electrician, IMAGES.panel],
    metaTitle: "Muhittin Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Muhittin Mahallesi'nde elektrik arıza, tesisat, pano ve aydınlatma hizmetleri. Şeffaf fiyat, güvenli uygulama.",
    heroTitle: "Muhittin Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Aydınlatmadan tesisata her işte profesyonel destek",
    intro: "Muhittin Mahallesi'nde yaşayan ve iş yapan müşterilerimize elektrik arıza tespiti, tesisat yenileme, modern LED aydınlatma ve pano güvenlik hizmetleri sunuyoruz. İhtiyaca özel çözümler, test edilerek teslim.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Muhittin'de LED aydınlatma dönüşümü yapılıyor mu?", answer: "Evet. Mevcut armatür değişimi, yeni hat çekimi ve spot yerleşim planlaması dahil tam LED dönüşüm hizmeti mevcuttur." },
      { question: "Avize montajı için ne gerekiyor?", answer: "Tavan askı noktasının durumuna göre hazır kancaya montaj veya yeni vida ve yük rayı uygulaması yapılır." },
      { question: "Elektrik faturası neden yüksek olabilir?", answer: "Eski cihazlar, kaçak akım, zayıf yalıtım veya yüksek tüketimli hat yapıları fatura artışına neden olabilir. Ölçümle tespit edilir." },
      { question: "Tesisat kontrol raporu alabilir miyim?", answer: "Yerinde kontrol sonrasında hangi bölümlerin sorunlu olduğuna dair sözlü veya yazılı değerlendirme sunulabilir." },
    ],
    nearbyAreas: ["Alipaşa Mahallesi", "Çorlu Merkez", "Reşadiye Mahallesi"],
  },
  {
    slug: "seyhsinan",
    name: "Şeyhsinan Mahallesi",
    shortName: "Şeyhsinan",
    heroImage: IMAGES.panel,
    galleryImages: [IMAGES.electrician, IMAGES.city, IMAGES.interior],
    metaTitle: "Şeyhsinan Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Şeyhsinan Mahallesi'nde pano yenileme, arıza tespiti ve elektrik tesisat hizmetleri. Güvenli işçilik, net fiyat.",
    heroTitle: "Şeyhsinan Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Pano, tesisat ve arıza çözümlerinde güvenilir destek",
    intro: "Şeyhsinan Mahallesi'ndeki konut ve işyerlerinde elektrik pano yenileme, tesisat kontrolü, arıza tespiti ve güvenlik sistemleri montajı konularında profesyonel hizmet sunuyoruz.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Eski sigorta kutusu yenilenmeli mi?", answer: "10 yılı aşkın panolar mutlaka kontrol edilmeli; eskiyen elemanlar, gevşek bağlantılar güvenlik riski taşır." },
      { question: "Sigorta sürekli atıyorsa ne yapmalıyım?", answer: "İlgili hattı kapatın ve o devreyi yükten ayırın. Tahminle sigortayı değiştirmeyin; kök neden ölçümle tespit edilmeli." },
      { question: "Tek fazlı panoyu üç fazlıya çevirmek mümkün mü?", answer: "Bina girişindeki bağlantı noktası elverişli ise mümkündür. Dağıtım şirketiyle koordineli süreç gerekir." },
      { question: "Pano etiketlemesi ne işe yarar?", answer: "Her sigortanın hangi devreye ait olduğunu gösterir; arıza anında zaman kazandırır ve güvenliği artırır." },
    ],
    nearbyAreas: ["Alipaşa Mahallesi", "Çorlu Merkez", "Kazımiye Mahallesi"],
  },
  {
    slug: "resadiye",
    name: "Reşadiye Mahallesi",
    shortName: "Reşadiye",
    heroImage: IMAGES.city,
    galleryImages: [IMAGES.panel, IMAGES.interior, IMAGES.electrician],
    metaTitle: "Reşadiye Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Reşadiye Mahallesi'nde elektrik arıza tespiti, tesisat ve pano hizmetleri. Hızlı müdahale, güvenli işçilik.",
    heroTitle: "Reşadiye Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Konut ve site elektrik işlerinde hızlı çözüm",
    intro: "Reşadiye Mahallesi'ndeki konut, site ve işyerlerinde elektrik arıza tespiti, tesisat yenileme, priz ve aydınlatma montajı konularında güvenilir ve şeffaf hizmet sunuyoruz.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Site içindeki konutlarda hizmet veriliyor mu?", answer: "Evet. Site yönetiminin gerektirdiği prosedürlere uygun olarak çalışma planlanır." },
      { question: "Priz ısınıyorsa ne yapmalıyım?", answer: "Isınan prizden cihazı çekin ve o priz grubunu sigorta kutusundan kapatın. Isınma bir arıza belirtisidir, kullanmayı sürdürmeyin." },
      { question: "Tesisat bakımı ne sıklıkta yapılmalı?", answer: "Konutlarda her 5-8 yılda bir genel kontrol önerilir. Eski binalarda veya yoğun kullanımda daha sık kontrol gerekebilir." },
      { question: "Tadilat sonrası elektrik hatları uyarlanabilir mi?", answer: "Evet. Mobilya yerleşimi değişikliğine veya yeni oda düzenine göre priz ve aydınlatma noktaları yeniden planlanabilir." },
    ],
    nearbyAreas: ["Muhittin Mahallesi", "Çorlu Merkez", "Nusratiye Mahallesi"],
  },
  {
    slug: "nusratiye",
    name: "Nusratiye Mahallesi",
    shortName: "Nusratiye",
    heroImage: IMAGES.electrician,
    galleryImages: [IMAGES.city, IMAGES.interior, IMAGES.panel],
    metaTitle: "Nusratiye Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Nusratiye Mahallesi'nde elektrik arıza, tesisat, pano ve montaj hizmetleri. Güvenilir ekip, net fiyat.",
    heroTitle: "Nusratiye Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Arızadan tesisata, panoya kadar kapsamlı hizmet",
    intro: "Nusratiye Mahallesi'nde konut, daire ve işyerlerine yönelik elektrik arıza müdahalesi, tesisat yenileme ve güvenlik ekipmanı montajı hizmetleri sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Kaçak akım rölesi neden önemlidir?", answer: "İnsan vücudundan geçebilecek tehlikeli akımı milisaniyeler içinde keserek elektrik çarpmalarını önler. Yeni yapılarda zorunlu, eskilerde önerilir." },
      { question: "Elektrik tesisatı sigorta kapsamında mı?", answer: "Bu sigorta poliçenizin koşullarına bağlıdır. Bazı konut sigortaları yangın kaynaklı elektrik hasarlarını kapsar." },
      { question: "Topraklama ölçümü yaptırmak gerekir mi?", answer: "Özellikle eski binalarda ve elektrikli ev aletlerinin yoğun kullanıldığı yerlerde topraklama ölçümü güvenlik açısından önerilir." },
      { question: "Banyoda güvenli priz montajı yapılabilir mi?", answer: "Evet. Islak hacimlere özel koruma sınıfındaki prizler (IP44 ve üzeri) uygun mesafelere monte edilebilir." },
    ],
    nearbyAreas: ["Reşadiye Mahallesi", "Çorlu Merkez", "Kazımiye Mahallesi"],
  },
  {
    slug: "kazimiye",
    name: "Kazımiye Mahallesi",
    shortName: "Kazımiye",
    heroImage: IMAGES.interior,
    galleryImages: [IMAGES.electrician, IMAGES.panel, IMAGES.city],
    metaTitle: "Kazımiye Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Kazımiye Mahallesi'nde elektrik arıza, LED aydınlatma, pano ve tesisat hizmetleri.",
    heroTitle: "Kazımiye Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Modern aydınlatma ve tesisat çözümleri",
    intro: "Kazımiye Mahallesi'nde aydınlatma tasarımı, LED dönüşüm, priz planlaması ve elektrik arıza müdahalesi konularında kapsamlı hizmet sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "LED dönüşüm enerji tasarrufu sağlar mı?", answer: "Evet. LED ampuller aynı parlaklık için geleneksel flamanlı ampullere göre %70–80 daha az enerji tüketir." },
      { question: "Dimmer (kısım) anahtarı her ampulle çalışır mı?", answer: "Hayır. Dimmer uyumlu LED ampuller ve uygun dimmer anahtarı birlikte seçilmelidir." },
      { question: "Akıllı anahtar veya priz montajı yapıyor musunuz?", answer: "Evet. WiFi veya Zigbee protokollü akıllı cihazların montajı ve kablo düzenlemesi yapılabilmektedir." },
      { question: "Yeni bina tesliminde elektrik kontrolü yaptırmak şart mı?", answer: "Zorunlu olmamakla birlikte kuvvetle önerilir. Özellikle topraklama, kaçak akım ve sigorta kapasitesi kontrol edilmelidir." },
    ],
    nearbyAreas: ["Şeyhsinan Mahallesi", "Nusratiye Mahallesi", "Çorlu Merkez"],
  },
  {
    slug: "kemalettin",
    name: "Kemalettin Mahallesi",
    shortName: "Kemalettin",
    heroImage: IMAGES.panel,
    galleryImages: [IMAGES.city, IMAGES.electrician, IMAGES.interior],
    metaTitle: "Kemalettin Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Kemalettin Mahallesi'nde pano, arıza tespiti ve tesisat elektrik hizmetleri. Güvenli ve hızlı.",
    heroTitle: "Kemalettin Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Pano ve tesisat güvenliğinde uzman destek",
    intro: "Kemalettin Mahallesi'ndeki konut ve işyerlerinde elektrik panosu yenileme, arıza tespiti, tesisat güvenlik kontrolleri ve montaj hizmetleri sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Elektrik panosuna müdahale tehlikeli mi?", answer: "Enerjili panoya dokunmak ciddi risk taşır. Tüm müdahaleler yetkili elektrikçi tarafından güvenli prosedüre uygun yapılmalıdır." },
      { question: "Komşular da aynı arızadan etkilenebilir mi?", answer: "Ortak pano veya giriş kablosu sorunlarında evet. Apartman geneli kontrol gerekebilir." },
      { question: "Gece yarısı elektriğim kesilirse ne yapabilirim?", answer: "Önce apartman panosunu kontrol edin. Sorun dairenizde ise ana sigortayı kapatın, sabah iletişime geçin ya da acil hatta ulaşın." },
      { question: "Kemalettin'de iş yeri tesisatı yapılıyor mu?", answer: "Evet. Küçük ticari birimler ve atölyeler için yük analizi, pano ve hat düzenlemesi hizmeti verilmektedir." },
    ],
    nearbyAreas: ["Çorlu Merkez", "Hürriyet Mahallesi", "Rumeli Mahallesi"],
  },
  {
    slug: "hurriyet",
    name: "Hürriyet Mahallesi",
    shortName: "Hürriyet",
    heroImage: IMAGES.city,
    galleryImages: [IMAGES.interior, IMAGES.panel, IMAGES.electrician],
    metaTitle: "Hürriyet Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Hürriyet Mahallesi'nde elektrik arıza, tesisat ve pano hizmetleri. Aynı gün dönüş.",
    heroTitle: "Hürriyet Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Konut ve işyerleri için hızlı elektrik desteği",
    intro: "Hürriyet Mahallesi'nde konut, site ve küçük işletmelere yönelik elektrik arıza tespiti, tesisat yenileme ve güvenlik montajı hizmetleri verilmektedir.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Hürriyet Mahallesi'nde aynı gün hizmet alabilir miyim?", answer: "Müsaitliğe göre büyük çoğunlukla aynı gün veya ertesi gün ziyaret sağlanmaktadır." },
      { question: "Elektrik tüketimini azaltmak için ne yapılabilir?", answer: "LED dönüşüm, zaman saatli prizler, hareket sensörlü aydınlatma ve yük analizi tüketimi anlamlı ölçüde düşürür." },
      { question: "Çok katlı bir bina için tesisat yenileme planlanabilir mi?", answer: "Evet. Kat kat veya daire daire aşamalı planlama yapılabilir, iş takvimi yönetimle koordineli belirlenir." },
      { question: "Yeni tesisat sonrası garanti veriliyor mu?", answer: "Evet. Tamamlanan tesisat ve montaj işçiliği için garanti kapsamı teklif aşamasında belirtilir." },
    ],
    nearbyAreas: ["Zafer Mahallesi", "Çorlu Merkez", "Kemalettin Mahallesi"],
  },
  {
    slug: "zafer",
    name: "Zafer Mahallesi",
    shortName: "Zafer",
    heroImage: IMAGES.electrician,
    galleryImages: [IMAGES.city, IMAGES.panel, IMAGES.interior],
    metaTitle: "Zafer Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Zafer Mahallesi'nde elektrik arıza tespiti, pano ve tesisat hizmetleri. Güvenilir ve hızlı.",
    heroTitle: "Zafer Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Arızadan tesisata güvenli ve hızlı çözümler",
    intro: "Zafer Mahallesi'nde konut ve işyerlerine yönelik elektrik arıza müdahalesi, tesisat güvenlik kontrolü, pano yenileme ve aydınlatma hizmetleri sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Zafer Mahallesi'nde sigorta arızası için hızlı müdahale sağlanıyor mu?", answer: "Evet. Sigorta atması, kısa devre veya şüpheli durumlarda öncelikli planlama yapılmaktadır." },
      { question: "Mutfak için ayrı elektrik hattı gerekiyor mu?", answer: "Fırın, bulaşık makinesi ve ocak için ayrı devreler enerji güvenliğini artırır ve sigorta sorunlarını önler." },
      { question: "Çocuk korumalı priz nasıl monte edilir?", answer: "Standart priz yerine çocuk korumalı kapak mekanizmalı priz takılır; mevcut montaj noktasına uygulanır." },
      { question: "Topraklama hattı eklenmesi mümkün mü?", answer: "Mevcut tesisat durumuna göre topraklama hattı eklenmesi veya güçlendirilmesi yapılabilir." },
    ],
    nearbyAreas: ["Hürriyet Mahallesi", "Çorlu Merkez", "Rumeli Mahallesi"],
  },
  {
    slug: "rumeli",
    name: "Rumeli Mahallesi",
    shortName: "Rumeli",
    heroImage: IMAGES.interior,
    galleryImages: [IMAGES.city, IMAGES.electrician, IMAGES.panel],
    metaTitle: "Rumeli Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Rumeli Mahallesi'nde elektrik tesisat, arıza ve LED aydınlatma hizmetleri. Profesyonel ekip.",
    heroTitle: "Rumeli Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Konut aydınlatma ve tesisat çözümleri",
    intro: "Rumeli Mahallesi'ndeki konut ve apartmanlarda aydınlatma dönüşümü, tesisat yenileme ve elektrik arıza müdahalesi için profesyonel hizmet sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Salon LED aydınlatma tasarımı yapılıyor mu?", answer: "Evet. Spot yerleşimi, şerit LED entegrasyonu ve dimmer planlaması dahil aydınlatma düzenlemesi yapılabilir." },
      { question: "Tavan lambası olmayan odaya spot nasıl eklenir?", answer: "Alçıpan veya sıva üstü kablo kanalı ile spot montajı yapılabilir; mevcut koşullara göre kapsam belirlenir." },
      { question: "Dış cephe ve bahçe aydınlatması montajı yapılıyor mu?", answer: "Evet. Su geçirmez armatür ve hareket sensörü dahil dış mekan aydınlatma montajı hizmeti verilmektedir." },
      { question: "Rumeli'de site güvenlik kamerası elektrik bağlantısı yapılıyor mu?", answer: "Evet. Kamera, kapı zili ve interkom sistemlerine güç hattı çekilmesi hizmeti kapsamındadır." },
    ],
    nearbyAreas: ["Zafer Mahallesi", "Kemalettin Mahallesi", "Önerler Mahallesi"],
  },
  {
    slug: "onerler",
    name: "Önerler Mahallesi",
    shortName: "Önerler",
    heroImage: IMAGES.panel,
    galleryImages: [IMAGES.electrician, IMAGES.interior, IMAGES.city],
    metaTitle: "Önerler Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Önerler Mahallesi'nde pano, tesisat ve elektrik arıza hizmetleri. Hızlı yanıt, güvenli uygulama.",
    heroTitle: "Önerler Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Güvenlik odaklı elektrik hizmetleri",
    intro: "Önerler Mahallesi'nde konut ve işyerlerine yönelik elektrik panosu, tesisat ve arıza hizmetleri sunulmaktadır. Her işte güvenlik önce gelir.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Kaçak akım dedektörü ile topraklama aynı şey midir?", answer: "Hayır. Kaçak akım rölesi (RCD) ve topraklama hattı birbirini tamamlayan farklı güvenlik sistemleridir." },
      { question: "Yeni taşınan bir evde ilk ne kontrol edilmeli?", answer: "Pano durumu, topraklama varlığı, kaçak akım rölesi ve görünür hasar kontrol edilmelidir. Genel ölçüm de önerilir." },
      { question: "Elektrik panosunda nem oluşuyorsa ne yapmalıyım?", answer: "Pano kapağını kapatın, uzmana haber verin. Nem elektrik ekipmanlarını bozar ve yangın riski taşır." },
      { question: "Önerler'de inşaat elektriği hizmeti veriliyor mu?", answer: "Evet. Yapı aşamasında şantiye elektriği, pano kurulumu ve geçici hat çekimi hizmetleri mevcuttur." },
    ],
    nearbyAreas: ["Rumeli Mahallesi", "Seymen Mahallesi", "Türkgücü Mahallesi"],
  },
  {
    slug: "seymen",
    name: "Seymen Mahallesi",
    shortName: "Seymen",
    heroImage: IMAGES.city,
    galleryImages: [IMAGES.panel, IMAGES.electrician, IMAGES.interior],
    metaTitle: "Seymen Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Seymen Mahallesi'nde elektrik arıza, tesisat ve pano hizmetleri. Net fiyat, güvenli işçilik.",
    heroTitle: "Seymen Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Konut elektriğinde güvenilir ve hızlı destek",
    intro: "Seymen Mahallesi'nde konut ve işyerlerinde elektrik arızası, tesisat güvenlik kontrolleri ve montaj hizmetleri sunulmaktadır. Şeffaf teklif, test edilerek teslim.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Seymen'de müstakil evler için elektrik hizmeti veriliyor mu?", answer: "Evet. Müstakil ev ve villa tesisatı, pano yenileme ve topraklama hizmetleri mevcuttur." },
      { question: "Bahçe sulama pompası için ayrı hat gerekiyor mu?", answer: "Pompa gücüne göre genellikle ayrı devre önerilir. Aynı sigorta grubunda aşırı yük riski oluşabilir." },
      { question: "Elektrik sayacı değişimi kimin sorumluluğunda?", answer: "Sayaç dağıtım şirketinin mülküdür; değişim talebi şirkete yapılır. Sayaç sonrası iç tesisat sizin sorumluluğunuzdadır." },
      { question: "Kırsal/yarı kırsal alanda tesisat farkı var mı?", answer: "Zemin ölçümleri ve topraklama uygulamaları farklılık gösterebilir. Yerinde değerlendirme yapılır." },
    ],
    nearbyAreas: ["Önerler Mahallesi", "Türkgücü Mahallesi", "Çorlu Merkez"],
  },
  {
    slug: "turkgucu",
    name: "Türkgücü Mahallesi",
    shortName: "Türkgücü",
    heroImage: IMAGES.electrician,
    galleryImages: [IMAGES.interior, IMAGES.city, IMAGES.panel],
    metaTitle: "Türkgücü Mahallesi Elektrikçi | Çorlu",
    metaDescription: "Türkgücü Mahallesi'nde elektrik arıza, pano ve tesisat hizmetleri. Güvenilir ve hızlı.",
    heroTitle: "Türkgücü Mahallesi'nde Elektrikçi Hizmeti",
    heroSubtitle: "Her ölçekte elektrik projesinde profesyonel destek",
    intro: "Türkgücü Mahallesi'nde konut, site ve küçük sanayi birimleri için elektrik arıza müdahalesi, tesisat ve pano hizmetleri sunulmaktadır.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Küçük işletmem için trifaze bağlantı yapılabilir mi?", answer: "Abonelik ve bina altyapısı uygun ise üç fazlı hat ve pano düzenlemesi yapılabilir." },
      { question: "Güneş paneli (solar) sistemi için elektrik altyapısı hazırlanıyor mu?", answer: "Evet. İnverter bağlantısı, sayaç öncesi veya sonrası hat düzenlemesi için teknik destek verilmektedir." },
      { question: "İş yerimde elektrik kesintileri sık yaşanıyorsa?", answer: "Aşırı yük, gevşek bağlantı veya yetersiz pano kapasitesi olabilir. Yerinde yük analizi yapılması önerilir." },
      { question: "UPS veya jeneratör bağlantısı yapıyor musunuz?", answer: "Evet. UPS ve jeneratör devreye alma hattı, bypass paneli ve topraklama bağlantısı hizmeti verilmektedir." },
    ],
    nearbyAreas: ["Seymen Mahallesi", "Önerler Mahallesi", "Ergene"],
  },
  {
    slug: "ergene",
    name: "Ergene",
    shortName: "Ergene",
    heroImage: IMAGES.panel,
    galleryImages: [IMAGES.city, IMAGES.interior, IMAGES.electrician],
    metaTitle: "Ergene Elektrikçi | Elektrik Arıza ve Tesisat",
    metaDescription: "Ergene'de elektrik arıza tespiti, tesisat yenileme, pano ve montaj hizmetleri. Güvenilir, hızlı.",
    heroTitle: "Ergene'de Elektrikçi Hizmeti",
    heroSubtitle: "Konut ve sanayi elektriğinde profesyonel destek",
    intro: "Ergene'de konut, işyeri ve sanayi birimleri için elektrik arıza müdahalesi, tesisat, pano yenileme ve montaj hizmetleri sunulmaktadır. Hem bireysel hem kurumsal taleplere uygun çözümler.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Ergene'de sanayi tesisi elektriği yapılıyor mu?", answer: "Evet. Fabrika, depo ve atölyeler için pano, trifaze hat ve güvenlik ekipmanı hizmetleri mevcuttur." },
      { question: "Yüksek gerilim hatlarına müdahale yapılıyor mu?", answer: "Hayır. Orta ve yüksek gerilim altyapısı dağıtım şirketinin sorumluluğundadır. Alçak gerilim tüketici tarafı hizmeti verilir." },
      { question: "Ergene'de sıfır bina elektriği yapılıyor mu?", answer: "Evet. Şantiye elektriğinden nihai konut tesisatına kadar tüm aşamalar için hizmet verilmektedir." },
      { question: "Periyodik bakım sözleşmesi yapılabiliyor mu?", answer: "Evet. İşletmeler için periyodik kontrol ve bakım planlaması talebe göre düzenlenebilir." },
    ],
    nearbyAreas: ["Türkgücü Mahallesi", "Çerkezköy", "Çorlu Merkez"],
  },
  {
    slug: "cerkezkoy",
    name: "Çerkezköy",
    shortName: "Çerkezköy",
    heroImage: IMAGES.city,
    galleryImages: [IMAGES.electrician, IMAGES.panel, IMAGES.interior],
    metaTitle: "Çerkezköy Elektrikçi | Arıza, Tesisat ve Pano",
    metaDescription: "Çerkezköy'de elektrik arıza tespiti, tesisat, pano yenileme ve montaj hizmetleri. Güvenilir ekip.",
    heroTitle: "Çerkezköy'de Elektrikçi Hizmeti",
    heroSubtitle: "Konut ve işyerlerinde tam kapsamlı elektrik desteği",
    intro: "Çerkezköy'deki konut, işyeri ve sanayi birimlerine yönelik elektrik arıza tespiti, tesisat yenileme, pano düzenlemesi ve montaj hizmetleri sunulmaktadır. Hızlı yanıt, şeffaf fiyat.",
    features: commonFeatures,
    services: commonServices,
    faqs: [
      { question: "Çerkezköy'de acil elektrik desteği alınabiliyor mu?", answer: "Evet. Acil arıza ve güvenlik riski taşıyan durumlar için öncelikli planlama yapılmaktadır." },
      { question: "Çerkezköy'de inşaat elektriği hizmeti var mı?", answer: "Evet. Şantiye geçici panosu, topraklama ve kat tesisatı hizmetleri verilmektedir." },
      { question: "Çerkezköy'den Çorlu'ya mı gelinmesi gerekiyor?", answer: "Hayır. Çerkezköy içinde doğrudan hizmet planlanabilmektedir." },
      { question: "İş yeri taşımasında elektrik yeniden düzenlenmesi yapılıyor mu?", answer: "Evet. Yeni iş yeri alanında priz konumları, aydınlatma ve pano düzenlemesi yeniden planlanabilir." },
    ],
    nearbyAreas: ["Ergene", "Türkgücü Mahallesi", "Çorlu Merkez"],
  },
];

type NeighborhoodSeed = {
  slug: string;
  name: string;
  shortName: string;
  focus: string;
  nearbyAreas: string[];
};

const imageSets = [
  { heroImage: IMAGES.city, galleryImages: [IMAGES.electrician, IMAGES.interior, IMAGES.panel] },
  { heroImage: IMAGES.electrician, galleryImages: [IMAGES.city, IMAGES.panel, IMAGES.interior] },
  { heroImage: IMAGES.interior, galleryImages: [IMAGES.panel, IMAGES.city, IMAGES.electrician] },
  { heroImage: IMAGES.panel, galleryImages: [IMAGES.electrician, IMAGES.interior, IMAGES.city] },
];

const additionalNeighborhoodSeeds: NeighborhoodSeed[] = [
  {
    slug: "cemaliye",
    name: "Cemaliye Mahallesi",
    shortName: "Cemaliye",
    focus: "apartman, konut ve küçük işletmelerde arıza tespiti, priz yenileme ve pano düzenleme",
    nearbyAreas: ["Reşadiye Mahallesi", "Muhittin Mahallesi", "Çorlu Merkez"],
  },
  {
    slug: "cumhuriyet",
    name: "Cumhuriyet Mahallesi",
    shortName: "Cumhuriyet",
    focus: "konut tesisatı, aydınlatma montajı ve kaçak akım güvenlik kontrolleri",
    nearbyAreas: ["Alipaşa Mahallesi", "Çorlu Merkez", "Esentepe Mahallesi"],
  },
  {
    slug: "cobancesme",
    name: "Çobançeşme Mahallesi",
    shortName: "Çobançeşme",
    focus: "site, apartman ve iş yerlerinde elektrik arıza, pano ve tesisat yenileme",
    nearbyAreas: ["Esentepe Mahallesi", "Havuzlar Mahallesi", "Hürriyet Mahallesi"],
  },
  {
    slug: "deregunduzlu",
    name: "Deregündüzlü Mahallesi",
    shortName: "Deregündüzlü",
    focus: "müstakil yapı, bahçe hattı, topraklama ve güvenli pano bağlantıları",
    nearbyAreas: ["Sarılar Mahallesi", "Maksutlu Mahallesi", "Seymen Mahallesi"],
  },
  {
    slug: "esentepe",
    name: "Esentepe Mahallesi",
    shortName: "Esentepe",
    focus: "yoğun konut alanlarında priz, aydınlatma, pano ve arıza müdahalesi",
    nearbyAreas: ["Çobançeşme Mahallesi", "Havuzlar Mahallesi", "Cumhuriyet Mahallesi"],
  },
  {
    slug: "hatip",
    name: "Hatip Mahallesi",
    shortName: "Hatip",
    focus: "konut ve yeni yerleşim alanlarında tesisat kontrolü, pano ve aydınlatma işleri",
    nearbyAreas: ["Hıdırağa Mahallesi", "Silahtarağa Mahallesi", "Nusratiye Mahallesi"],
  },
  {
    slug: "havuzlar",
    name: "Havuzlar Mahallesi",
    shortName: "Havuzlar",
    focus: "apartman, site ve ticari alanlarda elektrik arıza, LED aydınlatma ve güvenlik kontrolleri",
    nearbyAreas: ["Esentepe Mahallesi", "Çobançeşme Mahallesi", "Hürriyet Mahallesi"],
  },
  {
    slug: "hidiraga",
    name: "Hıdırağa Mahallesi",
    shortName: "Hıdırağa",
    focus: "eski tesisat kontrolü, topraklama, kaçak akım rölesi ve güvenli onarım",
    nearbyAreas: ["Hatip Mahallesi", "Nusratiye Mahallesi", "Reşadiye Mahallesi"],
  },
  {
    slug: "maksutlu",
    name: "Maksutlu Mahallesi",
    shortName: "Maksutlu",
    focus: "müstakil konut, dış mekan aydınlatma, bahçe hattı ve pano güvenliği",
    nearbyAreas: ["Deregündüzlü Mahallesi", "Sarılar Mahallesi", "Şahpaz Mahallesi"],
  },
  {
    slug: "sarilar",
    name: "Sarılar Mahallesi",
    shortName: "Sarılar",
    focus: "kırsal ve müstakil yapılarda elektrik arıza, topraklama ve hat yenileme",
    nearbyAreas: ["Deregündüzlü Mahallesi", "Maksutlu Mahallesi", "Yenice Mahallesi"],
  },
  {
    slug: "sahpaz",
    name: "Şahpaz Mahallesi",
    shortName: "Şahpaz",
    focus: "müstakil yapı, küçük işletme ve tarımsal alanlarda güvenli elektrik çözümleri",
    nearbyAreas: ["Maksutlu Mahallesi", "Yenice Mahallesi", "Seymen Mahallesi"],
  },
  {
    slug: "silahtaraga",
    name: "Silahtarağa Mahallesi",
    shortName: "Silahtarağa",
    focus: "konut ve iş yerlerinde elektrik arıza tespiti, pano yenileme ve montaj işleri",
    nearbyAreas: ["Hatip Mahallesi", "Nusratiye Mahallesi", "Şeyhsinan Mahallesi"],
  },
  {
    slug: "yenice",
    name: "Yenice Mahallesi",
    shortName: "Yenice",
    focus: "yeni yapı, müstakil konut ve tadilat projelerinde tesisat ve pano uygulamaları",
    nearbyAreas: ["Sarılar Mahallesi", "Şahpaz Mahallesi", "Seymen Mahallesi"],
  },
];

const additionalNeighborhoods: ServiceArea[] = additionalNeighborhoodSeeds.map((area, index) => {
  const images = imageSets[index % imageSets.length];

  return {
    slug: area.slug,
    name: area.name,
    shortName: area.shortName,
    heroImage: images.heroImage,
    galleryImages: images.galleryImages,
    metaTitle: `${area.name} Elektrikçi | Çorlu Arıza ve Tesisat`,
    metaDescription: `${area.name}'nde elektrik arıza tespiti, tesisat, pano, priz ve aydınlatma hizmetleri. Çorlu yerel elektrikçi, güvenli işçilik ve net teklif.`,
    heroTitle: `${area.name}'nde Elektrikçi Hizmeti`,
    heroSubtitle: "Arıza, tesisat, pano ve montaj işlerinde yerel destek",
    intro: `${area.name}'nde ${area.focus} için planlı ve güvenli elektrik hizmeti sunulmaktadır. Talep alınırken arıza belirtisi, bina tipi ve aciliyet durumu netleştirilir; işlem sonunda hat, pano veya montaj noktası test edilerek teslim edilir.`,
    features: commonFeatures,
    services: commonServices,
    faqs: [
      {
        question: `${area.shortName}'de elektrik arızası için aynı gün destek alınabilir mi?`,
        answer: `Müsaitlik ve arızanın aciliyetine göre ${area.shortName}'de aynı gün veya en yakın uygun zaman için planlama yapılır.`,
      },
      {
        question: `${area.shortName}'de eski tesisat kontrolü yapılıyor mu?`,
        answer: "Evet. Pano, sigorta, kaçak akım rölesi, priz-topraklama bağlantıları ve görünür kablo riskleri kontrol edilerek ihtiyaçlar netleştirilir.",
      },
      {
        question: "Küçük priz veya avize montajı için keşif gerekir mi?",
        answer: "Basit montaj işlerinde fotoğrafla ön değerlendirme yapılabilir. Yeni hat, pano veya kapsamlı tesisat işlerinde yerinde kontrol daha sağlıklıdır.",
      },
      {
        question: "İşçilik ve malzeme fiyatı nasıl belirlenir?",
        answer: "Arızanın kaynağı, kullanılacak malzeme, hat uzunluğu ve çalışma kapsamı görüldükten sonra net teklif paylaşılır.",
      },
    ],
    nearbyAreas: area.nearbyAreas,
  };
});

export const serviceAreas: ServiceArea[] = [...primaryServiceAreas, ...additionalNeighborhoods];

export function getAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug);
}
