import type { NextAuthConfig } from "next-auth";

// Edge-safe config shared by middleware and the full auth.ts. Must not
// import anything that pulls in @prisma/client — Next.js Middleware runs on
// the Edge runtime by default, and Prisma Client isn't Edge-compatible.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
};
