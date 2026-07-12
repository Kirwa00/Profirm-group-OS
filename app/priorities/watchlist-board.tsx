"use client";

import { useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { addWatchlistItem, removeWatchlistItem } from "./actions";
import { SEVERITY_META } from "@/lib/constants";
import type { WatchlistSeverity } from "@prisma/client";

type Item = { id: string; text: string; severity: WatchlistSeverity; note: string };

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-2 bg-surface-container text-on-surface rounded font-label text-label-sm hover:bg-surface-container-high disabled:opacity-60"
    >
      Add
    </button>
  );
}

function RemoveButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => removeWatchlistItem(id))}
      disabled={isPending}
      className="material-symbols-outlined text-base text-slate-gray hover:text-error disabled:opacity-60"
      title="Remove"
    >
      close
    </button>
  );
}

export default function WatchlistBoard({ items }: { items: Item[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">
        Cross-Venture Watchlist
      </h2>
      <p className="font-body text-body-sm text-slate-gray mb-4">
        Blockers, dependencies, and risks that touch more than one venture.
      </p>
      <div className="space-y-3 mb-4">
        {items.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">Watchlist is clear.</p>
        ) : (
          items.map((item) => {
            const severity = SEVERITY_META[item.severity];
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 border border-outline-variant rounded p-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-label text-label-sm px-2 py-0.5 rounded uppercase tracking-wide ${severity.className}`}
                    >
                      {severity.label}
                    </span>
                    <p className="font-body text-body-sm text-on-surface font-medium">{item.text}</p>
                  </div>
                  {item.note ? (
                    <p className="font-body text-body-sm text-slate-gray">{item.note}</p>
                  ) : null}
                </div>
                <RemoveButton id={item.id} />
              </div>
            );
          })
        )}
      </div>
      <form
        ref={formRef}
        action={async (formData) => {
          await addWatchlistItem(formData);
          formRef.current?.reset();
        }}
        className="space-y-2"
      >
        <div className="flex gap-2">
          <input
            name="text"
            placeholder="Risk or blocker…"
            required
            className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
          />
          <select
            name="severity"
            defaultValue="MEDIUM"
            className="border border-outline-variant rounded px-2 py-2 font-label text-label-sm bg-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            name="note"
            placeholder="Optional note"
            className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
          />
          <AddButton />
        </div>
      </form>
    </div>
  );
}
