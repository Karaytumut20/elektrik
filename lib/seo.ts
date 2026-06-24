import type { Metadata } from "next";
import { companyConfig } from "@/data/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, companyConfig.siteUrl).toString();
}

export function buildMetadata(input: MetadataInput): Metadata {
  const url = absoluteUrl(input.path ?? "/");
  const imageUrl = input.image ? absoluteUrl(input.image) : absoluteUrl("/images/electrician-hero.png");

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: companyConfig.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: imageUrl, width: 1600, height: 900, alt: `${companyConfig.name} elektrik hizmetleri` }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
    robots: input.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
