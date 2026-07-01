import type { MetadataRoute } from "next";
import { companyConfig } from "@/data/site";
import { services } from "@/data/services";
import { serviceAreas } from "@/data/areas";
import { getPublishedBlogPosts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/hizmetler", "/hakkimizda", "/blog", "/iletisim", "/bolge", "/gizlilik-politikasi", "/cerez-politikasi", "/kvkk"];
  const servicePages = services.map((service) => `/hizmetler/${service.slug}`);
  const areaPages = serviceAreas.map((area) => `/bolge/${area.slug}`);
  const blogResult = await getPublishedBlogPosts();
  const blogPages = blogResult.posts.map((post) => `/blog/${post.slug}`);

  return [...staticPages, ...servicePages, ...areaPages, ...blogPages].map((path) => ({
    url: `${companyConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path.startsWith("/hizmetler") || path.startsWith("/bolge") ? "weekly" : path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/hizmetler" || path === "/bolge" ? 0.9 : path.startsWith("/hizmetler/") ? 0.85 : path.startsWith("/bolge/") ? 0.8 : path === "/iletisim" ? 0.8 : 0.7,
  }));
}
