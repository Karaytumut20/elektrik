import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { blogEmptyState } from "@/data/blog";
import { getPublishedBlogPosts } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Çorlu Elektrik Blog",
  description: "Çorlu elektrik arızaları, tesisat bakımı, pano güvenliği, kaçak akım, priz ve aydınlatma hakkında pratik rehber yazılar.",
  path: "/blog",
});

export default async function BlogPage() {
  const result = await getPublishedBlogPosts();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-electric-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e3a5f_0%,_#102033_70%)]" />

        <div className="site-container relative py-12">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

          <div className="mt-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-electric-yellow/20 ring-1 ring-electric-yellow/30">
              <BookOpen className="h-6 w-6 text-electric-yellow" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-electric-yellow">
                Rehber & Bilgi
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-white md:text-4xl">
                Elektrik Tesisatı ve Güvenlik Rehberleri
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Çorlu&apos;da konut ve iş yerleri için elektrik arızası, tesisat bakımı, pano
                güvenliği ve aydınlatma konularında pratik bilgiler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog grid ── */}
      <section className="section-band bg-electric-mist">
        <div className="site-container">
          {result.error ? (
            <p className="mb-4 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
              {result.error}
            </p>
          ) : null}
          {result.posts.length > 0 ? (
            <BlogGrid posts={result.posts} />
          ) : (
            <Card>
              <h2 className="text-xl font-bold text-slate-950">{blogEmptyState.title}</h2>
              <p className="mt-2 text-slate-600">
                {result.isConfigured
                  ? blogEmptyState.description
                  : "İlk rehber yazılar hazırlandığında burada yayınlanacak."}
              </p>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
