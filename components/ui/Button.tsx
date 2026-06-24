import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn("btn", variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
