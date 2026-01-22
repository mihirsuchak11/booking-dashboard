"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Client-side Supabase instance using the public anon key.
 *
 * This is safe to run in the browser because the anon key is a
 * public key with Row Level Security enforced in your Supabase project.
 *
 * NOTE:
 * - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 *   in your `.env.local`. These should match your Supabase project's
 *   URL and anon/public key.
 * - Do NOT use your service role key here.
 */
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


