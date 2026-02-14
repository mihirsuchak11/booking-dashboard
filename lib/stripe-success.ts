import Stripe from "stripe";
import { getPlanKeyFromPriceId, type PlanKey } from "@/config/stripe-plans";

/** Display name for each plan key (no Stripe IDs). */
export const PLAN_DISPLAY_NAMES: Record<PlanKey, string> = {
  free: "Free",
  professional_monthly: "Professional (Monthly)",
  professional_yearly: "Professional (Yearly)",
  enterprise_monthly: "Enterprise (Monthly)",
  enterprise_yearly: "Enterprise (Yearly)",
};

export type SessionPlanResult =
  | { planKey: PlanKey; planName: string }
  | { planKey: null; planName: null };

/**
 * Retrieve plan details from a Stripe Checkout session ID.
 * Returns plan key and display name, or null if session invalid or not a subscription.
 */
export async function getSessionPlan(
  sessionId: string
): Promise<SessionPlanResult> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret || !sessionId) {
    return { planKey: null, planName: null };
  }

  try {
    const stripe = new Stripe(stripeSecret);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      return { planKey: null, planName: null };
    }

    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? session.subscription
        : await stripe.subscriptions.retrieve(subscriptionId);

    const priceId = subscription.items.data[0]?.price?.id;
    if (!priceId) {
      return { planKey: null, planName: null };
    }

    const planKey = getPlanKeyFromPriceId(priceId);
    if (!planKey) {
      return { planKey: null, planName: null };
    }

    const planName = PLAN_DISPLAY_NAMES[planKey] ?? planKey;
    return { planKey, planName };
  } catch {
    return { planKey: null, planName: null };
  }
}
