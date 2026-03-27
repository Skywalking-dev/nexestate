import * as Sentry from "@sentry/nextjs";

export async function register() {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: isProd ? 0.1 : 1.0,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: isProd ? 0.1 : 1.0,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
