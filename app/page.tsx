import Link from "next/link";
import AppShell from "@/components/app-shell";
import { prisma, isDbConfigured, safeQuery } from "@/lib/prisma";
import { CATEGORY_META, STATUS_META } from "@/lib/constants";

export default async function DashboardPage() {
  const dbReady = isDbConfigured();

  const ventures = await safeQuery(
    () =>
      prisma.venture.findMany({
        orderBy: [{ status: "desc" }, { rank: "asc" }, { name: "asc" }],
        include: {
          decisions: { where: { isOpen: true } },
          priorities: { where: { isDone: false }, orderBy: { rank: "asc" } },
          _count: { select: { documents: true } },
        },
      }),
    []
  );

  const totalOpenDecisions = ventures.reduce((sum, v) => sum + v.decisions.length, 0);

  return (
    <AppShell>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-display-lg text-deep-navy mb-2">
            Portfolio Overview
          </h1>
          <p className="font-body text-body-lg text-slate-gray max-w-2xl">
            Every Profirm Group venture, at a glance — status, open decisions, and next
            priorities in one operating system.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-lowest border border-outline-variant px-4 py-2 flex flex-col items-end">
            <span className="font-label text-label-sm text-slate-gray">ACTIVE VENTURES</span>
            <span className="font-headline text-headline-md text-deep-navy">
              {ventures.length}
            </span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant px-4 py-2 flex flex-col items-end">
            <span className="font-label text-label-sm text-slate-gray">OPEN DECISIONS</span>
            <span className="font-headline text-headline-md text-metallic-gold">
              {totalOpenDecisions}
            </span>
          </div>
          <Link
            href="/ventures/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label text-label-md hover:bg-deep-navy transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Venture
          </Link>
        </div>
      </div>

      {!dbReady ? (
        <div className="border border-warning-amber/40 bg-warning-amber/10 p-6 mb-8">
          <p className="font-label text-label-sm text-warning-amber uppercase tracking-wide mb-2">
            Database not connected
          </p>
          <p className="font-body text-body-md text-on-surface-variant mb-3">
            This dashboard renders live from Postgres via Prisma. Wire up a hosted database to
            start tracking real ventures, decisions, and priorities.
          </p>
          <ol className="font-body text-body-sm text-on-surface-variant list-decimal list-inside space-y-1">
            <li>
              Add <code className="font-label bg-surface-container px-1 rounded">DATABASE_URL</code> to{" "}
              <code className="font-label bg-surface-container px-1 rounded">.env</code> (Supabase or Neon
              connection string)
            </li>
            <li>
              Run{" "}
              <code className="font-label bg-surface-container px-1 rounded">
                npm run db:push && npm run db:seed
              </code>
            </li>
            <li>Restart the dev server</li>
          </ol>
        </div>
      ) : ventures.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container-low p-10 text-center">
          <p className="font-body text-body-md text-on-surface-variant mb-4">
            No ventures yet. Seed the database or create your first venture.
          </p>
          <Link
            href="/ventures/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label text-label-md"
          >
            Create a venture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {ventures.map((venture) => {
            const category = CATEGORY_META[venture.category];
            const status = STATUS_META[venture.status];
            const topPriorities = venture.priorities.slice(0, 3);
            const nextPriority = topPriorities[0]?.text ?? "No priority set";

            return (
              <Link
                key={venture.id}
                href={`/ventures/${venture.key}`}
                className="block bg-surface-container-lowest border border-outline-variant relative stitch-card-hover"
              >
                <div className="h-0.5 bg-metallic-gold w-full absolute top-0 left-0" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container flex items-center justify-center text-xl shrink-0">
                        {venture.emoji}
                      </div>
                      <h3 className="font-headline text-headline-md text-deep-navy leading-tight">
                        {venture.name}
                      </h3>
                    </div>
                    <span
                      className={`font-label text-label-sm px-2 py-1 uppercase tracking-wide whitespace-nowrap ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="font-label text-label-sm text-slate-gray flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">{category.icon}</span>
                    {category.label}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 border-y border-outline-variant py-4">
                    <div>
                      <p className="font-label text-label-sm text-slate-gray mb-1">
                        OPEN DECISIONS
                      </p>
                      <p className="font-body text-body-md font-bold text-deep-navy">
                        {venture.decisions.length}
                      </p>
                    </div>
                    <div>
                      <p className="font-label text-label-sm text-slate-gray mb-1">
                        KEY DOCUMENTS
                      </p>
                      <p className="font-body text-body-md font-bold text-deep-navy">
                        {venture._count.documents}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-label text-label-sm text-slate-gray mb-3 uppercase tracking-wider">
                      Next {topPriorities.length || 3} Priorities
                    </p>
                    {topPriorities.length === 0 ? (
                      <p className="font-body text-body-sm text-slate-gray">None set.</p>
                    ) : (
                      <ul className="space-y-3">
                        {topPriorities.map((p) => (
                          <li key={p.id} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-slate-gray text-lg">
                              check_box_outline_blank
                            </span>
                            <span className="text-sm text-on-surface">{p.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-surface-container flex justify-between items-center gap-3">
                  <span className="font-label text-label-sm text-slate-gray truncate">
                    NEXT: {nextPriority}
                  </span>
                  <span className="material-symbols-outlined text-deep-navy shrink-0">
                    arrow_forward
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
