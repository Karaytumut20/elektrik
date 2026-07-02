import { companyConfig } from "@/data/site";
import { serviceAreas } from "@/data/areas";
import { services } from "@/data/services";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${companyConfig.name}`,
    "",
    "Çorlu ve yakın çevrede elektrik arıza, acil elektrikçi, tesisat, pano, aydınlatma, avize ve montaj hizmetleri veren yerel elektrik firması web sitesi.",
    "",
    "## Sayfalar",
    `- [Ana Sayfa](${companyConfig.siteUrl}/)`,
    `- [Hizmetler](${companyConfig.siteUrl}/hizmetler)`,
    `- [Hizmet Bölgeleri](${companyConfig.siteUrl}/bolge)`,
    `- [Hakkımızda](${companyConfig.siteUrl}/hakkimizda)`,
    `- [Blog](${companyConfig.siteUrl}/blog)`,
    `- [İletişim](${companyConfig.siteUrl}/iletisim)`,
    "",
    "## Hizmetler",
    ...services.map((service) => `- [${service.title}](${companyConfig.siteUrl}/hizmetler/${service.slug})`),
    "",
    "## Hizmet Bölgeleri",
    ...serviceAreas.map((area) => `- [${area.name}](${companyConfig.siteUrl}/bolge/${area.slug})`),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
