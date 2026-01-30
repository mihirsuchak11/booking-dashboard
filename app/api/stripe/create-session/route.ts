import { NextRequest, NextResponse } from "next/server";
import { createSessionForUser } from "@/lib/stripe-create-session";
import { isPlanKey } from "@/config/stripe-plans";

/**
 * POST /api/stripe/create-session
 * Body: { planKey: "professional_monthly" | ... }
 * Email is derived from auth session, never from client.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planKey = body?.planKey;

    if (!planKey || typeof planKey !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid planKey" },
        { status: 400 }
      );
    }

    if (!isPlanKey(planKey)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const result = await createSessionForUser(planKey);

    if (result.error && !result.url) {
      if (result.error === "Not authenticated") {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    if (result.url) {
      return NextResponse.json({ url: result.url });
    }

    return NextResponse.json({ url: null });
  } catch (error) {
    console.error("[STRIPE_FLOW] create-session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
