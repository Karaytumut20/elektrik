import { companyConfig } from "@/data/site";
import { services } from "@/data/services";

export function GET() {
  const body = [
    `# ${companyConfig.name}`,
    "",
    "Çorlu ve yakın çevrede elektrik arıza, acil elektrikçi, tesisat, pano, aydınlatma, avize ve montaj hizmetleri veren yerel elektrik firması web sitesi.",
    "",
    "## Sayfalar",
    "- /",
    "- /hizmetler",
    "- /hakkimizda",
    "- /blog",
    "- /iletisim",
    "",
    "## Hizmetler",
    ...services.map((service) => `- ${service.title}: /hizmetler/${service.slug}`),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
