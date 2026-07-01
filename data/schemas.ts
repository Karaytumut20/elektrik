import { companyConfig, serviceAreas } from "@/data/site";
import type { ElectricalService } from "@/data/services";
import type { BlogPost } from "@/data/blog";

const contactPhone = companyConfig.phone.includes("X") ? undefined : companyConfig.phone;
const contactEmail = companyConfig.email.includes("example") ? undefined : companyConfig.email;
const hasStreetAddress = companyConfig.address !== `${companyConfig.city}, ${companyConfig.region}`;
const localAreas = serviceAreas.map((area) => ({
  "@type": "Place",
  name: area,
  address: {
    "@type": "PostalAddress",
    addressLocality: area.includes("Çerkezköy") || area.includes("Ergene") ? area : companyConfig.city,
    addressRegion: companyConfig.region,
    addressCountry: companyConfig.country,
  },
}));

export function electricianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${companyConfig.siteUrl}/#electrician`,
    name: companyConfig.name,
    legalName: companyConfig.legalName,
    url: companyConfig.siteUrl,
    image: `${companyConfig.siteUrl}/images/electrician-hero.webp`,
    logo: `${companyConfig.siteUrl}/favicon.svg`,
    description:
      "Çorlu ve yakın çevrede elektrik arıza tespiti, acil elektrikçi, tesisat yenileme, pano düzenleme, topraklama, priz, avize ve aydınlatma hizmetleri.",
    telephone: contactPhone,
    email: contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: hasStreetAddress ? companyConfig.address : undefined,
      addressLocality: companyConfig.city,
      addressRegion: companyConfig.region,
      addressCountry: companyConfig.country,
    },
    areaServed: localAreas,
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
    serviceType: service.title,
    provider: {
      "@type": "Electrician",
      "@id": `${companyConfig.siteUrl}/#electrician`,
      name: companyConfig.name,
      url: companyConfig.siteUrl,
    },
    areaServed: localAreas,
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
