import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

// Edge-safe auth instance — does not import auth.ts (which pulls in
// @prisma/client via the Credentials provider's authorize()).
const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login", "/api/auth"];

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
