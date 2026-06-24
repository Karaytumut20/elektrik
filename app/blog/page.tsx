import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blogEmptyState } from "@/data/blog";
import { getPublishedBlogPosts } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Elektrik Blog",
  description: "Elektrik arizalari, tesisat bakimi, pano guvenligi ve aydinlatma hakkinda rehber yazilar.",
  path: "/blog",
});

export default async function BlogPage() {
  const result = await getPublishedBlogPosts();

  return (
    <>
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
          <SectionHeading
            eyebrow="Blog"
            title="Elektrik tesisati ve guvenli kullanim rehberleri"
            description="Yayinlanan blog yazilari Supabase blog_posts tablosundan okunur; taslak yazilar burada listelenmez."
            className="mb-0 mt-8"
            as="h1"
          />
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          {result.error ? <p className="mb-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{result.error}</p> : null}
          {result.posts.length > 0 ? (
            <BlogGrid posts={result.posts} />
          ) : (
            <Card>
              <h2 className="text-xl font-bold text-slate-950">{blogEmptyState.title}</h2>
              <p className="mt-2 text-slate-600">{result.isConfigured ? blogEmptyState.description : "Supabase baglantisi yapildiktan sonra yayinlanan yazilar burada gorunecek."}</p>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
