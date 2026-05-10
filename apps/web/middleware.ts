import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRODUCTION_HOST = "paddlemate.co.uk";

export async function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;

  // ── HTTPS enforcement (for non-Vercel hosts that don't auto-redirect) ──────
  // Vercel/Cloudflare handle this at the edge, but this acts as a safety net.
  if (
    process.env.NODE_ENV === "production" &&
    headers.get("x-forwarded-proto") === "http"
  ) {
    return NextResponse.redirect(
      `https://${headers.get("host")}${nextUrl.pathname}${nextUrl.search}`,
      { status: 301 }
    );
  }

  // ── Canonical domain: www → non-www ──────────────────────────────────────
  const host = headers.get("host") ?? "";
  if (process.env.NODE_ENV === "production" && host === `www.${PRODUCTION_HOST}`) {
    return NextResponse.redirect(
      `https://${PRODUCTION_HOST}${nextUrl.pathname}${nextUrl.search}`,
      { status: 301 }
    );
  }

  // ── Supabase session refresh (required for SSR auth) ─────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: object }[]) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
