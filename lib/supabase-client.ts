import { supabase } from "./supabase-server";

// Simple wrapper to match the import expected in actions.ts
// In a real app we might want different clients (auth vs service role),
// but for this prototype using the service role client for db operations is acceptable
// provided we are careful with RLS or manual checks.
export function createSupabaseClient() {
    return supabase;
}
