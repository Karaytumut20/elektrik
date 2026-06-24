import type { MetadataRoute } from "next";
import { companyConfig } from "@/data/site";
import { services } from "@/data/services";
import { getPublishedBlogPosts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/hizmetler", "/hakkimizda", "/blog", "/iletisim", "/gizlilik-politikasi", "/cerez-politikasi", "/kvkk"];
  const servicePages = services.map((service) => `/hizmetler/${service.slug}`);
  const blogResult = await getPublishedBlogPosts();
  const blogPages = blogResult.posts.map((post) => `/blog/${post.slug}`);

  return [...staticPages, ...servicePages, ...blogPages].map((path) => ({
    url: `${companyConfig.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
