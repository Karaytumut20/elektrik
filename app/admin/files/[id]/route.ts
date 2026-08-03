import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = createSupabaseServiceClient();
  const { data: file, error } = await db.from("service_order_files")
    .select("storage_path").eq("id", id).is("deleted_at", null).single();
  if (error || !file) return new Response("Dosya bulunamadı.", { status: 404 });
  const signed = await db.storage.from("service-files").createSignedUrl(file.storage_path, 60);
  if (signed.error || !signed.data?.signedUrl) return new Response("Dosya bağlantısı oluşturulamadı.", { status: 500 });
  return Response.redirect(signed.data.signedUrl, 302);
}
