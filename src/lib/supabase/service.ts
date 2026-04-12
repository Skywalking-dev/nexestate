import type { Database } from "@/lib/supabase/types";
/**
 * Supabase service-role client — bypasses RLS.
 * Use ONLY for public-facing pages that need to read data without user auth.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
	return createSupabaseClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);
}
