import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sample rate in prod to stay within free tier (5K events/mo)
  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Session replay: record 10% of sessions, 100% on error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Lazy-load replay integration to avoid bundle impact on initial load
  integrations: [],

  // Only enable Replay when actually needed
  lazy: true,
});
