import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase PKCE auth callback handler.
 * Exchanges the auth code for a session and redirects to /dashboard.
 *
 * URL: /auth/callback?code=<pkce-code>&next=/dashboard
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — redirect to intended destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Code missing or exchange failed — redirect to login with error hint
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_failed`
  );
}
