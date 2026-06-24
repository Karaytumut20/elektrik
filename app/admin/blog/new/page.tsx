import { AdminShell } from "@/components/admin/AdminShell";
import { BlogForm } from "@/components/admin/BlogForm";
import { requireAdmin } from "@/lib/admin/auth";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Yeni Blog Yazisi",
  description: "Yeni blog yazisi olusturma.",
  path: "/admin/blog/new",
  noIndex: true,
});

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-950">Yeni blog yazisi</h1>
        <p className="mt-2 text-slate-600">Baslik, slug, icerik, kapak gorseli ve yayin durumunu belirleyin.</p>
      </div>
      <BlogForm />
    </AdminShell>
  );
}
