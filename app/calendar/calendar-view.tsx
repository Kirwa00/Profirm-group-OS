"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ventureColor } from "@/lib/venture-colors";

type Task = {
  id: string;
  text: string;
  isDone: boolean;
  dueDate: string | null;
  completedAt: string | null;
  venture: { key: string; name: string; emoji: string };
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Buckets by the UTC calendar date, matching how <input type="date"> values
// are parsed (new Date("2026-07-25") -> UTC midnight) so a task picked for a
// given day lands on that same day in the grid regardless of local offset.
function dateKey(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const todayKey = dateKey(new Date().toISOString());

  const { doneByDate, dueByDate, doneCountByVenture } = useMemo(() => {
    const doneByDate = new Map<string, Task[]>();
    const dueByDate = new Map<string, Task[]>();
    const doneCountByVenture = new Map<string, { name: string; emoji: string; count: number }>();

    for (const t of tasks) {
      if (t.completedAt) {
        const key = dateKey(t.completedAt);
        doneByDate.set(key, [...(doneByDate.get(key) ?? []), t]);

        const [y, m] = key.split("-").map(Number);
        if (y === year && m === month + 1) {
          const entry = doneCountByVenture.get(t.venture.key) ?? {
            name: t.venture.name,
            emoji: t.venture.emoji,
            count: 0,
          };
          entry.count += 1;
          doneCountByVenture.set(t.venture.key, entry);
        }
      } else if (t.dueDate) {
        const key = dateKey(t.dueDate);
        dueByDate.set(key, [...(dueByDate.get(key) ?? []), t]);
      }
    }
    return { doneByDate, dueByDate, doneCountByVenture };
  }, [tasks, year, month]);

  const ventureBreakdown = useMemo(
    () => Array.from(doneCountByVenture.entries()).sort((a, b) => b[1].count - a[1].count),
    [doneCountByVenture]
  );

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const day = i - firstWeekday + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  }, [year, month]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <div className="bg-surface-container-lowest border border-outline-variant p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-body-lg font-bold text-on-surface">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="p-1.5 rounded hover:bg-surface-container-high"
              aria-label="Previous month"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
              className="px-2 py-1 font-label text-label-sm text-slate-gray hover:text-on-surface"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="p-1.5 rounded hover:bg-surface-container-high"
              aria-label="Next month"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-outline-variant border border-outline-variant">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="bg-surface-container py-2 text-center font-label text-label-sm text-slate-gray"
            >
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={i} className="bg-surface-container-lowest min-h-24" />;
            }
            const key = `${year}-${pad(month + 1)}-${pad(day)}`;
            const done = doneByDate.get(key) ?? [];
            const due = dueByDate.get(key) ?? [];
            const items = [...done, ...due];
            const overflow = items.length - 3;

            return (
              <div key={i} className="bg-surface-container-lowest min-h-24 p-1.5">
                <span
                  className={`font-label text-label-sm inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    key === todayKey
                      ? "bg-deep-navy text-white"
                      : "text-on-surface-variant"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {items.slice(0, 3).map((t) => {
                    const color = ventureColor(t.venture.key);
                    return (
                      <Link
                        key={t.id}
                        href={`/ventures/${t.venture.key}`}
                        title={t.text}
                        className={`block truncate px-1.5 py-0.5 rounded font-body text-body-sm border ${color.chip} ${
                          t.isDone ? "line-through opacity-80" : "border-dashed"
                        }`}
                      >
                        {t.venture.emoji} {t.text}
                      </Link>
                    );
                  })}
                  {overflow > 0 ? (
                    <p className="font-label text-label-sm text-slate-gray px-1.5">
                      +{overflow} more
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 font-label text-label-sm text-slate-gray">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-slate-gray/60 border-dashed" />
            Due / pending
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-gray/30" />
            Done
          </span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-5 h-fit">
        <h3 className="font-headline text-body-lg font-bold text-on-surface mb-1">
          This month, by venture
        </h3>
        <p className="font-body text-body-sm text-slate-gray mb-4">
          Tasks completed in {monthLabel} — a proxy for where effort went.
        </p>
        {ventureBreakdown.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No tasks completed yet.</p>
        ) : (
          <ul className="space-y-3">
            {ventureBreakdown.map(([key, v]) => {
              const color = ventureColor(key);
              const max = ventureBreakdown[0][1].count;
              return (
                <li key={key}>
                  <Link
                    href={`/ventures/${key}`}
                    className="flex items-center justify-between gap-2 font-body text-body-sm text-on-surface hover:text-primary mb-1"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.dot}`} />
                      {v.emoji} {v.name}
                    </span>
                    <span className="font-label text-label-sm text-slate-gray shrink-0">
                      {v.count}
                    </span>
                  </Link>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.dot}`}
                      style={{ width: `${(v.count / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
