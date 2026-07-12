import AppShell from "@/components/app-shell";
import { isDbConfigured } from "@/lib/prisma";
import NewVentureForm from "./new-venture-form";

export default function NewVenturePage() {
  const dbReady = isDbConfigured();

  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="font-headline text-headline-lg text-deep-navy mb-1">New Venture</h1>
        <p className="font-body text-body-md text-slate-gray mb-6">
          Add a new venture to the Profirm Group portfolio.
        </p>

        {!dbReady ? (
          <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6">
            <p className="font-body text-body-md text-on-surface-variant">
              Database not connected — creating ventures requires a live Postgres connection. See
              the setup banner on the dashboard.
            </p>
          </div>
        ) : (
          <NewVentureForm />
        )}
      </div>
    </AppShell>
  );
}
