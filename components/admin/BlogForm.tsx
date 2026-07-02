"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { createBlogPost, updateBlogPost, type BlogFormState } from "@/lib/admin/blog-actions";
import { slugify } from "@/lib/slug";

type BlogFormProps = {
  post?: BlogPost;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Kaydediliyor..." : label}
    </button>
  );
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export function BlogForm({ post }: BlogFormProps) {
  const action = post ? updateBlogPost.bind(null, post.id) : createBlogPost;
  const [state, formAction] = useActionState<BlogFormState, FormData>(action, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [preview, setPreview] = useState(false);

  const previewParagraphs = useMemo(
    () => content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [content],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form action={formAction} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-2">
          <label htmlFor="title" className="form-label">
            Baslik
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={3}
            className="field"
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!post) setSlug(slugify(nextTitle));
            }}
          />
          {state.fieldErrors?.title ? <p className="form-error">{state.fieldErrors.title}</p> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="slug" className="form-label">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="field"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
          />
          {state.fieldErrors?.slug ? <p className="form-error">{state.fieldErrors.slug}</p> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="excerpt" className="form-label">
            Kisa aciklama
          </label>
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={240} className="field" defaultValue={post?.excerpt ?? ""} />
          {state.fieldErrors?.excerpt ? <p className="form-error">{state.fieldErrors.excerpt}</p> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="cover_image_url" className="form-label">
            Görsel Linki / URL (Supabase için)
          </label>
          <input id="cover_image_url" name="cover_image_url" type="text" placeholder="https://... veya /images/..." className="field" defaultValue={post?.cover_image_url ?? ""} />
          {state.fieldErrors?.cover_image_url ? <p className="form-error">{state.fieldErrors.cover_image_url}</p> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="content" className="form-label">
            Icerik
          </label>
          <textarea
            id="content"
            name="content"
            rows={14}
            required
            minLength={40}
            className="field"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <p className="text-xs text-slate-500">HTML calistirilmaz; paragraflar duz metin olarak guvenli bicimde yayinlanir.</p>
          {state.fieldErrors?.content ? <p className="form-error">{state.fieldErrors.content}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="status" className="form-label">
              Durum
            </label>
            <select id="status" name="status" className="field" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Taslak</option>
              <option value="published">Yayinda</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="published_at" className="form-label">
              Yayin tarihi
            </label>
            <input id="published_at" name="published_at" type="datetime-local" className="field" defaultValue={toDateTimeLocal(post?.published_at ?? null)} />
          </div>
        </div>

        {state.error ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => setPreview((value) => !value)} className="btn btn-ghost">
            <Eye className="h-4 w-4" />
            {preview ? "On izlemeyi kapat" : "On izle"}
          </button>
          <SubmitButton label={post ? "Yaziyi guncelle" : "Yaziyi olustur"} />
        </div>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">On izleme</h2>
        {preview ? (
          <article className="mt-4 grid gap-4">
            <p className="text-xs font-semibold uppercase text-amber-700">{slug || "blog-slug"}</p>
            <h3 className="text-2xl font-bold text-slate-950">{title || "Baslik"}</h3>
            <div className="grid gap-3 text-sm leading-6 text-slate-700">
              {previewParagraphs.length > 0 ? previewParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Icerik burada gorunecek.</p>}
            </div>
          </article>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-600">Blog yazisini kaydetmeden once duz metin olarak nasil gorunecegini kontrol edebilirsiniz.</p>
        )}
      </aside>
    </div>
  );
}
