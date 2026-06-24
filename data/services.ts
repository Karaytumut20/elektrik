import {
  BadgeCheck,
  Cable,
  Construction,
  Gauge,
  Hammer,
  LampCeiling,
  Lightbulb,
  Plug,
  ShieldCheck,
  Siren,
  Wrench,
  Zap,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ElectricalService = {
  slug: string;
  title: string;
  shortDescription: string;
  detailDescription: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  operations: string[];
  benefits: string[];
  process: string[];
  faqs: ServiceFaq[];
};

const commonProcess = [
  "Talebin ve ariza belirtisinin netlestirilmesi",
  "Yerinde kontrol veya fotografa gore on degerlendirme",
  "Malzeme ve iscilik kapsamiyla seffaf teklif",
  "Guvenli uygulama ve devreye alma testi",
];

export const services: ElectricalService[] = [
  {
    slug: "elektrik-ariza-tespiti",
    title: "Elektrik Ariza Tespiti",
    shortDescription:
      "Sigorta atmasi, kisa devre, prizde enerji olmamasi ve hat kopuklugu gibi arizalar icin sistemli kontrol.",
    detailDescription:
      "Elektrik arizalarinda tahminle ilerlemek hem zaman kaybettirir hem de tesisata zarar verebilir. Hat, sigorta, klemens, priz, aydinlatma ve pano kontrollerini sirasiyla yaparak sorunun kaynagini netlestiriyoruz.",
    icon: Zap,
    operations: [
      "Hat ve sigorta kontrolu",
      "Kisa devre ve kacaga yonelik olcum",
      "Priz, anahtar ve buat kontrolleri",
      "Arizali bolumun guvenli sekilde izole edilmesi",
    ],
    benefits: [
      "Kok neden odakli onarim",
      "Gereksiz kırım ve malzeme degisiminden kacinma",
      "Ayni arizanin tekrar etme riskini azaltma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Ariza tespiti icin elektrik tamamen kesilir mi?",
        answer:
          "Gerekli durumlarda ilgili hat guvenli sekilde kesilir. Tum alanin enerjisiz kalmasi gerekiyorsa isleme baslamadan once bilgilendirme yapilir.",
      },
      {
        question: "Kisa devre tespiti ne kadar surer?",
        answer:
          "Sure tesisatin karmasikligina baglidir. Basit priz ve sigorta arizalari genellikle ayni ziyarette netlestirilebilir.",
      },
    ],
  },
  {
    slug: "ev-elektrik-tesisati",
    title: "Ev Elektrik Tesisati",
    shortDescription:
      "Daire, villa ve tadilat projeleri icin guvenli, duzenli ve ihtiyaca uygun elektrik tesisati kurulumu.",
    detailDescription:
      "Konutlarda elektrik tesisati; guvenlik, kullanim konforu ve ileride yapilacak degisiklikler dusunulerek planlanmalidir. Priz, aydinlatma, mutfak hatlari ve zayif akim gecislerini proje ihtiyacina gore duzenliyoruz.",
    icon: Cable,
    operations: [
      "Priz ve aydinlatma hatlarinin planlanmasi",
      "Mutfak ve yuksek guc hatlarinin ayrilmasi",
      "Buat, kablo ve sigorta organizasyonu",
      "Test ve etiketleme",
    ],
    benefits: [
      "Daha guvenli gunluk kullanim",
      "Yuksek guc tuketen cihazlar icin uygun hat yapisi",
      "Tadilat sonrasi temiz ve okunabilir tesisat",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Eski ev tesisati yenilenirken duvarlar kirilir mi?",
        answer:
          "Mevcut altyapiya gore degisir. Mumkun olan yerlerde mevcut borular kullanilir, gerekli kısımlar icin onceden kapsam paylasilir.",
      },
      {
        question: "Malzeme secimini siz mi yapiyorsunuz?",
        answer:
          "Ihtiyaca uygun kablo, sigorta ve ekipman onerisi sunulur. Marka ve kalite tercihi teklif asamasinda netlestirilir.",
      },
    ],
  },
  {
    slug: "is-yeri-elektrik-tesisati",
    title: "Is Yeri Elektrik Tesisati",
    shortDescription:
      "Ofis, magaza, atölye ve kucuk isletmeler icin is akisina uygun elektrik altyapisi.",
    detailDescription:
      "Is yerlerinde tesisat sadece enerji dagitimi degil, is surekliligi meselesidir. Cihaz yerlesimi, aydinlatma ihtiyaci, pano kapasitesi ve bakim erisimi birlikte degerlendirilir.",
    icon: Gauge,
    operations: [
      "Yuk analizi ve hat ayrimi",
      "Pano ve sigorta duzeni",
      "Calisma alanlarina uygun priz planlamasi",
      "Aydinlatma ve acil durum hatlari",
    ],
    benefits: [
      "Is kesintisi riskini azaltan altyapi",
      "Bakimi kolay pano ve hat organizasyonu",
      "Calisan konforunu artiran aydinlatma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Is yeri calisirken tadilat yapilabilir mi?",
        answer:
          "Uygun is planinda bolgesel calisma yapilabilir. Enerji kesintisi gerektiren adimlar onceden programlanir.",
      },
      {
        question: "Yeni cihazlar icin ek hat cekiyor musunuz?",
        answer:
          "Evet. Cihazin gucu ve kullanim kosullarina gore ayri hat ve sigorta planlanabilir.",
      },
    ],
  },
  {
    slug: "sigorta-ve-elektrik-panosu-yenileme",
    title: "Sigorta ve Elektrik Panosu Yenileme",
    shortDescription:
      "Eski, karisik veya yetersiz panolari guvenli, etiketli ve bakimi kolay hale getirme.",
    detailDescription:
      "Elektrik panosu tesisatin kalbidir. Eskiyen sigortalar, zayif klemensler ve karisik hatlar ariza riskini artirir. Pano yenilemede hatlar kontrol edilir, koruma elemanlari ihtiyaca gore duzenlenir.",
    icon: ShieldCheck,
    operations: [
      "Mevcut pano ve hat incelemesi",
      "Sigorta ve kacak akim duzenlemesi",
      "Klemens, etiket ve kablo duzeni",
      "Devreye alma ve yuk kontrolu",
    ],
    benefits: [
      "Ariza takibini kolaylastiran etiketleme",
      "Daha guvenli koruma yapisi",
      "Gelecek eklemelere uygun pano duzeni",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Pano yenileme ayni gun biter mi?",
        answer:
          "Kucuk ve orta olcekli panolarda genellikle ayni gun tamamlanabilir. Kapsam kesifte netlestirilir.",
      },
      {
        question: "Pano degisiminde elektrik kesintisi olur mu?",
        answer:
          "Evet, guvenli calisma icin kesinti gerekir. Kesinti suresi is baslamadan once paylasilir.",
      },
    ],
  },
  {
    slug: "kacak-akim-rolesi-montaji",
    title: "Kacak Akim Rolesi Montaji",
    shortDescription:
      "Can guvenligi icin uygun degerde kacak akim rolesi secimi, montaji ve test edilmesi.",
    detailDescription:
      "Kacak akim rolesi, tesisatta olusabilecek kacak akim durumlarinda devreyi keserek can guvenligini destekler. Dogru urun secimi ve duzenli test, sistemin verimli calismasi icin onemlidir.",
    icon: BadgeCheck,
    operations: [
      "Pano uygunluk kontrolu",
      "Role secimi ve montaji",
      "Test butonu ve olcum kontrolu",
      "Kullanim bilgilendirmesi",
    ],
    benefits: [
      "Can guvenligine katkı",
      "Nemli alanlarda ek koruma",
      "Elektrik tesisati risklerini azaltma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Kacak akim rolesi surekli atarsa ne yapilmali?",
        answer:
          "Bu durum genellikle tesisatta kacak, nem veya arizali cihaz belirtisidir. Role iptal edilmeden once kaynak tespit edilmelidir.",
      },
      {
        question: "Her eve kacac akim rolesi gerekir mi?",
        answer:
          "Modern ve guvenli tesisatlarda uygun koruma elemanlari bulunmalidir. Mevcut pano kontrol edilerek ihtiyac netlestirilir.",
      },
    ],
  },
  {
    slug: "priz-ve-anahtar-montaji",
    title: "Priz ve Anahtar Montaji",
    shortDescription:
      "Yeni priz, anahtar, dimmer ve yer degisimi islemlerinde temiz ve guvenli montaj.",
    detailDescription:
      "Gevsek prizler, isinma yapan anahtarlar ve yetersiz priz sayisi gunluk kullanimda hem konforsuz hem risklidir. Hat uygunlugu kontrol edilerek duzenli montaj yapilir.",
    icon: Plug,
    operations: [
      "Hat uygunluk kontrolu",
      "Priz ve anahtar montaji",
      "Gevsek buat ve klemens duzeltme",
      "Topraklama kontrolu",
    ],
    benefits: [
      "Daha temiz gorunum",
      "Gevsek temas ve isinma riskini azaltma",
      "Kullanim ihtiyacina gore dogru konumlandirma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Priz yeri degistirilebilir mi?",
        answer:
          "Mevcut hat ve duvar yapisina gore degistirilebilir. En temiz uygulama yolu yerinde belirlenir.",
      },
      {
        question: "Topraklamasiz prize cihaz takmak guvenli mi?",
        answer:
          "Topraklama gerektiren cihazlarda uygun degildir. Hat ve topraklama kontrolu yapilmalidir.",
      },
    ],
  },
  {
    slug: "aydinlatma-sistemleri",
    title: "Aydinlatma Sistemleri",
    shortDescription:
      "Ev, ofis, magaza ve dis mekanlar icin amaca uygun aydinlatma planlama ve montaj.",
    detailDescription:
      "Dogru aydinlatma, mekanin konforunu ve islevini dogrudan etkiler. Genel, bolgesel ve vurgu aydinlatmalari birlikte planlanarak dengeli bir sonuc hedeflenir.",
    icon: Lightbulb,
    operations: [
      "Aydinlatma ihtiyac analizi",
      "Armatür ve hat planlamasi",
      "Montaj ve yon ayari",
      "Enerji verimliligi kontrolu",
    ],
    benefits: [
      "Daha konforlu mekan kullanimi",
      "Enerji tuketimini dusuren secimler",
      "Profesyonel ve temiz gorunum",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Magaza aydinlatmasi icin yardimci oluyor musunuz?",
        answer:
          "Evet. Urun, kasa, vitrin ve genel alanlar icin farkli aydinlatma ihtiyaclari birlikte planlanir.",
      },
      {
        question: "LED donusumu yapiliyor mu?",
        answer:
          "Evet. Mevcut armatürler ve hat uygunlugu kontrol edilerek LED donusum uygulanabilir.",
      },
    ],
  },
  {
    slug: "led-aydinlatma-uygulamalari",
    title: "LED Aydinlatma Uygulamalari",
    shortDescription:
      "Serit LED, spot, panel LED ve dekoratif LED cozumleri icin uygun surucu ve hat uygulamasi.",
    detailDescription:
      "LED uygulamalarinda dogru surucu, kablo kesiti ve sogutma kosullari uzun omur icin kritik rol oynar. Dekoratif gorunumu teknik guvenlikle birlikte ele aliyoruz.",
    icon: LampCeiling,
    operations: [
      "LED tipi ve guc hesabı",
      "Surucu ve hat planlama",
      "Montaj, lehim ve baglanti kontrolleri",
      "Işık siddeti ve renk tonu ayari",
    ],
    benefits: [
      "Daha dusuk enerji tuketimi",
      "Mekana uygun atmosfer",
      "Uzun omurlu ve duzenli montaj",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Serit LED neden titreme yapar?",
        answer:
          "Uygun olmayan surucu, zayif baglanti veya hat uzunlugu titremeye neden olabilir. Sistem birlikte kontrol edilmelidir.",
      },
      {
        question: "Dis mekan LED uygulamasi yapiliyor mu?",
        answer:
          "Evet. Dis mekanda IP koruma sinifi, nem ve kablo gecisleri ozellikle dikkate alinir.",
      },
    ],
  },
  {
    slug: "avize-montaji",
    title: "Avize Montaji",
    shortDescription:
      "Avize, aplik ve dekoratif armatürlerin saglam tasiyiciyle guvenli sekilde montaji.",
    detailDescription:
      "Avize montajinda sadece kablo baglantisi degil, tavan yapisi ve tasiyici guvenligi de onemlidir. Montaj oncesi hat ve askı noktasi kontrol edilir.",
    icon: Hammer,
    operations: [
      "Tavan ve askı noktasi kontrolu",
      "Elektrik baglantisi",
      "Saglam montaj ve denge ayari",
      "Calisma testi",
    ],
    benefits: [
      "Guvenli tasima",
      "Temiz baglanti ve duzenli gorunum",
      "Uygun ampul ve guc kullanimi",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Agir avize montaji yapiliyor mu?",
        answer:
          "Tavan yapisi uygun ise evet. Gerekirse ek tasiyici cozum onerilir.",
      },
      {
        question: "Eski avize sokumu dahil mi?",
        answer:
          "Talebe gore eski armatür sokumu ve yeni avize montaji birlikte yapilabilir.",
      },
    ],
  },
  {
    slug: "topraklama-sistemleri",
    title: "Topraklama Sistemleri",
    shortDescription:
      "Konut ve is yerlerinde topraklama kontrolu, iyilestirme ve baglanti duzenleme.",
    detailDescription:
      "Topraklama, elektrik tesisatinda guvenli kullanim icin temel koruma katmanidir. Mevcut sistem kontrol edilir, uygunsuzluklar belirlenir ve iyilestirme onerisi sunulur.",
    icon: Wrench,
    operations: [
      "Topraklama hatti kontrolu",
      "Pano ve priz baglanti incelemesi",
      "Iyilestirme ve baglanti duzenlemesi",
      "Son kontrol ve bilgilendirme",
    ],
    benefits: [
      "Elektrikli cihazlarda daha guvenli kullanim",
      "Kacak akim korumasiyla uyum",
      "Tesisat sagligini netlestirme",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Topraklama yoksa nasil anlasilir?",
        answer:
          "Priz ve pano kontrolleriyle hatti izlemek gerekir. Sadece priz gorunumune bakarak kesin karar verilmemelidir.",
      },
      {
        question: "Topraklama raporu veriliyor mu?",
        answer:
          "Resmi rapor ihtiyaci varsa yetkili olcum ve raporlama kapsami ayrica netlestirilmelidir.",
      },
    ],
  },
  {
    slug: "insaat-elektrik-tesisati",
    title: "Insaat Elektrik Tesisati",
    shortDescription:
      "Yeni yapilar ve tadilatlar icin proje akisina uygun kaba ve ince elektrik isleri.",
    detailDescription:
      "Insaat elektrik tesisatinda zamanlama, diger disiplinlerle koordinasyon ve okunabilir uygulama onemlidir. Kaba tesisattan son armatür montajina kadar kontrollu ilerlenir.",
    icon: Construction,
    operations: [
      "Kaba tesisat borulama ve hat cekimi",
      "Pano, priz ve anahtar altyapisi",
      "Aydinlatma ve zayif akim gecisleri",
      "Son montaj ve devreye alma",
    ],
    benefits: [
      "Diger ekiplerle uyumlu is programi",
      "Gelecekte bakimi kolay hat yapisi",
      "Temiz ve duzenli teslim",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Mimari plana gore calisiyor musunuz?",
        answer:
          "Evet. Mimari plan, kullanim senaryosu ve saha kosullari birlikte degerlendirilir.",
      },
      {
        question: "Malzeme listesi hazirlanir mi?",
        answer:
          "Kesif ve proje kapsamindan sonra uygulanacak malzemeler teklif icinde netlestirilir.",
      },
    ],
  },
  {
    slug: "acil-elektrikci-hizmeti",
    title: "Acil Elektrikci Hizmeti",
    shortDescription:
      "Sigorta atmasi, yanik kokusu, priz isinmasi ve ani elektrik kesintileri icin hizli destek.",
    detailDescription:
      "Acil elektrik arizalarinda ilk hedef guvenligi saglamak ve riski buyutmemektir. Belirtiye gore on bilgilendirme yapilir, yerinde kontrolle guvenli cozum uygulanir.",
    icon: Siren,
    operations: [
      "Acil risk degerlendirmesi",
      "Enerjinin guvenli sekilde kontrolu",
      "Ariza kaynaginin tespiti",
      "Gecici veya kalici guvenli cozum",
    ],
    benefits: [
      "Riskli arizalara hizli yaklasim",
      "Guvenlik odakli mudahale",
      "Sorun buyumeden kontrol altina alma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Yanik kokusu varsa ne yapmaliyim?",
        answer:
          "Ilgili sigortayi kapatin, cihazi kullanmayin ve profesyonel destek alin. Koku kaynagi bulunmadan tekrar enerji vermeyin.",
      },
      {
        question: "Acil destek her bolgeye veriliyor mu?",
        answer:
          "Hizmet bolgesi merkezi ayarlardan guncellenmelidir. Uygunluk telefon veya WhatsApp uzerinden hizli netlestirilir.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
