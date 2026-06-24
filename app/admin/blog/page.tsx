import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { requireAdmin } from "@/lib/admin/auth";
import { toggleBlogStatus } from "@/lib/admin/blog-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog Yonetimi",
  description: "Admin blog yazilari listesi.",
  path: "/admin/blog",
  noIndex: true,
});

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image_url, status, published_at, created_at, updated_at")
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as BlogPost[];

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Blog yazilari</h1>
          <p className="mt-2 text-slate-600">Yayin, taslak, duzenleme ve silme islemleri.</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary">
          <Plus className="h-4 w-4" />
          Yeni yazi
        </Link>
      </div>

      {params.saved ? <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Islem basariyla tamamlandi.</p> : null}
      {params.error ? <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">Islem tamamlanamadi.</p> : null}
      {error ? <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">Supabase blog_posts tablosu okunamadi.</p> : null}

      {posts.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Henuz blog yazisi yok</h2>
          <p className="mt-2 text-slate-600">Ilk elektrik rehberini olusturarak blog sistemini kullanmaya baslayin.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-950">{post.title}</h2>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                      {post.status === "published" ? "Yayinda" : "Taslak"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">/{post.slug}</p>
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt ?? "Kisa aciklama yok."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={toggleBlogStatus}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value={post.status} />
                    <button type="submit" className="btn btn-ghost">
                      {post.status === "published" ? "Taslak yap" : "Yayinla"}
                    </button>
                  </form>
                  <Link href={`/admin/blog/${post.id}/edit`} className="btn btn-ghost">
                    <Edit className="h-4 w-4" />
                    Duzenle
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
