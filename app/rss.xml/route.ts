import { companyConfig } from "@/data/site";
import { getPublishedBlogPosts } from "@/lib/db";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const result = await getPublishedBlogPosts();
  const items = result.posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${companyConfig.siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${companyConfig.siteUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt ?? "")}</description>
      <pubDate>${new Date(post.published_at ?? post.created_at).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(companyConfig.name)} Blog</title>
    <link>${companyConfig.siteUrl}/blog</link>
    <description>Elektrik hizmetleri blog yazilari</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${companyConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.trim()}
  </channel>
</rss>`.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
