import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, readingTime, renderPlainContent } from "@/components/blog/BlogGrid";
import { articleSchema } from "@/data/schemas";
import { getPublishedBlogPostBySlug } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
      <article>
        {/* ── Hero Section ── */}
        <section className="relative bg-electric-navy text-white overflow-hidden">
          {/* Background image */}
          {post.cover_image_url ? (
            <>
              <div className="absolute inset-0">
                <Image
                  src={post.cover_image_url}
                  alt={`${post.title} kapak görseli`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-25"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-electric-navy/80 via-electric-navy/70 to-electric-navy" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1e3a5f_0%,_#102033_60%)]" />
          )}

          <div className="site-container relative py-12 pb-16">
            <div className="text-slate-300 [&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-slate-500">
              <Breadcrumbs
                items={[
                  { label: "Blog", href: "/blog" },
                  { label: post.title, href: `/blog/${post.slug}` },
                ]}
              />
            </div>

            {/* Meta badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-yellow/30 bg-electric-yellow/10 px-3 py-1 text-xs font-semibold text-electric-yellow">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{post.excerpt}</p>
            ) : null}
          </div>
        </section>

        {/* ── Cover image (if present) — large cinematic banner below hero ── */}
        {post.cover_image_url ? (
          <div className="site-container -mt-2 pb-2">
            <div className="relative h-[320px] overflow-hidden rounded-2xl border border-slate-200 shadow-xl md:h-[420px]">
              <Image
                src={post.cover_image_url}
                alt={`${post.title} kapak görseli`}
                fill
                sizes="(min-width: 1180px) 1180px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>
        ) : null}

        {/* ── Article body ── */}
        <section className="section-band bg-electric-mist">
          <div className="site-container">
            <div className="mx-auto max-w-3xl">
              {/* Article card */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm md:p-10">
                <div className="grid gap-6 text-base leading-8 text-slate-700">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="leading-8">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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
