"use server";

import { redirect } from "next/navigation";
import { getSupabaseAuthClient } from "@/lib/supabase-auth-server";
import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import {
  setAuthenticatedUserId,
  clearAuthenticatedUser,
} from "@/lib/auth-session";

export interface SignInState {
  error?: string;
}

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";

/**
 * Initiates Google OAuth sign-in flow.
 * Uses SSR client for proper PKCE code verifier handling.
 * Redirects user to Google's consent screen.
 */
export async function signInWithGoogleAction() {
  // Use SSR client which properly stores PKCE code verifier in cookies
  const supabase = await createSupabaseServerClient();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("[Google OAuth] Error initiating OAuth:", error.message);
    throw new Error("Failed to initiate Google sign-in");
  }

  // Redirect to Google's OAuth consent screen
  if (data.url) {
    redirect(data.url);
  }
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form submission." };
  }

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabaseAuth = getSupabaseAuthClient();

  // Use Supabase Auth to verify credentials, but manage our own session cookie.
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: INVALID_CREDENTIALS_MESSAGE };
  }

  // Store only the user ID in a secure HTTP-only cookie.
  await setAuthenticatedUserId(data.user.id);

  redirect("/dashboard");
}

export async function signOutAction() {
  // Clear our own session cookie; we don't rely on Supabase-managed cookies.
  await clearAuthenticatedUser();
  redirect("/signin");
}



