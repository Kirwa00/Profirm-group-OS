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
          priorities: { where: { isDone: false }, orderBy: { rank: "asc" }, take: 3 },
        },
      }),
    []
  );

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline text-headline-lg text-deep-navy">Portfolio Overview</h1>
          <p className="font-body text-body-md text-slate-gray mt-1">
            Every Profirm Group venture, at a glance.
          </p>
        </div>
        <Link
          href="/ventures/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded font-label text-label-md hover:bg-deep-navy transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Venture
        </Link>
      </div>

      {!dbReady ? (
        <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6 mb-8">
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
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-10 text-center">
          <p className="font-body text-body-md text-on-surface-variant mb-4">
            No ventures yet. Seed the database or create your first venture.
          </p>
          <Link
            href="/ventures/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded font-label text-label-md"
          >
            Create a venture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ventures.map((venture) => {
            const category = CATEGORY_META[venture.category];
            const status = STATUS_META[venture.status];
            return (
              <Link
                key={venture.id}
                href={`/ventures/${venture.key}`}
                className="block bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <div className="h-0.5 bg-metallic-gold" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{venture.emoji}</span>
                      <div>
                        <p className="font-headline text-body-lg font-bold text-on-surface leading-tight">
                          {venture.name}
                        </p>
                        <p className="font-label text-label-sm text-slate-gray flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">{category.icon}</span>
                          {category.label}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-label text-label-sm px-2 py-1 rounded uppercase tracking-wide ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {venture.description ? (
                    <p className="font-body text-body-sm text-on-surface-variant mb-4 line-clamp-2">
                      {venture.description}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between text-body-sm font-body text-slate-gray border-t border-outline-variant pt-3">
                    <span>{venture.decisions.length} open decision{venture.decisions.length === 1 ? "" : "s"}</span>
                    <span>{venture.priorities.length} next priorit{venture.priorities.length === 1 ? "y" : "ies"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
