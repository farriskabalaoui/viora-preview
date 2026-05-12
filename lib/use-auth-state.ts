"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Reusable Supabase auth-state hook. Used to render different UI for
 * signed-in vs signed-out visitors — e.g. Header's "Sign in / Account"
 * link, the homepage CTA's "Apply for Portal Access / Browse Products"
 * pair, account-only widgets, etc.
 *
 * Returns one of three states:
 *  - "unknown" — initial; render nothing until we know (avoids flashing
 *    the wrong label during hydration)
 *  - "in"      — user is signed in
 *  - "out"     — no session
 *
 * Subscribes to onAuthStateChange so the UI updates immediately when
 * the user signs in/out without a page reload.
 */
export type AuthState = "unknown" | "in" | "out";

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>("unknown");
  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setState(data.user ? "in" : "out");
        const sub = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          setState(session?.user ? "in" : "out");
        });
        unsubscribe = () => sub.data.subscription.unsubscribe();
      } catch {
        // Supabase not configured (dev) — assume signed out
        if (mounted) setState("out");
      }
    })();
    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);
  return state;
}
