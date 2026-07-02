import { companyConfig, localSearchTerms, serviceAreas as configuredServiceAreas } from "@/data/site";
import type { ElectricalService } from "@/data/services";
import type { ServiceArea } from "@/data/areas";
import type { BlogPost } from "@/data/blog";

const contactPhone = companyConfig.phone.includes("X") ? undefined : companyConfig.phone;
const contactEmail = companyConfig.email.includes("example") ? undefined : companyConfig.email;
const hasStreetAddress = companyConfig.address !== `${companyConfig.city}, ${companyConfig.region}`;
const localAreas = configuredServiceAreas.map((area) => ({
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
    priceRange: "Teklife göre",
    knowsAbout: localSearchTerms,
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
  const serviceUrl = `${companyConfig.siteUrl}/hizmetler/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    description: service.shortDescription,
    serviceType: service.title,
    url: serviceUrl,
    image: `${companyConfig.siteUrl}${service.image}`,
    provider: {
      "@type": "Electrician",
      "@id": `${companyConfig.siteUrl}/#electrician`,
      name: companyConfig.name,
      url: companyConfig.siteUrl,
    },
    areaServed: localAreas,
  };
}

export function areaElectricianSchema(area: ServiceArea) {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${companyConfig.siteUrl}/bolge/${area.slug}#electrician`,
    name: `${companyConfig.name} - ${area.name}`,
    url: `${companyConfig.siteUrl}/bolge/${area.slug}`,
    image: `${companyConfig.siteUrl}${area.heroImage}`,
    telephone: contactPhone,
    email: contactEmail,
    priceRange: "Teklife göre",
    description: area.metaDescription,
    parentOrganization: {
      "@type": "Electrician",
      "@id": `${companyConfig.siteUrl}/#electrician`,
      name: companyConfig.name,
      url: companyConfig.siteUrl,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: hasStreetAddress ? companyConfig.address : undefined,
      addressLocality: area.name.includes("Ergene") || area.name.includes("Çerkezköy") ? area.name : companyConfig.city,
      addressRegion: companyConfig.region,
      addressCountry: companyConfig.country,
    },
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name.includes("Ergene") || area.name.includes("Çerkezköy") ? area.name : companyConfig.city,
        addressRegion: companyConfig.region,
        addressCountry: companyConfig.country,
      },
    },
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
  const postUrl = `${companyConfig.siteUrl}/blog/${post.slug}`;
  const postImage = post.cover_image_url
    ? post.cover_image_url.startsWith("http")
      ? post.cover_image_url
      : `${companyConfig.siteUrl}${post.cover_image_url}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: postImage,
    mainEntityOfPage: postUrl,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: companyConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: companyConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${companyConfig.siteUrl}/favicon.svg`,
      },
    },
  };
}
