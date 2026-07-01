const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const companyConfig = {
  name: "Çorlu Elektrikçi",
  legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME ?? "Çorlu Elektrikçi Hizmetleri",
  siteUrl: configuredSiteUrl ?? "https://www.corluelektrikci.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+90 5XX XXX XX XX",
  whatsapp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "905XXXXXXXXX",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@corluelektrikci.com",
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
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export const serviceAreas = [
  "Çorlu Merkez",
  "Alipaşa Mahallesi",
  "Muhittin Mahallesi",
  "Şeyhsinan Mahallesi",
  "Reşadiye Mahallesi",
  "Nusratiye Mahallesi",
  "Kazımiye Mahallesi",
  "Kemalettin Mahallesi",
  "Hürriyet Mahallesi",
  "Zafer Mahallesi",
  "Rumeli Mahallesi",
  "Önerler Mahallesi",
  "Seymen Mahallesi",
  "Türkgücü Mahallesi",
  "Ergene",
  "Çerkezköy",
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
];
