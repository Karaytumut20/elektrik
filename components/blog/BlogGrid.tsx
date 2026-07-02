import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/data/blog";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} featured={index === 0} />
      ))}
    </div>
  );
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const dateStr = formatDate(post.published_at ?? post.created_at);
  const readTime = readingTime(post.content);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${featured ? "md:col-span-2 lg:col-span-1" : ""}`}
    >
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`${post.title} yazısını oku`}
        className="relative block h-52 w-full overflow-hidden bg-gradient-to-br from-electric-navy to-electric-coal flex-shrink-0"
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={`${post.title} kapak görseli`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-electric-yellow opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Meta */}
        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {dateStr}
          </span>
          <span className="h-3 w-px bg-slate-300" />
          <span className="flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-bold leading-snug text-slate-950 group-hover:text-electric-blue transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 line-clamp-3">
          {post.excerpt ?? "Elektrik hizmetleri hakkında bilgilendirici rehber yazısı."}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-electric-blue transition-all group-hover:gap-3"
        >
          Devamını oku
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} dk okuma`;
}

export function renderPlainContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
