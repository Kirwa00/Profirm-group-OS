import Link from "next/link";
import { auth } from "@/auth";
import { isDbConfigured } from "@/lib/prisma";
import SideNav from "./side-nav";
import SignOutButton from "./sign-out-button";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const session = isDbConfigured() ? await auth() : null;
  const initial = session?.user?.email?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="min-h-screen">
      <header className="bg-surface border-b border-outline-variant w-full h-16 flex justify-between items-center px-margin-mobile lg:px-margin-desktop sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-headline text-headline-md font-bold text-deep-navy">
            Profirm OS
          </span>
        </Link>

        {session?.user ? (
          <div className="hidden sm:flex items-center bg-surface-container px-3 py-1.5 border border-outline-variant mx-6 flex-1 max-w-xs">
            <span className="material-symbols-outlined text-slate-gray text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 font-body-sm"
              placeholder="Search ventures..."
              type="text"
              disabled
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-4 shrink-0">
          {session?.user ? (
            <>
              <span
                className="material-symbols-outlined text-slate-gray cursor-default"
                title="Notifications"
              >
                notifications
              </span>
              <span
                className="material-symbols-outlined text-slate-gray cursor-default"
                title="Settings"
              >
                settings
              </span>
              <div className="w-8 h-8 rounded-full bg-deep-navy border border-outline-variant flex items-center justify-center">
                <span className="font-label text-label-sm text-metallic-gold">{initial}</span>
              </div>
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
