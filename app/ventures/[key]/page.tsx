import { notFound } from "next/navigation";
import AppShell from "@/components/app-shell";
import { prisma, isDbConfigured, safeQuery } from "@/lib/prisma";
import { CATEGORY_META } from "@/lib/constants";
import { getModulesForVenture } from "@/lib/modules";
import StatusSelect from "./status-select";
import DecisionsPanel from "./decisions-panel";
import PrioritiesPanel from "./priorities-panel";
import DocumentsPanel from "./documents-panel";
import Link from "next/link";

export default async function VentureDetailPage({ params }: { params: { key: string } }) {
  if (!isDbConfigured()) {
    return (
      <AppShell>
        <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6">
          <p className="font-body text-body-md text-on-surface-variant">
            Database not connected — venture detail requires a live Postgres connection.
          </p>
        </div>
      </AppShell>
    );
  }

  const venture = await safeQuery(
    () =>
      prisma.venture.findUnique({
        where: { key: params.key },
        include: {
          documents: { orderBy: { createdAt: "asc" } },
          decisions: { orderBy: { createdAt: "asc" } },
          priorities: { orderBy: [{ isDone: "asc" }, { rank: "asc" }] },
        },
      }),
    null
  );

  if (!venture) notFound();

  const category = CATEGORY_META[venture.category];
  const openDecisions = venture.decisions.filter((d) => d.isOpen);
  const resolvedDecisions = venture.decisions.filter((d) => !d.isOpen);
  const modules = getModulesForVenture(venture.key);

  return (
    <AppShell>
      <Link href="/" className="font-label text-label-sm text-slate-gray hover:text-primary inline-flex items-center gap-1 mb-4">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Portfolio
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{venture.emoji}</span>
          <div>
            <h1 className="font-headline text-headline-lg text-deep-navy">{venture.name}</h1>
            <p className="font-label text-label-sm text-slate-gray flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">{category.icon}</span>
              {category.label}
            </p>
          </div>
        </div>
        <StatusSelect ventureKey={venture.key} status={venture.status} />
      </div>

      {venture.description ? (
        <p className="font-body text-body-md text-on-surface-variant mt-3 max-w-3xl">
          {venture.description}
        </p>
      ) : null}

      {venture.externalUrl ? (
        <a
          href={venture.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 mt-3 font-label text-label-sm text-primary hover:text-metallic-gold"
        >
          Open live app <span className="material-symbols-outlined text-base">open_in_new</span>
        </a>
      ) : null}

      {modules.length > 0 ? (
        <div className="mt-6">
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
            Modules
          </p>
          <div className="flex flex-wrap gap-2">
            {modules.map((m) => (
              <Link
                key={m.slug}
                href={`/ventures/${venture.key}/modules/${m.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded font-label text-label-sm text-on-surface hover:border-metallic-gold hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <DecisionsPanel
          ventureId={venture.id}
          ventureKey={venture.key}
          decisions={openDecisions}
        />
        <PrioritiesPanel
          ventureId={venture.id}
          ventureKey={venture.key}
          priorities={venture.priorities}
        />
        <div className="lg:col-span-2">
          <DocumentsPanel
            ventureId={venture.id}
            ventureKey={venture.key}
            documents={venture.documents}
          />
        </div>
      </div>

      {resolvedDecisions.length > 0 ? (
        <div className="mt-6">
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
            Resolved decisions ({resolvedDecisions.length})
          </p>
          <ul className="space-y-1">
            {resolvedDecisions.map((d) => (
              <li key={d.id} className="font-body text-body-sm text-slate-gray line-through">
                {d.text}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AppShell>
  );
}
