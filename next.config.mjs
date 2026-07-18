/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [60, 70, 75, 80],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/hizmetler/avize-ve-aydinlatma-montaji",
        destination: "/hizmetler/avize-montaji",
        permanent: true,
      },
      {
        source: "/hizmetler/avize-aydinlatma-montaji",
        destination: "/hizmetler/avize-montaji",
        permanent: true,
      },
      {
        source: "/hizmetler/pano-yenileme",
        destination: "/hizmetler/sigorta-ve-elektrik-panosu-yenileme",
        permanent: true,
      },
      {
        source: "/hizmetler/elektrik-panosu-yenileme",
        destination: "/hizmetler/sigorta-ve-elektrik-panosu-yenileme",
        permanent: true,
      },
      {
        source: "/hizmetler/kacak-akim-rolesi",
        destination: "/hizmetler/kacak-akim-rolesi-montaji",
        permanent: true,
      },
      {
        source: "/acil-elektrikci",
        destination: "/hizmetler/acil-elektrikci",
        permanent: true,
      },
      {
        source: "/elektrikci",
        destination: "/",
        permanent: true,
      },
      {
        source: "/corlu-elektrikci",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tekirdag-corlu-elektrikci",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
