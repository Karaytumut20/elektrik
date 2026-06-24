"use client";

import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/lib/admin/blog-actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteBlogPost}
      onSubmit={(event) => {
        if (!window.confirm(`"${title}" yazisini silmek istiyor musunuz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger">
        <Trash2 className="h-4 w-4" />
        Sil
      </button>
    </form>
  );
}
