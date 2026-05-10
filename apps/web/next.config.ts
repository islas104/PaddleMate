import type { NextConfig } from "next";

const PRODUCTION_DOMAIN = "paddlemate.co.uk";

const securityHeaders = [
  // Force HTTPS for 2 years; include subdomains; submit to browser preload lists
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent the page being loaded in any iframe (clickjacking protection)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Stop browsers from guessing content types (MIME sniffing)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Only send origin in the Referer header, never the full URL path
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable features the app doesn't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // DNS prefetch for performance
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-eval in dev; keep unsafe-inline for Tailwind inline styles
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // Allow images from Supabase storage and avatar service
      "img-src 'self' data: blob: https://*.supabase.co https://ui-avatars.com",
      "font-src 'self'",
      // Supabase REST + realtime WebSocket
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
      // No iframes ever
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@paddlemate/shared", "@paddlemate/supabase"],
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },

  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Canonical: redirect www → non-www
      {
        source: "/(.*)",
        has: [{ type: "host", value: `www.${PRODUCTION_DOMAIN}` }],
        destination: `https://${PRODUCTION_DOMAIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
