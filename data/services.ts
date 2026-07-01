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
  image: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  operations: string[];
  benefits: string[];
  process: string[];
  faqs: ServiceFaq[];
};

const commonProcess = [
  "Talebin ve arıza belirtisinin netleştirilmesi",
  "Yerinde kontrol veya fotoğrafa göre ön değerlendirme",
  "Malzeme ve işçilik kapsamıyla şeffaf teklif",
  "Güvenli uygulama ve devreye alma testi",
];

export const services: ElectricalService[] = [
  {
    slug: "elektrik-ariza-tespiti",
    title: "Elektrik Arıza Tespiti",
    shortDescription:
      "Sigorta atması, kısa devre, prizde enerji olmaması ve hat kopukluğu gibi arızalar için sistemli kontrol.",
    detailDescription:
      "Elektrik arızalarında tahminle ilerlemek hem zaman kaybettirir hem de tesisata zarar verebilir. Hat, sigorta, klemens, priz, aydınlatma ve pano kontrollerini sırasıyla yaparak sorunun kaynağını netleştiriyoruz.",
    image: "/images/service-troubleshooting.webp",
    icon: Zap,
    operations: [
      "Hat ve sigorta kontrolü",
      "Kısa devre ve kaçağa yönelik ölçüm",
      "Priz, anahtar ve buat kontrolleri",
      "Arızalı bölümün güvenli şekilde izole edilmesi",
    ],
    benefits: [
      "Kök neden odaklı onarım",
      "Gereksiz kırım ve malzeme değişiminden kaçınma",
      "Aynı arızanın tekrar etme riskini azaltma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Arıza tespiti için elektrik tamamen kesilir mi?",
        answer:
          "Gerekli durumlarda ilgili hat güvenli şekilde kesilir. Tüm alanın enerjisiz kalması gerekiyorsa işleme başlamadan önce bilgilendirme yapılır.",
      },
      {
        question: "Kısa devre tespiti ne kadar sürer?",
        answer:
          "Süre tesisatın karmaşıklığına bağlıdır. Basit priz ve sigorta arızaları genellikle aynı ziyarette netleştirilebilir.",
      },
      {
        question: "Hangi arıza tespit cihazlarını kullanıyorsunuz?",
        answer:
          "Kablo kopuklukları ve temassızlıkları tespit etmek için dijital kaçak akım test cihazları, multimetreler ve temassız voltaj dedektörleri kullanıyoruz.",
      },
      {
        question: "Evdeki arızanın komşularla bir ilgisi olabilir mi?",
        answer:
          "Bazen apartman ana panosundaki faz kesintileri veya nötr gevşemeleri dairenizi etkileyebilir. Bu durumda bina ana hattını da kontrol ediyoruz.",
      },
      {
        question: "Arıza tespiti sonrasında garanti veriyor musunuz?",
        answer:
          "Yapılan onarım ve montaj işçiliğimiz ile değiştirdiğimiz parçalar için garanti sunuyoruz. Herhangi bir sorunda bize tekrar ulaşabilirsiniz.",
      },
    ],
  },
  {
    slug: "ev-elektrik-tesisati",
    title: "Ev Elektrik Tesisatı",
    shortDescription:
      "Daire, villa and tadilat projeleri için güvenli, düzenli ve ihtiyaca uygun elektrik tesisatı kurulumu.",
    detailDescription:
      "Konutlarda elektrik tesisatı; güvenlik, kullanım konforu ve ileride yapılacak değişiklikler düşünülerek planlanmalıdır. Priz, aydınlatma, mutfak hatları ve zayıf akım geçişlerini proje ihtiyacına göre düzenliyoruz.",
    image: "/images/service-wiring.webp",
    icon: Cable,
    operations: [
      "Priz ve aydınlatma hatlarının planlanması",
      "Mutfak ve yüksek güç hatlarının ayrılması",
      "Buat, kablo and sigorta organizasyonu",
      "Test ve etiketleme",
    ],
    benefits: [
      "Daha güvenli günlük kullanım",
      "Yüksek güç tüketen cihazlar için uygun hat yapısı",
      "Tadilat sonrası temiz ve okunabilir tesisat",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Eski ver tesisatı yenilenirken duvarlar kırılır mı?",
        answer:
          "Mevcut altyapıya göre değişir. Mümkün olan yerlerde mevcut borular kullanılır, gerekli kısımlar için önceden kapsam paylaşılır.",
      },
      {
        question: "Malzeme seçimini siz mi yapıyorsunuz?",
        answer:
          "İhtiyaca uygun kablo, sigorta ve ekipman önerisi sunulur. Marka ve kalite tercihi teklif aşamasında netleştirilir.",
      },
      {
        question: "Komple daire tesisat yenilemesi kaç gün sürer?",
        answer:
          "Dairenin büyüklüğüne ve kırım yapılacak kanal miktarına bağlı olarak komple kablo ve kasa yenileme işlemleri 3 ila 5 iş günü arasında tamamlanır.",
      },
      {
        question: "Tesisatta hangi kablo markalarını ve kesitlerini tercih ediyorsunuz?",
        answer:
          "Priz hatlarında en az 2.5 mm², aydınlatma hatlarında ise 1.5 mm² kesitinde, TSE onaylı halojensiz (alev iletmeyen) bakır kablolar kullanıyoruz.",
      },
      {
        question: "Mutfak tesisatı için özel bir güç hattı çekilmeli midir?",
        answer:
          "Evet. Fırın, bulaşık makinesi ve mikrodalga gibi yüksek akım çeken cihazlar için sigorta panosundan bağımsız, ayrı priz hatları çekilmelidir.",
      },
    ],
  },
  {
    slug: "is-yeri-elektrik-tesisati",
    title: "İş Yeri Elektrik Tesisatı",
    shortDescription:
      "Ofis, mağaza, atölye ve küçük işletmeler için iş akışına uygun elektrik altyapısı.",
    detailDescription:
      "İş yerlerinde tesisat sadece enerji dağıtımı değil, iş sürekliliği meselesidir. Cihaz yerleşimi, aydınlatma ihtiyacı, pano kapasitesi ve bakım erişimi birlikte değerlendirilir.",
    image: "/images/service-office-wiring.webp",
    icon: Gauge,
    operations: [
      "Yük analizi ve hat ayrımı",
      "Pano ve sigorta düzeni",
      "Çalışma alanlarına uygun priz planlaması",
      "Aydınlatma ve acil durum hatları",
    ],
    benefits: [
      "İş kesintisi riskini azaltan altyapı",
      "Bakımı kolay pano ve hat organizasyonu",
      "Çalışan konforunu artıran aydınlatma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "İş yeri çalışırken tadilat yapılabilir mi?",
        answer:
          "Uygun iş planında bölgesel çalışma yapılabilir. Enerji kesintisi gerektiren adımlar önceden programlanır.",
      },
      {
        question: "Yeni cihazlar için ek hat çekiyor musunuz?",
        answer:
          "Evet. Cihazın gücü ve kullanım koşullarına göre ayrı hat ve sigorta planlanabilir.",
      },
      {
        question: "Ofislerde kablo kanalları ve zemin priz sistemleri kuruyor musunuz?",
        answer:
          "Evet. Masalara elektrik, internet ve telefon hatlarını taşımak için zemin altı buatlar, süpürgelik kanalları ve modern masaüstü priz blokları kuruyoruz.",
      },
      {
        question: "İş yerlerinde üç fazlı (trifaze) sistem kurulumu yapıyor musunuz?",
        answer:
          "Evet. Yüksek güçlü makineler, endüstriyel fırınlar veya klimalar için trifaze pano dağıtımı ve hat çekim işlemlerini gerçekleştiriyoruz.",
      },
      {
        question: "İş yerinde elektrik kaynaklı arızalar için periyodik bakım yapıyor musunuz?",
        answer:
          "Evet. Gevşek bağlantıların ve aşırı ısınmaların önlenmesi için periyodik pano sıkma, kaçak akım testi ve yük analiz hizmetleri sunmaktayız.",
      },
    ],
  },
  {
    slug: "sigorta-ve-elektrik-panosu-yenileme",
    title: "Sigorta ve Elektrik Panosu Yenileme",
    shortDescription:
      "Eski, karışık veya yetersiz panoları güvenli, etiketli ve bakımı kolay hale getirme.",
    detailDescription:
      "Elektrik panosu tesisatın kalbidir. Eskiyen sigortalar, zayıf klemensler ve karışık hatlar arıza riskini artırır. Pano yenilemede hatlar kontrol edilir, koruma elemanları ihtiyaca göre düzenlenir.",
    image: "/images/service-panel.webp",
    icon: ShieldCheck,
    operations: [
      "Mevcut pano ve hat incelemesi",
      "Sigorta and kaçak akım düzenlemesi",
      "Klemens, etiket ve kablo düzeni",
      "Devreye alma ve yük kontrolü",
    ],
    benefits: [
      "Arıza takibini kolaylaştıran etiketleme",
      "Daha güvenli koruma yapısı",
      "Gelecek eklemelere uygun pano düzeni",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Pano yenileme aynı gün biter mi?",
        answer:
          "Küçük ve orta ölçekli panolarda genellikle aynı gün tamamlanabilir. Kapsam keşifte netleştirilir.",
      },
      {
        question: "Pano değişiminde elektrik kesintisi olur mu?",
        answer:
          "Evet, güvenli çalışma için kesinti gerekir. Kesinti süresi iş başlamadan önce paylaşılır.",
      },
      {
        question: "Eski sigorta kutusu neden cızırdayarak ses yapar?",
        answer:
          "Sigorta girişlerindeki gevşek vidalar ark oluşturur ve ısınmaya neden olur. Bu ses ciddi bir yangın uyarısıdır ve sigortanın veya baranın acilen yenilenmesini gerektirir.",
      },
      {
        question: "Hangi sigorta markalarını kullanıyorsunuz?",
        answer:
          "Siemens, Schneider veya Legrand gibi global olarak kendini kanıtlamış, yüksek kesme kapasitesine sahip kaliteli sigorta markalarını tercih ediyoruz.",
      },
      {
        question: "Sigorta değerleri neye göre belirlenir?",
        answer:
          "Hattın kablo kalınlığına göre belirlenir. Örneğin 2.5 mm² priz hattı için genellikle en fazla 16A sigorta kullanarak kablonun aşırı ısınıp yanmasını önlüyoruz.",
      },
    ],
  },
  {
    slug: "kacak-akim-rolesi-montaji",
    title: "Kaçak Akım Rölesi Montajı",
    shortDescription:
      "Can güvenliği için uygun değerde kaçak akım rölesi seçimi, montajı ve test edilmesi.",
    detailDescription:
      "Kaçak akım rölesi, tesisatta oluşabilecek kaçak akım durumlarında devreyi keserek can güvenliğini destekler. Doğru ürün seçimi ve düzenli test, sistemin verimli çalışması için önemlidir.",
    image: "/images/service-rcd.webp",
    icon: BadgeCheck,
    operations: [
      "Pano uygunluk kontrolü",
      "Röle seçimi ve montajı",
      "Test butonu ve ölçüm kontrolü",
      "Kullanım bilgilendirmesi",
    ],
    benefits: [
      "Can güvenliğine katkı",
      "Nemli alanlarda ek koruma",
      "Elektrik tesisatı risklerini azaltma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Kaçak akım rölesi sürekli atarsa ne yapılmalı?",
        answer:
          "Bu durum genellikle tesisatta kaçak, nem veya arızalı cihaz belirtisidir. Röle iptal edilmeden önce kaynak tespit edilmelidir.",
      },
      {
        question: "Her eve kaçak akım rölesi gerekir mi?",
        answer:
          "Modern ve güvenli tesisatlarda uygun koruma elemanları bulunmalıdır. Mevcut pano kontrol edilerek ihtiyaç netleştirilir.",
      },
      {
        question: "Kaçak akım rölesi neden durduk yere atar?",
        answer:
          "Genelde prizlere su kaçması, kettle/şofben rezistans arızaları veya nötr-toprak kablolarının birbiriyle temas etmesi kaçak akım rölesini tetikler.",
      },
      {
        question: "30mA ve 300mA kaçak akım röleleri arasındaki fark nedir?",
        answer:
          "30mA olan röle insan hayatını koruma amaçlıdır ve evlerde zorunludur. 300mA olan ise yangın koruma amaçlıdır ve ana bina girişlerinde kullanılır.",
      },
      {
        question: "Kaçak akım rölesinin sağlam olduğunu nasıl test edebilirim?",
        answer:
          "Röle üzerindeki 'Test' (T) butonuna basarak mekanizmayı kontrol edebilirsiniz. Butona basıldığında röle anında mandalını aşağı atmalıdır.",
      },
    ],
  },
  {
    slug: "priz-ve-anahtar-montaji",
    title: "Priz ve Anahtar Montajı",
    shortDescription:
      "Yeni priz, anahtar, dimmer ve yer değişimi işlemlerinde temiz ve güvenli montaj.",
    detailDescription:
      "Gevşek prizler, ısınma yapan anahtarlar ve yetersiz priz sayısı günlük kullanımda hem konforsuz hem risklidir. Hat uygunluğu kontrol edilerek düzenli montaj yapılır.",
    image: "/images/service-socket.webp",
    icon: Plug,
    operations: [
      "Hat uygunluk kontrolü",
      "Priz ve anahtar montajı",
      "Gevşek buat ve klemens düzeltme",
      "Topraklama kontrolü",
    ],
    benefits: [
      "Daha temiz görünüm",
      "Gevşek temas ve ısınma riskini azaltma",
      "Kullanım ihtiyacına göre doğru konumlandırma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Priz yeri değiştirilebilir mi?",
        answer:
          "Mevcut hat ve duvar yapısına göre değiştirilebilir. En temiz uygulama yolu yerinde belirlenir.",
      },
      {
        question: "Topraklamasiz prize cihaz takmak güvenli mi?",
        answer:
          "Topraklama gerektiren cihazlarda uygun değildir. Hat ve topraklama kontrolü yapılmalıdır.",
      },
      {
        question: "Gevşek veya yerinden çıkan prizler nasıl tamir edilir?",
        answer:
          "Priz kasasının tırnakları gevşemiş veya duvar kasası kırılmış olabilir. Güvenli montaj aparatları veya yeni bir sıva altı kasa yerleştirilerek priz duvara sabitlenir.",
      },
      {
        question: "USB girişli veya çocuk korumalı priz montajı yapıyor musunuz?",
        answer:
          "Evet. Akıllı telefonlar için doğrudan duvar prizinden şarj imkanı sunan USB'li prizler ve çocukların güvenliği için koruma kapaklı prizler monte ediyoruz.",
      },
      {
        question: "Prizden kıvılcım çıkması veya kararma yapması ne anlama gelir?",
        answer:
          "Priz içindeki metal tırnakların gevşediğini ve fişle tam temas kuramadığını gösterir. Ark oluştuğu için elektrik yangını riski taşır, prizin hemen değişmesi gerekir.",
      },
    ],
  },
  {
    slug: "aydinlatma-sistemleri",
    title: "Aydınlatma Sistemleri",
    shortDescription:
      "Ev, ofis, mağaza ve dış mekanlar için amaca uygun aydınlatma planlama ve montaj.",
    detailDescription:
      "Doğru aydınlatma, mekanın konforunu ve işlevini doğrudan etkiler. Genel, bölgesel ve vurgu aydınlatmaları birlikte planlanarak dengeli bir sonuç hedeflenir.",
    image: "/images/service-lighting.webp",
    icon: Lightbulb,
    operations: [
      "Aydınlatma ihtiyaç analizi",
      "Armatür ve hat planlaması",
      "Montaj ve yön ayarı",
      "Enerji verimliliği kontrolü",
    ],
    benefits: [
      "Daha konforlu mekan kullanımı",
      "Enerji tüketimini düşüren seçimler",
      "Profesyonel ve temiz görünüm",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Mağaza aydınlatması için yardımcı oluyor musunuz?",
        answer:
          "Evet. Ürün, kasa, vitrin ve genel alanlar için farklı aydınlatma ihtiyaçları birlikte planlanır.",
      },
      {
        question: "LED donusumu yapılıyor mu?",
        answer:
          "Evet. Mevcut armatürler ve hat uygunluğu kontrol edilerek LED dönüşümü uygulanabilir.",
      },
      {
        question: "Sensörlü (hareket dedektörlü) aydınlatma kurulumu yapıyor musunuz?",
        answer:
          "Evet. Bina girişleri, koridorlar ve otoparklar gibi alanlar için enerji tasarrufu sağlayan hareket sensörlü armatörlerin montajını yapıyoruz.",
      },
      {
        question: "Aydınlatma hatlarında dimmer (ışık ayarlı anahtar) kullanılabilir mi?",
        answer:
          "Kullanılan ampulün 'dimlenebilir' (dimmable) özellikte olması şartıyla evet. Uygun dimmer anahtarı ve ampul eşleştirmesini yapıyoruz.",
      },
      {
        question: "Bahçe veya dış mekan aydınlatmasında nelere dikkat edilmelidir?",
        answer:
          "Dış mekan armatürlerinin neme ve toza karşı en az IP65 koruma sınıfında olması, kabloların yeraltı tipi zırhlı kablo olması gerekir.",
      },
    ],
  },
  {
    slug: "led-aydinlatma-uygulamalari",
    title: "LED Aydınlatma Uygulamaları",
    shortDescription:
      "Şerit LED, spot, panel LED ve dekoratif LED çözümleri için uygun sürücü ve hat uygulaması.",
    detailDescription:
      "LED uygulamalarında doğru sürücü, kablo kesiti ve soğutma koşulları uzun ömür için kritik rol oynar. Dekoratif görünümü teknik güvenlikle birlikte ele alıyoruz.",
    image: "/images/service-led.webp",
    icon: LampCeiling,
    operations: [
      "LED tipi ve güç hesabı",
      "Sürücü ve hat planlama",
      "Montaj, lehim ve bağlantı kontrolleri",
      "Işık şiddeti ve renk tonu ayarı",
    ],
    benefits: [
      "Daha düşük enerji tüketimi",
      "Mekana uygun atmosfer",
      "Uzun ömürlü ve düzenli montaj",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Şerit LED neden titreme yapar?",
        answer:
          "Uygun olmayan sürücü, zayıf bağlantı veya hat uzunluğu titremeye neden olabilir. Sistem birlikte kontrol edilmelidir.",
      },
      {
        question: "Dış mekan LED uygulaması yapılıyor mu?",
        answer:
          "Evet. Dış mekanda IP koruma sınıfı, nem ve kablo geçişleri özellikle dikkate alınır.",
      },
      {
        question: "Şerit LED trafosu seçimi nasıl yapılır?",
        answer:
          "Kullanılacak LED şeridinin metre başına çektiği güç (Watt) hesaplanır ve toplam güce en az %20-30 oranında tolerans payı eklenerek uygun trafo amper değeri seçilir.",
      },
      {
        question: "Gizli ışık (alçıpan havuz) LED montajı nasıl yapılır?",
        answer:
          "Alçıpan kanalların içine alüminyum LED profilleri yerleştirilir. Isı dağılımı sağlayan bu profiller LED şeridin ömrünü uzatır ve homojen ışık verir.",
      },
      {
        question: "Tek trafo ile kaç metre şerit LED beslenebilir?",
        answer:
          "Gerilim düşümünü engellemek ve LED'lerin eşit parlaklıkta yanmasını sağlamak için her 5-8 metrede bir trafondan paralel ek besleme hattı çekilmesi önerilir.",
      },
    ],
  },
  {
    slug: "avize-montaji",
    title: "Avize Montajı",
    shortDescription:
      "Avize, aplik ve dekoratif armatürlerin sağlam taşıyıcıyla güvenli şekilde montajı.",
    detailDescription:
      "Avize montajında sadece kablo bağlantısı değil, tavan yapısı ve taşıyıcı güvenliği de önemlidir. Montaj öncesi hat ve askı noktası kontrol edilir.",
    image: "/images/service-chandelier.webp",
    icon: Hammer,
    operations: [
      "Tavan ve askı noktası kontrolü",
      "Elektrik bağlantısı",
      "Sağlam montaj ve denge ayarı",
      "Çalışma testi",
    ],
    benefits: [
      "Güvenli taşıma",
      "Temiz bağlantı ve düzenli görünüm",
      "Uygun ampul ve güç kullanımı",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Ağır avize montajı yapılıyor mu?",
        answer:
          "Tavan yapısı uygun ise evet. Gerekirse ek taşıyıcı çözüm önerilir.",
      },
      {
        question: "Eski avize sökümü dahil mi?",
        answer:
          "Talebe göre eski armatür sökümü ve yeni avize montajı birlikte yapılabilir.",
      },
      {
        question: "Tavanda kanca veya askı aparatı yoksa ne yapıyorsunuz?",
        answer:
          "Tavan betonuna çelik dübel çakarak avizeyi güvenli bir şekilde taşıyacak sağlam askı halkası veya montaj sacı oluşturuyoruz.",
      },
      {
        question: "Kumandalı veya çok kademeli avize montajı yapıyor musunuz?",
        answer:
          "Evet. Alıcısı bulunan, uzaktan kumandalı veya anahtardan kademeli olarak farklı ışık modları sunan modern avizelerin bağlantılarını yapıyoruz.",
      },
      {
        question: "Asma tavan veya alçıpan tavanlara avize monte edilebilir mi?",
        answer:
          "Hafif avizeler özel alçıpan dübelleriyle monte edilebilir ancak ağır avizeler için asma tavanın arkasındaki beton tavana kadar uzanan tij askı sistemleri kurulmalıdır.",
      },
    ],
  },
  {
    slug: "topraklama-sistemleri",
    title: "Topraklama Sistemleri",
    shortDescription:
      "Konut ve iş yerlerinde topraklama kontrolü, iyileştirme ve bağlantı düzenleme.",
    detailDescription:
      "Topraklama, elektrik tesisatında güvenli kullanım için temel koruma katmanıdır. Mevcut sistem kontrol edilir, uygunsuzluklar belirlenir ve iyileştirme önerisi sunulur.",
    image: "/images/service-earthing.webp",
    icon: Wrench,
    operations: [
      "Topraklama hattı kontrolü",
      "Pano ve priz bağlantı incelemesi",
      "İyileştirme ve bağlantı düzenlemesi",
      "Son kontrol ve bilgilendirme",
    ],
    benefits: [
      "Elektrikli cihazlarda daha güvenli kullanım",
      "Kaçak akım korumasıyla uyum",
      "Tesisat sağlığını netleştirme",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Topraklama yoksa nasıl anlaşılır?",
        answer:
          "Priz ve pano kontrolleriyle hattı izlemek gerekir. Sadece priz görünümüne bakarak kesin karar verilmelidir.",
      },
      {
        question: "Topraklama raporu veriliyor mu?",
        answer:
          "Resmi rapor ihtiyacı varsa yetkili ölçüm ve raporlama kapsamı ayrıca netleştirilmelidir.",
      },
      {
        question: "Evlerde topraklama hattı neden önemlidir?",
        answer:
          "Çamaşır makinesi, bulaşık makinesi ve kombi gibi metal gövdeli cihazlarda elektrik kaçağı oluştuğunda enerjiyi toprağa ileterek çarpılmayı önler.",
      },
      {
        question: "Topraklama ölçümü nasıl yapılır?",
        answer:
          "Dijital topraklama megeri (ölçüm cihazı) kullanarak topraklama direnci (ohm) ölçülür. Evlerde bu değerin 2 ohm sınırının altında olması istenir.",
      },
      {
        question: "Sıfırlama nedir ve neden tehlikelidir?",
        answer:
          "Sıfırlama, prizde toprak klemensi ile nötr klemensinin birleştirilmesidir. Nötr hattında kopukluk olduğunda cihazın dış gövdesine doğrudan elektrik vererek ölümcül risk yaratır. Kesinlikle yapılmamalıdır.",
      },
    ],
  },
  {
    slug: "insaat-elektrik-tesisati",
    title: "İnşaat Elektrik Tesisatı",
    shortDescription:
      "Yeni yapılar ve tadilatlar için proje akışına uygun kaba ve ince elektrik işleri.",
    detailDescription:
      "İnşaat elektrik tesisatında zamanlama, diğer disiplinlerle koordinasyon ve okunabilir uygulama önemlidir. Kaba tesisattan son armatür montajına kadar kontrollü ilerlenir.",
    image: "/images/service-construction.webp",
    icon: Construction,
    operations: [
      "Kaba tesisat borulama ve hat çekimi",
      "Pano, priz ve anahtar altyapısı",
      "Aydınlatma ve zayıf akım geçişleri",
      "Son montaj ve devreye alma",
    ],
    benefits: [
      "Diğer ekiplerle uyumlu iş programı",
      "Gelecekte bakımı kolay hat yapisi",
      "Temiz ve düzenli teslim",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Mimari plana göre çalışıyor musunuz?",
        answer:
          "Evet. Mimari plan, kullanım senaryosu ve saha koşulları birlikte değerlendirilir.",
      },
      {
        question: "Malzeme listesi hazırlanır mı?",
        answer:
          "Keşif ve proje kapsamından sonra uygulanacak malzemeler teklif içinde netleştirilir.",
      },
      {
        question: "İnşaat elektrik aşamaları nelerdir?",
        answer:
          "İlk aşamada beton dökülürken borulama yapılır. İkinci aşamada sıva altı borular ve kasalar yerleştirilir. Üçüncü aşamada kablolar çekilir ve son aşamada anahtar, priz, pano montajları tamamlanır.",
      },
      {
        question: "Zayıf akım (TV, internet, telefon) kablolamasını da yapıyor musunuz?",
        answer:
          "Evet. Yeni binalarda fiber internet uyumlu CAT6 kablo çekimi, merkezi uydu TV kablolaması ve görüntülü diyafon hatlarının kurulumunu gerçekleştiriyoruz.",
      },
      {
        question: "İnşaat elektrik işlerinde hangi güvenlik standartlarına uyulur?",
        answer:
          "İş güvenliği kurallarına ek olarak, kabloların renk standartlarına (Faz: Kahve/Siyah, Nötr: Mavi, Toprak: Sarı-Yeşil) ve yalıtım mesafelerine tam uyulmaktadır.",
      },
    ],
  },
  {
    slug: "acil-elektrikci-hizmeti",
    title: "Acil Elektrikçi Hizmeti",
    shortDescription:
      "Sigorta atması, yanık kokusu, priz ısınması ve ani elektrik kesintileri için hızlı destek.",
    detailDescription:
      "Acil elektrik arızalarında ilk hedef güvenliği sağlamak ve riski büyütmemektir. Belirtiyle göre ön bilgilendirme yapılır, yerinde kontrolle güvenli çözüm uygulanır.",
    image: "/images/service-emergency.webp",
    icon: Siren,
    operations: [
      "Acil risk değerlendirmesi",
      "Enerjinin güvenli şekilde kontrolü",
      "Arıza kaynağının tespiti",
      "Geçici veya kalici güvenli çözüm",
    ],
    benefits: [
      "Riskli arızalara hızlı yaklaşım",
      "Güvenlik odaklı müdahale",
      "Sorun büyümeden kontrol altına alma",
    ],
    process: commonProcess,
    faqs: [
      {
        question: "Yanık kokusu varsa ne yapılmalı?",
        answer:
          "İlgili sigortayı kapatın, cihazı kullanmayın ve profesyonel destek alın. Koku kaynağı bulunmadan tekrar enerji vermeyin.",
      },
      {
        question: "Acil destek her bölgeye veriliyor mu?",
        answer:
          "Çorlu merkez mahalleleri ve yakın çevredeki talepler telefon veya WhatsApp üzerinden hızlıca değerlendirilir. Adres ve arıza belirtisi paylaşıldığında uygunluk netleşir.",
      },
      {
        question: "Kombi veya şofben arızalandığında acil elektrikçi çağrılmalı mıdır?",
        answer:
          "Eğer arıza elektriksel bağlantılardan veya sigortadan kaynaklanıyorsa evet. Kombinin kendi iç kartı veya mekanik arızası varsa servis çağrılmalıdır.",
      },
      {
        question: "Sigorta attıktan sonra kaldırınca tekrar atıyorsa ne yapılmalıdır?",
        answer:
          "Hattaki cihazları prizden çekin ve tekrar deneyin. Hala atıyorsa tesisatta kısa devre veya kablo erimesi vardır. Zorlamadan acil servisimizi aramalısınız.",
      },
      {
        question: "Elektrik çarpması durumunda ilk olarak ne yapılmalıdır?",
        answer:
          "Kazazedeye dokunmadan önce hemen ana sigortayı kapatarak elektriği kesin. Sigortaya ulaşılamıyorsa yalıtkan bir cisimle kişiyi kablodan ayırın ve 112'yi arayın.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
