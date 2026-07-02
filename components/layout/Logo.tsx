import Link from "next/link";
import Image from "next/image";
import { companyConfig } from "@/data/site";

interface LogoProps {
  href?: string;
  /** "default" = renkli (navbar), "white" = beyaz (footer) */
  variant?: "default" | "white";
  /** "md" = normal navbar boyutu, "lg" = daha büyük (footer) */
  size?: "md" | "lg";
}

export function Logo({ href = "/", variant = "default", size = "md" }: LogoProps) {
  const dimensions =
    size === "lg"
      ? { height: "h-16", width: "w-48" }
      : { height: "h-14", width: "w-40" };

  return (
    <Link href={href} className="flex items-center" aria-label={`${companyConfig.name} ana sayfa`}>
      <div className={`relative ${dimensions.height} ${dimensions.width} flex-shrink-0`}>
        <Image
          src="/images/logo.png"
          alt={companyConfig.name}
          fill
          priority
          sizes="(max-width: 768px) 160px, 192px"
          className={`object-contain ${variant === "white" ? "brightness-0 invert" : ""}`}
        />
      </div>
    </Link>
  );
}


