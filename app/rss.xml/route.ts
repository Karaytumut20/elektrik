import { companyConfig } from "@/data/site";
import { getPublishedBlogPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

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
          <guid>${companyConfig.siteUrl}/blog/${post.slug}</guid>
          <description>${escapeXml(post.excerpt ?? "")}</description>
          <pubDate>${new Date(post.published_at ?? post.created_at).toUTCString()}</pubDate>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(companyConfig.name)} Blog</title>
        <link>${companyConfig.siteUrl}/blog</link>
        <description>Elektrik hizmetleri blog yazilari</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
