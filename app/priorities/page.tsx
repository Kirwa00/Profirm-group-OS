import Link from "next/link";
import AppShell from "@/components/app-shell";
import { prisma, isDbConfigured, safeQuery } from "@/lib/prisma";
import PrioritiesBoard from "./priorities-board";
import WatchlistBoard from "./watchlist-board";
import TodoBoard from "./todo-board";
import NotesBoard from "./notes-board";

const TABS = [
  { key: "todo", label: "To-do", icon: "checklist" },
  { key: "notes", label: "Notes", icon: "sticky_note_2" },
  { key: "priorities", label: "Priorities", icon: "flag" },
  { key: "watchlist", label: "Watchlist", icon: "visibility" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function parseTab(value: string | undefined): TabKey {
  return TABS.some((t) => t.key === value) ? (value as TabKey) : "todo";
}

export default async function PrioritiesPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const dbReady = isDbConfigured();
  const tab = parseTab(searchParams.tab);

  // Only load what the active tab shows. The tab lives in the URL (?tab=notes)
  // so it survives refreshes and can be bookmarked.
  const [todos, notes, priorities, watchlist] = await Promise.all([
    tab === "todo"
      ? safeQuery(() => prisma.todo.findMany({ orderBy: { createdAt: "asc" } }), [])
      : [],
    tab === "notes"
      ? safeQuery(
          () => prisma.note.findMany({ orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] }),
          [],
        )
      : [],
    tab === "priorities"
      ? safeQuery(
          () =>
            prisma.crossVenturePriority.findMany({
              orderBy: [{ isDone: "asc" }, { rank: "asc" }],
            }),
          [],
        )
      : [],
    tab === "watchlist"
      ? safeQuery(() => prisma.watchlistItem.findMany({ orderBy: { createdAt: "desc" } }), [])
      : [],
  ]);

  return (
    <AppShell>
      <h1 className="font-headline text-display-lg text-deep-navy mb-2">
        Priorities &amp; Watchlist
      </h1>
      <p className="font-body text-body-lg text-slate-gray mb-6 max-w-2xl">
        Your to-dos and notes, plus what matters across every venture.
      </p>

      <nav
        aria-label="Sections"
        className="flex border-b border-outline-variant mb-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Link
              key={t.key}
              href={t.key === "todo" ? "/priorities" : `/priorities?tab=${t.key}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-3 -mb-px border-b-2 whitespace-nowrap font-label text-label-sm sm:text-label-md transition-colors ${
                active
                  ? "border-metallic-gold text-deep-navy font-bold"
                  : "border-transparent text-slate-gray hover:text-primary"
              }`}
            >
              {/* Wrapper carries the breakpoint: .material-symbols-outlined sets its
                  own display, which would override `hidden` on the icon itself. */}
              <span className="hidden sm:inline-flex">
                <span className="material-symbols-outlined text-lg">{t.icon}</span>
              </span>
              {t.label}
            </Link>
          );
        })}
      </nav>

      {!dbReady ? (
        <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6 mb-8">
          <p className="font-body text-body-md text-on-surface-variant">
            Database not connected — see the setup banner on the dashboard.
          </p>
        </div>
      ) : tab === "todo" ? (
        <TodoBoard
          todos={todos.map((t) => ({
            id: t.id,
            text: t.text,
            isDone: t.isDone,
            dueDate: t.dueDate ? t.dueDate.toISOString() : null,
          }))}
        />
      ) : tab === "notes" ? (
        <NotesBoard
          notes={notes.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            pinned: n.pinned,
            updatedAt: n.updatedAt.toISOString(),
          }))}
        />
      ) : tab === "priorities" ? (
        <div className="max-w-3xl">
          <PrioritiesBoard items={priorities} />
        </div>
      ) : (
        <div className="max-w-3xl">
          <WatchlistBoard items={watchlist} />
        </div>
      )}
    </AppShell>
  );
}
