import Stripe from "stripe";
import { supabase } from "@/lib/supabase-server";

export type WebhookCheckResult =
  | { needsWebhook: true; userId: string; sessionId: string }
  | { needsWebhook: false };

/**
 * If payment succeeded but no subscription row exists for the user, webhook didn't run.
 */
export async function checkWebhookConnection(
  sessionId: string
): Promise<WebhookCheckResult> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return { needsWebhook: false };

  try {
    const session = await new Stripe(stripeSecret).checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.user_id as string | undefined;
    if (!userId || !session.subscription || session.payment_status !== "paid") {
      return { needsWebhook: false };
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return { needsWebhook: false };
    return data ? { needsWebhook: false } : { needsWebhook: true, userId, sessionId };
  } catch (err) {
    console.error("[STRIPE_FLOW] checkWebhookConnection:", err);
    return { needsWebhook: false };
  }
}
