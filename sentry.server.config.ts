import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: isProd ? 0.1 : 1.0,
});
