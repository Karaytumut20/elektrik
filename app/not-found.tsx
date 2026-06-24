import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-electric-mist px-4 py-16 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase text-electric-blue">404</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Sayfa bulunamadi</h1>
        <p className="mt-4 leading-7 text-slate-600">Aradiginiz sayfa tasinmis veya kaldirilmis olabilir. Ana sayfaya donebilir ya da hizmetleri inceleyebilirsiniz.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Ana sayfa</ButtonLink>
          <Link href="/hizmetler" className="btn btn-ghost">
            Hizmetler
          </Link>
        </div>
      </div>
    </section>
  );
}
