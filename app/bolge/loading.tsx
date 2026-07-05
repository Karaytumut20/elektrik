import { Zap } from "lucide-react";
import { companyConfig } from "@/data/site";

export default function AreaLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-electric-mist px-4 py-16 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute -inset-3 rounded-full border-2 border-transparent border-t-electric-yellow border-r-electric-blue/40 animate-spin" />
        <div className="absolute -inset-1 rounded-full bg-electric-yellow/20 blur-sm animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-electric-navy shadow-lg shadow-electric-navy/20 border border-electric-yellow/30">
          <Zap className="h-8 w-8 text-electric-yellow animate-bounce" />
        </div>
      </div>
      <h2 className="mt-6 text-lg font-bold tracking-wide text-electric-navy">
        {companyConfig.name}
      </h2>
      <p className="mt-1.5 text-xs font-medium text-slate-500 animate-pulse">
        Bölge bilgileri yükleniyor...
      </p>
      <div className="mt-4 h-1 w-36 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-full bg-gradient-to-r from-electric-blue via-electric-yellow to-electric-blue animate-loading-bar" />
      </div>
    </div>
  );
}
