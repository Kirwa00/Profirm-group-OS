import AppShell from "@/components/app-shell";
import { prisma, isDbConfigured, safeQuery } from "@/lib/prisma";
import PrioritiesBoard from "./priorities-board";
import WatchlistBoard from "./watchlist-board";

export default async function PrioritiesPage() {
  const dbReady = isDbConfigured();

  const [priorities, watchlist] = await Promise.all([
    safeQuery(
      () =>
        prisma.crossVenturePriority.findMany({
          orderBy: [{ isDone: "asc" }, { rank: "asc" }],
        }),
      []
    ),
    safeQuery(() => prisma.watchlistItem.findMany({ orderBy: { createdAt: "desc" } }), []),
  ]);

  return (
    <AppShell>
      <h1 className="font-headline text-display-lg text-deep-navy mb-2">
        Priorities &amp; Watchlist
      </h1>
      <p className="font-body text-body-lg text-slate-gray mb-8 max-w-2xl">
        What matters across every venture this week.
      </p>

      {!dbReady ? (
        <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6 mb-8">
          <p className="font-body text-body-md text-on-surface-variant">
            Database not connected — see the setup banner on the dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PrioritiesBoard items={priorities} />
          <WatchlistBoard items={watchlist} />
        </div>
      )}
    </AppShell>
  );
}
