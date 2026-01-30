/**
 * Server-only plan → Stripe price mapping.
 * Stripe IDs never leak to the client.
 */

export const PLAN_KEYS = [
  "free",
  "professional_monthly",
  "professional_yearly",
  "enterprise_monthly",
  "enterprise_yearly",
] as const;

export type PlanKey = (typeof PLAN_KEYS)[number];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && PLAN_KEYS.includes(value as PlanKey);
}

/** Resolve Stripe price ID from env (server-only). Stripe IDs never reach the client. */
function getPriceIdFromEnv(key: "professional_monthly" | "professional_yearly" | "enterprise_monthly" | "enterprise_yearly"): string | null {
  const envMap: Record<typeof key, string | undefined> = {
    professional_monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    professional_yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY,
    enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    enterprise_yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  };
  const v = envMap[key];
  return v && v.length > 0 ? v : null;
}

export const PLANS: Record<PlanKey, { priceId: string | null }> = {
  free: { priceId: null },
  professional_monthly: { priceId: getPriceIdFromEnv("professional_monthly") },
  professional_yearly: { priceId: getPriceIdFromEnv("professional_yearly") },
  enterprise_monthly: { priceId: getPriceIdFromEnv("enterprise_monthly") },
  enterprise_yearly: { priceId: getPriceIdFromEnv("enterprise_yearly") },
} as const;

/** Reverse map: Stripe price_id -> plan_key (for webhooks). */
export function getPlanKeyFromPriceId(priceId: string): PlanKey | null {
  for (const [key, { priceId: pid }] of Object.entries(PLANS)) {
    if (pid === priceId) return key as PlanKey;
  }
  return null;
}
