import { companyConfig } from "@/data/site";
import type { ElectricalService } from "@/data/services";
import type { BlogPost } from "@/data/blog";

export function electricianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: companyConfig.name,
    legalName: companyConfig.legalName,
    url: companyConfig.siteUrl,
    telephone: companyConfig.phone,
    email: companyConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyConfig.address,
      addressLocality: companyConfig.city,
      addressCountry: "TR",
    },
    areaServed: companyConfig.city,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "19:00",
      },
    ],
  };
}

export function serviceSchema(service: ElectricalService) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: {
      "@type": "Electrician",
      name: companyConfig.name,
      url: companyConfig.siteUrl,
    },
    areaServed: companyConfig.city,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: companyConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: companyConfig.name,
    },
  };
}
