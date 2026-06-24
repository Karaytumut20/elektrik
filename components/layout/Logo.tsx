import Link from "next/link";
import { Zap } from "lucide-react";
import { companyConfig } from "@/data/site";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3" aria-label={`${companyConfig.name} ana sayfa`}>
      <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-300 text-slate-950">
        <Zap className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-bold text-slate-950">{companyConfig.name}</span>
        <span className="block text-xs font-semibold uppercase text-slate-500">Elektrik Hizmetleri</span>
      </span>
    </Link>
  );
}
