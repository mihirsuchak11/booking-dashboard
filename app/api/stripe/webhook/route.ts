import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase-server";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { getPlanKeyFromPriceId } from "@/config/stripe-plans";
import { createBusiness } from "@/lib/dashboard-data";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripeSecret || !webhookSecret) {
    console.error("[STRIPE_FLOW] WEBHOOK_RECEIVED missing env");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    const stripeSignature = (await headers()).get("stripe-signature");
    if (!stripeSignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      webhookSecret
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[STRIPE_FLOW] WEBHOOK_RECEIVED signature error:", msg);
    return NextResponse.json(
      { error: `Webhook Error: ${msg}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id as string | undefined;
        if (!userId) {
          console.warn("[STRIPE_FLOW] checkout.session.completed missing user_id in metadata");
          break;
        }
        const subscriptionId = session.subscription as string | undefined;
        const customerId = session.customer as string | undefined;
        if (!subscriptionId) {
          console.warn("[STRIPE_FLOW] checkout.session.completed missing subscription");
          break;
        }
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) {
          console.warn("[STRIPE_FLOW] subscription missing price");
          break;
        }
        const planKey = getPlanKeyFromPriceId(priceId);
        if (!planKey) {
          console.warn("[STRIPE_FLOW] unknown price_id", priceId);
          break;
        }
        const status = mapStripeStatus(subscription.status);
        
        // Resolve business_id: Database is source of truth. If none exists (payment-first flow), create one.
        let businessId = await getBusinessIdForUser(userId);
        
        if (!businessId) {
          // Payment completed before onboarding: create a placeholder business so subscription can link to it
          // Status "onboarding" ensures user is redirected to onboarding to complete setup
          const createResult = await createBusiness(userId, {
            name: "My Business",
            timezone: "UTC",
            status: "onboarding",
          });
          if (createResult.success && createResult.businessId) {
            businessId = createResult.businessId;
            console.log(`[STRIPE_FLOW] Created business for payment-first user ${userId}: ${businessId}`);
          } else {
            console.warn(`[STRIPE_FLOW] Failed to create business for user ${userId}:`, createResult.error);
          }
        }
        
        const metadataBusinessId = session.metadata?.business_id as string | undefined;
        if (metadataBusinessId && metadataBusinessId !== businessId) {
          console.warn(`[STRIPE_FLOW] Metadata mismatch. Metadata: ${metadataBusinessId}, DB: ${businessId || "null"}`);
        }
        // current_period_end is on each SubscriptionItem, not on Subscription (Stripe API)
        const firstItem = subscription.items.data[0];
        const periodEnd = firstItem?.current_period_end;
        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null;

        const { error: upsertError } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            business_id: businessId,
            plan_key: planKey,
            status,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        if (upsertError) {
          console.error("[STRIPE_FLOW] SUBSCRIPTION_UPSERT_ERROR", upsertError);
          return NextResponse.json(
            { error: "Subscription update failed" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const subId = sub.id;

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subId);

        if (updateError) {
          console.error("[STRIPE_FLOW] SUBSCRIPTION_CANCEL_ERROR", updateError);
          return NextResponse.json(
            { error: "Subscription update failed" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0]?.price?.id;
        const planKey = priceId ? getPlanKeyFromPriceId(priceId) : null;
        const status = mapStripeStatus(subscription.status);

        const { data: existing } = await supabase
          .from("subscriptions")
          .select("id, user_id, business_id, plan_key")
          .eq("stripe_subscription_id", subscriptionId)
          .maybeSingle();

        if (!existing) {
          console.warn("[STRIPE_FLOW] subscription.updated no row for", subscriptionId);
          break;
        }

        // current_period_end is on each SubscriptionItem (Stripe API)
        const firstItem = subscription.items?.data?.[0];
        const periodEnd = firstItem?.current_period_end;
        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null;

        const updates: Record<string, unknown> = {
          status,
          stripe_price_id: priceId ?? null,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        };
        if (planKey) updates.plan_key = planKey;

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update(updates)
          .eq("id", existing.id);

        if (updateError) {
          console.error("[STRIPE_FLOW] SUBSCRIPTION_UPDATE_ERROR", updateError);
          return NextResponse.json(
            { error: "Subscription update failed" },
            { status: 500 }
          );
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[STRIPE_FLOW] WEBHOOK_RECEIVED handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "trialing" | "past_due" | "canceled" {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "active";
  }
}
