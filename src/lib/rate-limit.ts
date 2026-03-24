/**
 * Rate limiter factory using Upstash Ratelimit (sliding window).
 * Each org gets its own counter keyed by org_id.
 *
 * @example
 * const limiter = createRateLimiter({ requests: 30, window: '1 m' })
 * const { success } = await limiter.limit(orgId)
 * if (!success) return new Response('Too Many Requests', { status: 429 })
 */
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/redis'

export interface RateLimiterConfig {
  /** Number of requests allowed within the window */
  requests: number
  /** Duration string accepted by Upstash, e.g. '10 s', '1 m', '1 h' */
  window: string
}

/**
 * Creates a sliding-window rate limiter backed by Upstash Redis.
 * Default: 10 requests per 10 seconds.
 */
export function createRateLimiter(
  config: RateLimiterConfig = { requests: 10, window: '10 s' },
): Ratelimit {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window as `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`),
    analytics: true,
    prefix: 'nexestate:rl',
  })
}

/**
 * Per-org rate limiter — default 10 req / 10 s.
 * Re-use across Route Handlers; do NOT instantiate per-request.
 */
export const orgRateLimiter = createRateLimiter({ requests: 10, window: '10 s' })
