"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { isValidSlug, slugify } from "@/lib/slug";

export type BlogFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const blogSchema = z.object({
  title: z.string().trim().min(3, "Baslik en az 3 karakter olmali."),
  slug: z.string().trim().min(3, "Slug en az 3 karakter olmali."),
  excerpt: z.string().trim().max(240, "Kisa aciklama 240 karakteri gecmemeli.").optional(),
  content: z.string().trim().min(40, "Icerik en az 40 karakter olmali."),
  cover_image_url: z.string().trim().url("Kapak gorseli gecerli bir URL olmali.").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  published_at: z.string().trim().optional(),
});

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizePostInput(formData: FormData) {
  const rawTitle = formValue(formData, "title");
  const rawSlug = formValue(formData, "slug") || rawTitle;
  return {
    title: rawTitle,
    slug: slugify(rawSlug),
    excerpt: formValue(formData, "excerpt"),
    content: formValue(formData, "content"),
    cover_image_url: formValue(formData, "cover_image_url"),
    status: formValue(formData, "status"),
    published_at: formValue(formData, "published_at"),
  };
}

function fieldErrorsFrom(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

async function ensureUniqueSlug(slug: string, currentId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("blog_posts").select("id").eq("slug", slug).limit(1);
  if (currentId) query = query.neq("id", currentId);
  const { data, error } = await query.maybeSingle();
  if (error) return "Slug kontrolu yapilamadi. Lutfen tekrar deneyin.";
  if (data) return "Bu slug kullaniliyor. Lutfen farkli bir slug girin.";
  return null;
}

function publishedAtFor(status: "draft" | "published", value?: string) {
  if (status === "draft") return value ? new Date(value).toISOString() : null;
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

export async function createBlogPost(_: BlogFormState, formData: FormData): Promise<BlogFormState> {
  await requireAdmin();
  const parsed = blogSchema.safeParse(normalizePostInput(formData));
  if (!parsed.success) return { error: "Form alanlarini kontrol edin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isValidSlug(parsed.data.slug)) return { error: "Slug yalnizca kucuk harf, rakam ve tire icerebilir." };

  const slugError = await ensureUniqueSlug(parsed.data.slug);
  if (slugError) return { error: slugError, fieldErrors: { slug: slugError } };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content,
    cover_image_url: parsed.data.cover_image_url || null,
    status: parsed.data.status,
    published_at: publishedAtFor(parsed.data.status, parsed.data.published_at),
  });

  if (error) return { error: "Blog yazisi kaydedilemedi. Yetki ve Supabase kurulumunu kontrol edin." };

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/blog?saved=created");
}

export async function updateBlogPost(id: string, _: BlogFormState, formData: FormData): Promise<BlogFormState> {
  await requireAdmin();
  const parsed = blogSchema.safeParse(normalizePostInput(formData));
  if (!parsed.success) return { error: "Form alanlarini kontrol edin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isValidSlug(parsed.data.slug)) return { error: "Slug yalnizca kucuk harf, rakam ve tire icerebilir." };

  const slugError = await ensureUniqueSlug(parsed.data.slug, id);
  if (slugError) return { error: slugError, fieldErrors: { slug: slugError } };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      cover_image_url: parsed.data.cover_image_url || null,
      status: parsed.data.status,
      published_at: publishedAtFor(parsed.data.status, parsed.data.published_at),
    })
    .eq("id", id);

  if (error) return { error: "Blog yazisi guncellenemedi. Yetki ve Supabase kurulumunu kontrol edin." };

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect("/admin/blog?saved=updated");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  if (!id) redirect("/admin/blog?error=missing-id");

  const supabase = await createSupabaseServerClient();
  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/blog?saved=deleted");
}

export async function toggleBlogStatus(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  const status = formValue(formData, "status") === "published" ? "draft" : "published";
  if (!id) redirect("/admin/blog?error=missing-id");

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("blog_posts")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/blog?saved=status");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login?logged_out=1");
}

export async function deleteContactSubmission(formData: FormData) {
  await requireAdmin();
  const id = formValue(formData, "id");
  if (!id) redirect("/admin/iletisim?error=missing-id");

  const supabase = createSupabaseServiceClient();
  await supabase.from("contact_submissions").delete().eq("id", id);

  revalidatePath("/admin/iletisim");
  redirect("/admin/iletisim?saved=deleted");
}

