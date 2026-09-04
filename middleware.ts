import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

// Edge-safe auth instance — does not import auth.ts (which pulls in
// @prisma/client via the Credentials provider's authorize()).
const { auth } = NextAuth(authConfig);

// Paths that must load without a session: the login page, the auth API, and
// the PWA manifest (the browser — and the login page itself — fetch it while
// logged out).
const PUBLIC_PATHS = ["/login", "/api/auth", "/manifest.webmanifest"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // No hosted database yet — nothing sensitive to protect, let the setup
  // banners on each page guide the user instead of locking them out.
  if (!process.env.DATABASE_URL) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Skip Next internals and any static asset by extension (icons, manifest),
  // so PWA files aren't bounced to /login when a database is configured.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webmanifest)$).*)",
  ],
};
