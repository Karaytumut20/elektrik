import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
  centered,
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  centered?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  const HeadingTag = as;

  return (
    <div className={cn("mb-9 max-w-3xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <HeadingTag className="mt-4 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">{title}</HeadingTag>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
      {children}
    </div>
  );
}
