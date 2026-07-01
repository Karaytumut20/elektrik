import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteSubmissionButton } from "@/components/admin/DeleteSubmissionButton";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { Mail, Phone, User, Clock, Wrench, FileText } from "lucide-react";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Gelen Mesajlar - Admin",
  description: "İletişim formundan doldurulan mesajların listesi.",
  path: "/admin/iletisim",
  noIndex: true,
});

interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string;
  created_at: string;
}

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, phone, email, service, message, created_at")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as ContactSubmission[];

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Gelen Mesajlar</h1>
          <p className="mt-2 text-slate-600">İletişim formundan gönderilen tüm talepler.</p>
        </div>
      </div>

      {params.saved ? (
        <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          Mesaj başarıyla silindi.
        </p>
      ) : null}
      {params.error ? (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
          İşlem tamamlanamadı.
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
          Supabase contact_submissions tablosu okunamadı veya tablo mevcut değil.
        </p>
      ) : null}

      {submissions.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Henüz gelen mesaj yok</h2>
          <p className="mt-2 text-slate-600">İletişim formu doldurulduğunda burada listelenecektir.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => {
            const formattedDate = new Date(submission.created_at).toLocaleString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={submission.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4 flex-1">
                    {/* User and Contact Info Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                          <User className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Müşteri</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{submission.name}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                          <Phone className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Telefon</p>
                          <a
                            href={`tel:${submission.phone}`}
                            className="text-sm font-semibold text-amber-600 hover:text-amber-700 hover:underline truncate"
                          >
                            {submission.phone}
                          </a>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                          <Mail className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">E-Posta</p>
                          {submission.email ? (
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-sm font-semibold text-amber-600 hover:text-amber-700 hover:underline truncate"
                            >
                              {submission.email}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-400 italic">Belirtilmedi</p>
                          )}
                        </div>
                      </div>

                      {/* Service Requested */}
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                          <Wrench className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Talep Edilen Hizmet</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{submission.service}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                          <Clock className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gönderilme Tarihi</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{formattedDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message block */}
                    <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                      <div className="flex gap-2 mb-1.5 text-slate-500">
                        <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Mesaj İçeriği</span>
                      </div>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {submission.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Delete button) */}
                  <div className="flex shrink-0 items-center justify-end border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
                    <DeleteSubmissionButton id={submission.id} name={submission.name} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
