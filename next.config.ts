import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Server Actions are stable in Next.js 15 — no flag needed
  },
};

export default withSentryConfig(nextConfig, {
  // Source map upload — requires SENTRY_AUTH_TOKEN in CI
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Silent in local dev; CI will show upload progress
  silent: !process.env.CI,

  // Tree-shake Sentry debug code in prod
  disableLogger: true,

  // Upload source maps only in CI to avoid leaking them locally
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
