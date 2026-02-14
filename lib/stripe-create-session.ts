"use server";

import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { supabase } from "@/lib/supabase-server";
import {
  isPlanKey,
  PLANS,
  type PlanKey,
} from "@/config/stripe-plans";
import Stripe from "stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Resolve user email from auth (server-only). */
async function getEmailForUserId(userId: string): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(userId);
  if (error || !user?.email) return null;
  return user.email;
}

/**
 * Create Stripe Checkout session or free subscription.
 * Returns { url } to redirect to Stripe, or { url: null } for free (redirect to app).
 */
export async function createSessionForUser(
  planKey: PlanKey
): Promise<{ url: string | null; error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { url: null, error: "Not authenticated" };
  }

  if (!isPlanKey(planKey)) {
    return { url: null, error: "Invalid plan" };
  }

  const plan = PLANS[planKey];
  if (!plan) {
    return { url: null, error: "Plan not found" };
  }

  const userEmail = await getEmailForUserId(userId);
  if (!userEmail) {
    return { url: null, error: "User email not found" };
  }

  const businessId = await getBusinessIdForUser(userId);

  // Free plan: insert subscription row, no Stripe
  if (planKey === "free") {
    if (!businessId) {
      return { url: null };
    }
    const { error: insertError } = await supabase.from("subscriptions").insert({
      user_id: userId,
      business_id: businessId,
      plan_key: "free",
      status: "active",
      stripe_customer_id: undefined,
      stripe_subscription_id: undefined,
      stripe_price_id: undefined,
    });
    if (insertError) {
      // Ignore duplicate (e.g. user already has free subscription)
      if (insertError.code !== "23505") {
        console.error("[STRIPE_FLOW] RETURN_EARLY reason=free_subscription_insert_error", insertError);
        return { url: null, error: "Failed to create subscription" };
      }
    }
    return { url: null };
  }

  const priceId = plan.priceId;
  if (!priceId) {
    return { url: null, error: "Price not configured for plan" };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return { url: null, error: "Stripe not configured" };
  }

  const stripe = new Stripe(stripeSecret);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      user_id: userId,
      ...(businessId ? { business_id: businessId } : {}),
    },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/stripe/cancel`,
  });

  return {
    url: session.url ?? null,
    error: session.url ? undefined : "Failed to create checkout URL",
  };
}
