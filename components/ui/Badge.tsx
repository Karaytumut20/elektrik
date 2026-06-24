import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-slate-900", className)}>
      {children}
    </span>
  );
}
