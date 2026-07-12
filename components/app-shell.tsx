import Link from "next/link";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/prisma";
import SideNav from "./side-nav";
import SignOutButton from "./sign-out-button";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const session = isDbConfigured() ? await auth() : null;

  return (
    <div className="min-h-screen">
      <header className="bg-surface border-b border-outline-variant w-full h-16 flex justify-between items-center px-margin-mobile lg:px-margin-desktop sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline text-headline-md font-bold text-deep-navy">
            Profirm OS
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="font-label text-label-sm text-on-surface-variant hidden sm:inline">
                {session.user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="font-label text-label-sm text-primary hover:text-metallic-gold"
            >
              {isDbConfigured() ? "Sign in" : "Setup"}
            </Link>
          )}
        </div>
      </header>
      <div className="flex">
        <SideNav />
        <main className="flex-1 px-margin-mobile lg:px-margin-desktop py-8 max-w-container-max mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
