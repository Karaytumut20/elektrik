const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const companyConfig = {
  name: "İnallar Elektrik",
  legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME ?? "İnallar Elektrik ve Mühendislik Hizmetleri",
  siteUrl: configuredSiteUrl ?? "https://corluelektrikcim.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+90 542 470 42 15",
  whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "905424704215",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "inallarelektrik@gmail.com",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "Çorlu, Tekirdağ",
  city: "Çorlu",
  region: "Tekirdağ",
  country: "TR",
  workingHours: "Pazartesi - Cumartesi: 08:00 - 19:00",
  emergencyHours: "Acil arıza talepleri için aynı gün dönüş",
  taxInfoPlaceholder: "Vergi ve ticaret sicil bilgileri firma tarafından eklenecek.",
};

export const mainNavigation = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Bölgeler", href: "/bolge" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export const serviceAreas = [
  "Çorlu Merkez",
  "Alipaşa Mahallesi",
  "Cemaliye Mahallesi",
  "Cumhuriyet Mahallesi",
  "Çobançeşme Mahallesi",
  "Deregündüzlü Mahallesi",
  "Esentepe Mahallesi",
  "Hatip Mahallesi",
  "Havuzlar Mahallesi",
  "Hıdırağa Mahallesi",
  "Muhittin Mahallesi",
  "Şeyhsinan Mahallesi",
  "Reşadiye Mahallesi",
  "Nusratiye Mahallesi",
  "Kazımiye Mahallesi",
  "Kemalettin Mahallesi",
  "Hürriyet Mahallesi",
  "Maksutlu Mahallesi",
  "Sarılar Mahallesi",
  "Şahpaz Mahallesi",
  "Silahtarağa Mahallesi",
  "Zafer Mahallesi",
  "Rumeli Mahallesi",
  "Önerler Mahallesi",
  "Seymen Mahallesi",
  "Türkgücü Mahallesi",
  "Yenice Mahallesi",
  "Ergene",
  "Çerkezköy",
  "Yeniçiftlik",
  "Marmara Ereğlisi",
  "Veliköy",
];

export const trustSignals = [
  "Çorlu ve yakın çevrede hızlı dönüş",
  "Net keşif ve teklif",
  "Düzenli kablolama ve etiketleme",
  "Teslim sonrası güvenlik kontrolü",
];

export const urgentSymptoms = [
  "Sigorta sürekli atıyor",
  "Priz veya anahtar ısınıyor",
  "Yanık kokusu geliyor",
  "Bir odada elektrik yok",
  "Kaçak akım rölesi düşüyor",
  "Pano içinden ses geliyor",
];

export const localSearchTerms = [
  "Çorlu elektrikçi",
  "Çorlu acil elektrikçi",
  "Çorlu elektrik arıza",
  "Çorlu elektrik tesisatı",
  "Çorlu pano yenileme",
  "Çorlu avize montajı",
  "Yeniçiftlik elektrikçi",
  "Marmara Ereğlisi elektrikçi",
  "Veliköy elektrikçi",
  "Tekirdağ Çorlu elektrikçi",
  "Çorlu elektrik ustası",
  "Çorlu kaçak akım rölesi",
  "Çorlu topraklama",
  "Çorlu LED aydınlatma",
  "Çorlu priz montajı",
  "Çorlu yangın alarm güvenlik kamera sistemleri",
  "Çorlu elektrik bakım onarım",
];
