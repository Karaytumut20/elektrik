import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  const hasBg = className && className.includes("bg-");
  return (
    <div className={cn("rounded-lg border border-slate-200 p-6 shadow-sm", hasBg ? "" : "bg-white", className)}>
      {children}
    </div>
  );
}
