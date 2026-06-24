import type { MetadataRoute } from "next";
import { companyConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${companyConfig.siteUrl}/sitemap.xml`,
  };
}
