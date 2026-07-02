import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, readingTime, renderPlainContent } from "@/components/blog/BlogGrid";
import { articleSchema } from "@/data/schemas";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const result = await getPublishedBlogPosts();
  return result.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? "Elektrik hizmetleri hakkında blog yazısı.",
    path: `/blog/${post.slug}`,
    image: post.cover_image_url ?? undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = renderPlainContent(post.content);
  const dateStr = formatDate(post.published_at ?? post.created_at);
  const readTime = readingTime(post.content);

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <article className="overflow-x-hidden">
        {/* HERO SECTION — Clean and focused on the article info */}
        <section className="relative bg-electric-navy text-white py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e3a5f_0%,_#102033_70%)] opacity-80" />
          <div className="site-container relative">
            <div className="text-slate-300 [&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-slate-500">
              <Breadcrumbs
                items={[
                  { label: "Blog", href: "/blog" },
                  { label: post.title, href: `/blog/${post.slug}` },
                ]}
              />
            </div>

            {/* Meta info */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-3 py-1 text-xs font-semibold text-electric-yellow">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-2xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
              {post.title}
            </h1>
          </div>
        </section>

        {/* Cinematic banner (if cover image present) */}
        {post.cover_image_url ? (
          <div className="site-container -mt-6 pb-2 relative z-10">
            <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950/20 shadow-lg">
              <img
                src={post.cover_image_url}
                alt={`${post.title} kapak görseli`}
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
                loading="eager"
              />
            </div>
          </div>
        ) : null}

        {/* Clean, centered article content */}
        <section className="section-band bg-electric-mist">
          <div className="site-container">
            <div className="mx-auto max-w-3xl">
              {/* Main content wrapper with word-wrap prevention */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-5 text-base leading-7 text-slate-700 break-words overflow-hidden">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="leading-7 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Simple Back to Blog Link */}
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tüm yazılara dön
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
