import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Lazily instantiated so the app can boot without DATABASE_URL set — pages
// that need data call safeQuery() below, which turns a missing/unreachable
// database into a clean "not connected" state instead of a 500.
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

/**
 * Runs a Prisma query but never throws — returns `fallback` (default: an
 * empty array) if the DB isn't configured or isn't reachable, so pages can
 * render a setup banner instead of crashing.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error("[db] query failed:", err instanceof Error ? err.message : err);
    return fallback;
  }
}
