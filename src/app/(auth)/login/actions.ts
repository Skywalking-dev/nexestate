"use server";

import { signInWithMagicLink } from "@/lib/supabase/auth";

export async function loginWithMagicLink(email: string): Promise<{ error?: string }> {
  try {
    await signInWithMagicLink(email);
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Ocurrió un error. Intenta nuevamente.",
    };
  }
}
