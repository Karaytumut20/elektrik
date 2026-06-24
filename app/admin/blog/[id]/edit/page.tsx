import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogForm } from "@/components/admin/BlogForm";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog Yazisi Duzenle",
  description: "Blog yazisi duzenleme.",
  path: "/admin/blog/edit",
  noIndex: true,
});

export default async function EditBlogPostPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image_url, status, published_at, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const post = data as BlogPost;

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-950">Blog yazisini duzenle</h1>
        <p className="mt-2 text-slate-600">{post.title}</p>
      </div>
      <BlogForm post={post} />
    </AdminShell>
  );
}
