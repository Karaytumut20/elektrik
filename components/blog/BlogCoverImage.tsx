"use client";

import { useState } from "react";
import Image from "next/image";

interface BlogCoverImageProps {
  src: string;
  alt: string;
}

export function BlogCoverImage({ src, alt }: BlogCoverImageProps) {
  const [aspect, setAspect] = useState<"landscape" | "portrait" | null>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > naturalWidth) {
      setAspect("portrait");
    } else {
      setAspect("landscape");
    }
  };

  return (
    <div className="site-container mt-8 pb-4">
      {/* CLS'i sıfıra indirmek için konteyner yüksekliği sabit tutulmuştur */}
      <div className="mx-auto max-w-4xl h-[220px] sm:h-[320px] md:h-[420px] overflow-hidden rounded-xl relative bg-slate-100/30">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          onLoad={handleLoad}
          className={`transition-opacity duration-300 ${
            aspect === null ? "opacity-0" : "opacity-100"
          } ${
            aspect === "portrait" ? "object-contain" : "object-cover"
          }`}
          unoptimized={src.startsWith("data:")}
        />
      </div>
    </div>
  );
}
