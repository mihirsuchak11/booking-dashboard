import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import { setAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";

/**
 * OAuth callback handler for Google Sign-In.
 * 
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Google redirects here with an auth code
 * 3. We exchange the code for a session (SSR client reads PKCE verifier from cookies)
 * 4. Set our custom HTTP-only cookie
 * 5. Redirect to dashboard (if business exists) or onboarding (if new user)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors from Google
    if (error) {
        console.error("[OAuth Callback] Error from provider:", error, errorDescription);
        return NextResponse.redirect(
            new URL(`/signin?error=${encodeURIComponent(error)}`, request.url)
        );
    }

    // No code means something went wrong
    if (!code) {
        console.error("[OAuth Callback] No code provided");
        return NextResponse.redirect(
            new URL("/signin?error=no_code", request.url)
        );
    }

    try {
        // Use SSR client which reads the PKCE code verifier from cookies
        const supabase = await createSupabaseServerClient();

        // Exchange the OAuth code for a session
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

        console.log("[OAuth Callback] User authenticated:", data.user.email);

        // Store user ID in our custom HTTP-only session cookie
        await setAuthenticatedUserId(data.user.id);

        // Check if user has an existing business
        const businessId = await getBusinessIdForUser(data.user.id);

        if (businessId) {
            // Existing user with business - go to dashboard
            console.log("[OAuth Callback] User has business, redirecting to dashboard");
            return NextResponse.redirect(new URL("/", request.url));
        } else {
            // New user - needs to complete onboarding
            console.log("[OAuth Callback] New user, redirecting to onboarding");
            return NextResponse.redirect(new URL("/onboarding", request.url));
        }
    } catch (error) {
        console.error("[OAuth Callback] Unexpected error:", error);
        return NextResponse.redirect(
            new URL("/signin?error=callback_failed", request.url)
        );
    }
}

