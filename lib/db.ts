import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/data/blog";
import { hasSupabasePublicEnv, requireSupabasePublicEnv } from "@/lib/supabase/env";
import { customFetch } from "@/lib/supabase/fetch";

let supabasePublicClient: ReturnType<typeof createClient> | null = null;

function getPublicSupabase() {
  if (supabasePublicClient) return supabasePublicClient;
  const env = requireSupabasePublicEnv();
  supabasePublicClient = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: customFetch,
    },
  });
  return supabasePublicClient;
}

export type BlogQueryResult = {
  posts: BlogPost[];
  isConfigured: boolean;
  error: string | null;
};

const blogSelect =
  "id, title, slug, excerpt, content, cover_image_url, status, published_at, created_at, updated_at";

export const getPublishedBlogPosts = cache(async function getPublishedBlogPosts(): Promise<BlogQueryResult> {
  if (!hasSupabasePublicEnv()) {
    return { posts: [], isConfigured: false, error: null };
  }

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogSelect)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    return { posts: [], isConfigured: true, error: "Blog yazıları şu anda yüklenemiyor." };
  }

  return { posts: (data ?? []) as BlogPost[], isConfigured: true, error: null };
});

export const getPublishedBlogPostBySlug = cache(async function getPublishedBlogPostBySlug(slug: string) {
  if (!hasSupabasePublicEnv()) return null;

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(blogSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return data as BlogPost;
});
