import { supabase } from "./supabase-server";

/**
 * Helper to resolve the business ID for a given authenticated Supabase user.
 *
 * For v1 we assume a simple 1:1 relationship between user and business.
 *
 * Recommended database options (you can choose either when setting up Supabase):
 * - Add `owner_id uuid references auth.users(id)` column on `businesses` table
 *   and ensure each owner has exactly one business.
 * - OR create a `business_owners` table with (user_id, business_id) PK
 *   to support more flexible mappings later.
 *
 * This helper first tries to read from `business_owners`, then from
 * `businesses.owner_id`. If nothing is found, it falls back to the
 * existing `BUSINESS_ID` environment variable so the dashboard
 * continues to work during migration.
 */
export async function getBusinessIdForUser(
  userId: string
): Promise<string | null> {
  // 1) Try a dedicated mapping table: business_owners(user_id, business_id)
  try {
    const { data, error } = await supabase
      .from("business_owners")
      .select("business_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.business_id) {
      return data.business_id as string;
    }
  } catch (error) {
    console.error("[Auth] Error querying business_owners:", error);
  }

  // 2) Fallback: businesses.owner_user_id column (New 1:1 Schema)
  try {
    const { data, error } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_user_id", userId)
      .maybeSingle();

    if (!error && data?.id) {
      return data.id as string;
    }
  } catch (error) {
    console.error("[Auth] Error querying businesses.owner_id:", error);
  }

  // 3) Final fallback: legacy env var so existing setups keep working
  if (process.env.BUSINESS_ID) {
    return process.env.BUSINESS_ID;
  }

  return null;
}


