interface StructuredLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context: Record<string, any>;
}

export function log(level: 'info' | 'warn' | 'error', message: string, context: Record<string, any> = {}) {
  const logEntry: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };
  console.log(JSON.stringify(logEntry));
}

// Simple In-Memory Rate Limiter (Token Bucket)
const RATE_LIMITS = new Map<string, { tokens: number, lastRefill: number }>();
const REFILL_RATE = 10; // Tokens per minute
const MAX_TOKENS = 20;

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  if (!RATE_LIMITS.has(key)) {
    RATE_LIMITS.set(key, { tokens: MAX_TOKENS, lastRefill: now });
  }

  const entry = RATE_LIMITS.get(key)!;
  const elapsed = now - entry.lastRefill;
  const refill = Math.floor(elapsed / (60000 / REFILL_RATE));

  if (refill > 0) {
    entry.tokens = Math.min(MAX_TOKENS, entry.tokens + refill);
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens--;
    return true;
  }
  return false;
}
