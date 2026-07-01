import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { JsonLd } from "@/components/seo/JsonLd";
import { companyConfig } from "@/data/site";
import { electricianSchema } from "@/data/schemas";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(companyConfig.siteUrl),
  applicationName: companyConfig.name,
  title: {
    default: `${companyConfig.name} | Çorlu Elektrik Arıza ve Tesisat Hizmetleri`,
    template: `%s | ${companyConfig.name}`,
  },
  description:
    "Çorlu ve yakın çevrede konut ve iş yerleri için elektrik arıza tespiti, tesisat yenileme, pano düzenleme, aydınlatma ve acil elektrikçi hizmetleri.",
  keywords: [
    "Çorlu elektrikçi",
    "Çorlu acil elektrikçi",
    "Çorlu elektrik arıza",
    "Çorlu elektrik tesisatı",
    "Çorlu pano yenileme",
    "Çorlu avize montajı",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102033",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const isAdminRoute = requestHeaders.get("x-volta-route-kind") === "admin";

  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <a href="#main-content" className="sr-only z-50 rounded-md bg-white px-4 py-3 text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Ana icerige gec
        </a>
        <JsonLd
          data={[
            electricianSchema(),
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: companyConfig.name,
              url: companyConfig.siteUrl,
            },
          ]}
        />
        {!isAdminRoute ? <Header /> : null}
        <main id="main-content">{children}</main>
        {!isAdminRoute ? <Footer /> : null}
        {!isAdminRoute ? <FloatingContact /> : null}
      </body>
    </html>
  );
}
