import AppShell from "@/components/app-shell";
import { prisma, isDbConfigured, safeQuery } from "@/lib/prisma";
import CalendarView from "./calendar-view";

export default async function CalendarPage() {
  const dbReady = isDbConfigured();

  const tasks = await safeQuery(
    () =>
      prisma.task.findMany({
        include: { venture: { select: { key: true, name: true, emoji: true } } },
        orderBy: { createdAt: "asc" },
      }),
    []
  );

  return (
    <AppShell>
      <h1 className="font-headline text-display-lg text-deep-navy mb-2">Calendar</h1>
      <p className="font-body text-body-lg text-slate-gray mb-8 max-w-2xl">
        A record of work done and due across every venture — an overview of where time and
        energy are actually going.
      </p>

      {!dbReady ? (
        <div className="rounded-lg border border-warning-amber/40 bg-warning-amber/10 p-6 mb-8">
          <p className="font-body text-body-md text-on-surface-variant">
            Database not connected — see the setup banner on the dashboard.
          </p>
        </div>
      ) : (
        <CalendarView
          tasks={tasks.map((t) => ({
            id: t.id,
            text: t.text,
            isDone: t.isDone,
            dueDate: t.dueDate ? t.dueDate.toISOString() : null,
            completedAt: t.completedAt ? t.completedAt.toISOString() : null,
            venture: t.venture,
          }))}
        />
      )}
    </AppShell>
  );
}
