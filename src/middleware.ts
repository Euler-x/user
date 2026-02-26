import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated session
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/strategies",
  "/signals",
  "/executions",
  "/transactions",
  "/billing",
  "/ambassador",
  "/analytics",
  "/transparency",
  "/settings",
  "/support",
  "/learn",
];

// Routes that should redirect already-authenticated users to the dashboard
const AUTH_PREFIXES = ["/login", "/register", "/connect"];

// Cookie name kept in sync with authStore.ts
const SESSION_COOKIE = "eulerx-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so login can redirect back
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
