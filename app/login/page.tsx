import { isDbConfigured } from "@/lib/prisma";
import LoginForm from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const dbReady = isDbConfigured();

  return (
    <main className="min-h-screen flex items-center justify-center bg-deep-navy px-margin-mobile">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-metallic-gold/20 flex items-center justify-center rounded border border-metallic-gold/30">
            <span className="material-symbols-outlined text-metallic-gold">apps</span>
          </div>
          <div>
            <p className="font-headline text-headline-md text-metallic-gold leading-tight">
              Profirm OS
            </p>
            <p className="font-label text-label-sm text-white/60 uppercase tracking-widest">
              Venture Management
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-8 shadow-lg">
          <h1 className="font-headline text-headline-md text-on-surface mb-1">Sign in</h1>
          <p className="font-body text-body-sm text-slate-gray mb-6">
            Internal access to the Profirm Group operating system.
          </p>

          {!dbReady ? (
            <div className="rounded-md border border-warning-amber/40 bg-warning-amber/10 p-4">
              <p className="font-label text-label-sm text-warning-amber uppercase tracking-wide mb-2">
                Database not connected
              </p>
              <p className="font-body text-body-sm text-on-surface-variant mb-3">
                Sign-in is disabled until a database is wired up. You can still browse the
                portfolio dashboard below.
              </p>
              <ol className="font-body text-body-sm text-on-surface-variant list-decimal list-inside space-y-1 mb-4">
                <li>
                  Add <code className="font-label bg-surface-container px-1 rounded">DATABASE_URL</code> to{" "}
                  <code className="font-label bg-surface-container px-1 rounded">.env</code> (a hosted
                  Postgres URL — e.g. Supabase or Neon)
                </li>
                <li>
                  Run <code className="font-label bg-surface-container px-1 rounded">npm run db:push</code>
                </li>
                <li>
                  Run <code className="font-label bg-surface-container px-1 rounded">npm run db:seed</code>
                </li>
              </ol>
              <a
                href="/"
                className="inline-flex items-center gap-1 font-label text-label-md text-primary hover:text-metallic-gold"
              >
                Go to dashboard <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>
          ) : (
            <LoginForm callbackUrl={searchParams.callbackUrl ?? "/"} />
          )}
        </div>
      </div>
    </main>
  );
}
