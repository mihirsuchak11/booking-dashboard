import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAuthClient: SupabaseClient | null = null;

/**
 * Supabase client dedicated to authentication operations.
 *
 * This uses the Supabase anon/public key and is intended to run
 * **server-side only** (e.g. in server actions). We do NOT rely on
 * Supabase-managed cookies; instead we derive the authenticated
 * user ID from the auth response and manage our own HTTP-only cookie.
 * 
 * Uses PKCE flow for OAuth to ensure tokens are exchanged server-side.
 */
export function getSupabaseAuthClient(): SupabaseClient {
  if (!supabaseAuthClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase auth not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local"
      );
    }

    supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'pkce', // Use PKCE flow for server-side OAuth
      },
    });
  }

  return supabaseAuthClient;
}



