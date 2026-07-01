import Image from "next/image";
import { notFound } from "next/navigation";
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

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <article>
        <section className="bg-white py-10">
          <div className="site-container">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
            />
            <p className="mt-8 text-sm font-semibold uppercase text-electric-blue">
              {formatDate(post.published_at ?? post.created_at)} · {readingTime(post.content)}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">{post.title}</h1>
            {post.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p> : null}
          </div>
        </section>

        {post.cover_image_url ? (
          <div className="site-container py-6">
            <div className="relative h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
              <Image src={post.cover_image_url} alt={`${post.title} kapak görseli`} fill sizes="100vw" className="object-cover" />
            </div>
          </div>
        ) : null}

        <section className="section-band bg-electric-mist">
          <div className="site-container">
            <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="grid gap-5 text-base leading-8 text-slate-700">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
