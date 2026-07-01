import type { Metadata } from "next";
import { companyConfig, localSearchTerms } from "@/data/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, companyConfig.siteUrl).toString();
}

export function buildMetadata(input: MetadataInput): Metadata {
  const url = absoluteUrl(input.path ?? "/");
  const imageUrl = input.image ? absoluteUrl(input.image) : absoluteUrl("/images/electrician-hero.webp");

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords ?? localSearchTerms,
    creator: companyConfig.name,
    publisher: companyConfig.name,
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
      images: [{ url: imageUrl, width: 1500, height: 844, alt: `${companyConfig.name} elektrik hizmetleri` }],
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
