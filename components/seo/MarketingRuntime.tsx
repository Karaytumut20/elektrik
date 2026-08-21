"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdClickTracker } from "@/components/seo/AdClickTracker";

export function MarketingRuntime() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Admin registers the same worker from AdminPwaRegister. Its fetch handler
    // bypasses private routes, so retaining it is safe and keeps the admin PWA installable.
    if (isAdmin) return;
    const register = () => { void navigator.serviceWorker.register("/sw.js"); };
    window.addEventListener("load", register, { once: true });
    if (document.readyState === "complete") register();
    return () => window.removeEventListener("load", register);
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <AdClickTracker />
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TWXHLR7F');`}
      </Script>
      <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17594874326" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17594874326');
        `}
      </Script>
    </>
  );
}
