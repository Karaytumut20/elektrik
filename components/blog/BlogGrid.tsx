import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { Card } from "@/components/ui/Card";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden p-0">
          {post.cover_image_url ? (
            <div className="relative h-48 bg-slate-200">
              <Image src={post.cover_image_url} alt={`${post.title} kapak gorseli`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
            </div>
          ) : null}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">{formatDate(post.published_at ?? post.created_at)}</p>
            <h2 className="mt-3 text-xl font-bold leading-snug text-slate-950">{post.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt ?? "Elektrik hizmetleri hakkinda bilgilendirici rehber."}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-electric-blue">
              Devamini oku
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
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
