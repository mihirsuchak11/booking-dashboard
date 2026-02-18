import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import {
  sendNudge7dEmail,
  sendNudge1dEmail,
  sendExpiredEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron job to send plan expiry reminder emails.
 * Runs daily (or twice daily) to check subscriptions and send:
 * - 7-day nudge: when current_period_end is between today and today + 7 days
 * - 1-day nudge: when current_period_end is between today and today + 1 day
 * - Expired: when current_period_end is in the past
 *
 * Uses email_log table to prevent duplicate sends.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.error("[CRON] CRON_SECRET not configured");
    return NextResponse.json(
      { error: "Cron not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn("[CRON] Unauthorized cron request");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const oneDayFromNow = new Date(today);
    oneDayFromNow.setDate(today.getDate() + 1);

    // Query active subscriptions with current_period_end
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("id, user_id, plan_key, current_period_end, status")
      .eq("status", "active")
      .not("current_period_end", "is", null);

    if (error) {
      console.error("[CRON] Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "No subscriptions to process",
        processed: 0,
      });
    }

    let processed = 0;
    let errors = 0;

    for (const subscription of subscriptions) {
      if (!subscription.current_period_end) continue;

      const periodEnd = new Date(subscription.current_period_end);
      const planName = subscription.plan_key
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const billingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://app.bookingagent.ai"}/settings?tab=subscription`;

      // Check if email was already sent (idempotence)
      const checkEmailLog = async (emailType: string, uniqueKey: string) => {
        const { data } = await supabase
          .from("email_log")
          .select("id")
          .eq("user_id", subscription.user_id)
          .eq("email_type", emailType)
          .eq("unique_key", uniqueKey)
          .maybeSingle();
        return !!data;
      };

      const logEmailSent = async (emailType: string, uniqueKey: string, metadata?: Record<string, unknown>) => {
        // Use upsert to handle unique constraint gracefully
        await supabase.from("email_log").upsert({
          user_id: subscription.user_id,
          email_type: emailType,
          unique_key: uniqueKey,
          metadata: metadata || {},
        }, {
          onConflict: "user_id,email_type,unique_key",
          ignoreDuplicates: true,
        });
      };

      try {
        // Expired: period_end is in the past
        if (periodEnd < today) {
          const uniqueKey = `${subscription.id}_${subscription.current_period_end}`;
          const alreadySent = await checkEmailLog("expired", uniqueKey);
          if (!alreadySent) {
            const result = await sendExpiredEmail({
              userId: subscription.user_id,
              planName,
              renewalUrl: billingUrl,
            });
            if (result.success) {
              await logEmailSent("expired", uniqueKey, {
                subscription_id: subscription.id,
                period_end: subscription.current_period_end,
              });
              processed++;
            } else {
              errors++;
              console.error(`[CRON] Failed to send expired email to user ${subscription.user_id}: ${result.error}`);
            }
          }
        }
        // 1-day nudge: period_end is between today and tomorrow
        else if (periodEnd >= today && periodEnd <= oneDayFromNow) {
          const uniqueKey = `${subscription.id}_${subscription.current_period_end}`;
          const alreadySent = await checkEmailLog("nudge_1d", uniqueKey);
          if (!alreadySent) {
            const result = await sendNudge1dEmail({
              userId: subscription.user_id,
              planName,
              renewalDate: subscription.current_period_end,
              billingUrl,
            });
            if (result.success) {
              await logEmailSent("nudge_1d", uniqueKey, {
                subscription_id: subscription.id,
                period_end: subscription.current_period_end,
              });
              processed++;
            } else {
              errors++;
              console.error(`[CRON] Failed to send 1d nudge to user ${subscription.user_id}: ${result.error}`);
            }
          }
        }
        // 7-day nudge: period_end is between today and 7 days from now
        else if (periodEnd > oneDayFromNow && periodEnd <= sevenDaysFromNow) {
          const uniqueKey = `${subscription.id}_${subscription.current_period_end}`;
          const alreadySent = await checkEmailLog("nudge_7d", uniqueKey);
          if (!alreadySent) {
            const result = await sendNudge7dEmail({
              userId: subscription.user_id,
              planName,
              renewalDate: subscription.current_period_end,
              billingUrl,
            });
            if (result.success) {
              await logEmailSent("nudge_7d", uniqueKey, {
                subscription_id: subscription.id,
                period_end: subscription.current_period_end,
              });
              processed++;
            } else {
              errors++;
              console.error(`[CRON] Failed to send 7d nudge to user ${subscription.user_id}: ${result.error}`);
            }
          }
        }
      } catch (error) {
        errors++;
        console.error(`[CRON] Error processing subscription ${subscription.id}:`, error);
      }
    }

    return NextResponse.json({
      message: "Cron job completed",
      processed,
      errors,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("[CRON] Unexpected error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
