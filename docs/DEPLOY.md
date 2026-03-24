# NexEstate — Deploy Guide

## Prerequisites

| Service | Why | Free tier |
|---|---|---|
| Vercel | Hosting + edge | Hobby (unlimited personal) |
| Supabase | DB + auth + storage | 500 MB DB, 1 GB storage |
| Upstash Redis | Rate limiting | 10K req/day |
| Sentry | Error tracking | 5K events/mo |

---

## Environment Variables

| Variable | Required | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Supabase > Settings > API — server only |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://nexestate.app` in prod |
| `UPSTASH_REDIS_REST_URL` | yes | Upstash console > Redis > REST API |
| `UPSTASH_REDIS_REST_TOKEN` | yes | Upstash console > Redis > REST API |
| `NEXT_PUBLIC_VERCEL_ENV` | no | Auto-injected by Vercel (`production`/`preview`/`development`) |
| `SENTRY_DSN` | yes | Sentry > Project > Settings > Client Keys |
| `NEXT_PUBLIC_SENTRY_DSN` | yes | Same as `SENTRY_DSN` — exposed to browser |
| `SENTRY_AUTH_TOKEN` | CI only | Sentry > Settings > Auth Tokens (scope: `project:releases`, `org:read`) |
| `SENTRY_ORG` | CI only | Sentry org slug |
| `SENTRY_PROJECT` | CI only | Sentry project slug |

Set all in: Vercel dashboard > Project > Settings > Environment Variables.
Scope `SENTRY_AUTH_TOKEN` to Production + Preview only (not needed locally).

---

## First Deploy

```bash
# 1. Install Vercel CLI
pnpm add -g vercel

# 2. Link repo to Vercel project
vercel link

# 3. Set env vars via CLI (or use dashboard)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ... repeat for each var

# 4. Deploy
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard — it will auto-deploy on push to `main`.

---

## Preview Deployments

Every PR gets a unique preview URL (`nexestate-git-<branch>.vercel.app`).

- Previews use the same `NEXT_PUBLIC_SUPABASE_URL` as dev — point to the shared dev Supabase instance.
- `NEXT_PUBLIC_SITE_URL` is set to `NEXT_PUBLIC_VERCEL_URL` automatically in previews by Vercel.
- Rate limiting (Upstash) is shared — not an issue at preview traffic levels.
- Sentry events from previews are tagged `environment: preview`.

---

## Monitoring

### Sentry
- Dashboard: `https://sentry.io/organizations/<org>/projects/nexestate/`
- Error rate alert: configure at Sentry > Alerts > New Alert Rule (recommended: >5 errors/min)
- Source maps are uploaded automatically in CI via `SENTRY_AUTH_TOKEN`

### Vercel Analytics + Speed Insights
- Already wired in `layout.tsx` via `<Analytics />` and `<SpeedInsights />`
- Dashboard: Vercel project > Analytics tab
- CWV targets: LCP <2.5s, INP <200ms, CLS <0.1 (see `docs/CWV_BASELINE.md`)

### UptimeRobot
- Add monitor: HTTP(s), URL `https://nexestate.app`, interval 5 min
- Alert contact: email or Slack webhook

---

## Troubleshooting

**Build fails with Sentry upload error**
- Check `SENTRY_AUTH_TOKEN` is set in Vercel env (Production + Preview)
- Verify token has `project:releases` and `org:read` scopes

**`SUPABASE_SERVICE_ROLE_KEY` exposed in client bundle**
- Never prefix with `NEXT_PUBLIC_` — it must stay server-only
- Use Server Components or Route Handlers to access it

**Preview URL not working for Supabase auth redirects**
- Add the Vercel preview domain pattern to Supabase > Authentication > URL Configuration > Redirect URLs: `https://*.vercel.app/**`

**Rate limiting triggering in dev**
- Upstash free tier resets daily; reduce test request frequency or use a separate dev Redis instance

---

## Rollback

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote <deployment-url>
```

Post-rollback checklist:
1. Verify `https://nexestate.app` loads and returns 200
2. Check Sentry error rate drops to baseline
3. Confirm Vercel Analytics shows traffic recovering
4. Test auth flow (sign in / sign up)
