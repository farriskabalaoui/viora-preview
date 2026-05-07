import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Auth middleware — refreshes Supabase session and gates protected routes.
 *
 * GATED ROUTES (require login):
 *   /products/[slug]  (catalog grid IS public — DP style — but product detail needs auth)
 *   /cart
 *   /checkout
 *   /account/*
 *
 * PUBLIC ROUTES:
 *   /, /products (catalog teaser), /research/*, /about, /contact,
 *   /affiliate, /faq, /signup, /login, /consent
 */

const PROTECTED_PREFIXES = [
  "/products/",
  "/cart",
  "/checkout",
  "/account",
];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Supabase not configured yet — let everything through (dev-only safe state)
    return res;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookies) {
        cookies.forEach(({ name, value }) => {
          req.cookies.set(name, value);
        });
        res = NextResponse.next({ request: req });
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if route requires auth
  const path = req.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some((prefix) =>
    path === prefix || path.startsWith(prefix),
  );

  if (needsAuth && !user) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = "/signup";
    redirect.searchParams.set("returnTo", path);
    return NextResponse.redirect(redirect);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets, API routes that don't need auth,
     * and Next.js internals
     */
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|api/chat|coas|products/.*\\.webp|calculator|.*\\.(?:webp|png|jpg|jpeg|svg|ico|woff|woff2)).*)",
  ],
};
