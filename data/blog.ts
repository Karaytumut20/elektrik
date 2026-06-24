export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const blogEmptyState = {
  title: "Blog yazisi henuz eklenmedi",
  description:
    "Elektrik arizalari, tesisat bakimi ve guvenli kullanim rehberleri admin panelinden yayinlandiginda burada gorunecek.",
};
