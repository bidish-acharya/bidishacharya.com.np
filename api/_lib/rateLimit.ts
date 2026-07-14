/**
 * Best-effort in-memory rate limiter, keyed per IP, scoped to a single
 * warm serverless/edge instance. This is NOT a durable, cross-instance
 * limiter — under real multi-region traffic, different instances have
 * independent counters. It's meant only to blunt casual abuse and cap
 * accidental cost overrun; for a hard guarantee, swap in Upstash Redis
 * or Vercel KV (see DEPLOY.md).
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistic cleanup so the map doesn't grow unbounded on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return false;
}
