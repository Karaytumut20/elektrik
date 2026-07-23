import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { JsonLd } from "@/components/seo/JsonLd";
import { companyConfig } from "@/data/site";
import { electricianSchema } from "@/data/schemas";

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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: companyConfig.name,
    statusBarStyle: "default",
  },
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17594874326"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17594874326');
          `}
        </Script>
      </head>
      <body>
        <a href="#main-content" className="sr-only z-50 rounded-md bg-white px-4 py-3 text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Ana içeriğe geç
        </a>
        <JsonLd
          data={[
            electricianSchema(),
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: companyConfig.name,
              url: companyConfig.siteUrl,
              inLanguage: "tr-TR",
              publisher: {
                "@id": `${companyConfig.siteUrl}/#electrician`,
              },
            },
          ]}
        />
        <div data-site-chrome="true">
          <Header />
        </div>
        <main id="main-content">{children}</main>
        <div data-site-chrome="true">
          <Footer />
        </div>
        <div data-site-chrome="true">
          <FloatingContact />
        </div>
        
        {/* Service Worker Registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('PWA ServiceWorker registered successfully:', reg.scope);
                    },
                    function(err) {
                      console.log('PWA ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}

