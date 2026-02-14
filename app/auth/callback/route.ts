import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import { setAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import { createSessionForUser } from "@/lib/stripe-create-session";
import { isPlanKey } from "@/config/stripe-plans";

const STRIPE_PLAN_COOKIE = "stripe_plan";

/**
 * OAuth callback handler for Google Sign-In.
 * If stripe_plan cookie is set, creates Stripe session or free subscription, then redirects.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
        console.error("[OAuth Callback] Error from provider:", error, errorDescription);
        return NextResponse.redirect(
            new URL(`/signin?error=${encodeURIComponent(error)}`, request.url)
        );
    }

    if (!code) {
        console.error("[OAuth Callback] No code provided");
        return NextResponse.redirect(
            new URL("/signin?error=no_code", request.url)
        );
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error("[OAuth Callback] Code exchange error:", exchangeError.message);
            return NextResponse.redirect(
                new URL(`/signin?error=exchange_failed`, request.url)
            );
        }

        if (!data.user) {
            console.error("[OAuth Callback] No user returned after code exchange");
            return NextResponse.redirect(
                new URL("/signin?error=no_user", request.url)
            );
        }

        await setAuthenticatedUserId(data.user.id);

        const cookieStore = await cookies();
        const planCookie = cookieStore.get(STRIPE_PLAN_COOKIE)?.value;
        const planKey = planCookie && isPlanKey(planCookie) ? planCookie : null;

        if (planKey) {
            cookieStore.set(STRIPE_PLAN_COOKIE, "", { path: "/", maxAge: 0 });
            const result = await createSessionForUser(planKey);
            if (result.url) {
                return NextResponse.redirect(result.url);
            }
        }

        const businessId = await getBusinessIdForUser(data.user.id);
        if (businessId) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/onboarding", request.url));
    } catch (err) {
        console.error("[OAuth Callback] Unexpected error:", err);
        return NextResponse.redirect(
            new URL("/signin?error=callback_failed", request.url)
        );
    }
}

