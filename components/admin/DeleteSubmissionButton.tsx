"use client";

import { Trash2 } from "lucide-react";
import { deleteContactSubmission } from "@/lib/admin/blog-actions";

export function DeleteSubmissionButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteContactSubmission}
      onSubmit={(event) => {
        if (!window.confirm(`"${name}" isimli kullanıcının mesajını silmek istiyor musunuz?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger flex items-center gap-1.5 px-3 py-1.5 text-xs">
        <Trash2 className="h-3.5 w-3.5" />
        Mesajı Sil
      </button>
    </form>
  );
}
