"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteVenture } from "../actions";

type Counts = { documents: number; decisions: number; priorities: number; tasks: number };

function plural(n: number, word: string) {
  if (n === 1) return `${n} ${word}`;
  return `${n} ${word.endsWith("y") ? `${word.slice(0, -1)}ies` : `${word}s`}`;
}

// "Danger zone" card + a confirmation dialog that only enables the final
// button once the project's exact name has been typed. The server action
// re-checks the name, so this is a UX guard, not the only one.
export default function DeleteVenture({
  ventureKey,
  name,
  counts,
}: {
  ventureKey: string;
  name: string;
  counts: Counts;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const matches = typed.trim() === name;

  function close() {
    if (isPending) return;
    setOpen(false);
    setTyped("");
    setError(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        setOpen(false);
        setTyped("");
        setError(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, isPending]);

  function confirmDelete() {
    if (!matches) return;
    setError(null);
    startTransition(async () => {
      // On success the action redirects to "/", so we only land back here on error.
      const res = await deleteVenture(ventureKey, typed);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <>
      <section className="mt-10 border border-error/40 rounded bg-error-container/30 p-5">
        <h2 className="font-headline text-body-lg font-bold text-error mb-1">Danger zone</h2>
        <p className="font-body text-body-sm text-on-surface-variant mb-4 max-w-2xl">
          Deleting this project permanently removes it along with its{" "}
          {plural(counts.documents, "document")}, {plural(counts.decisions, "decision")},{" "}
          {plural(counts.priorities, "priority")} and {plural(counts.tasks, "task")}. Uploaded files
          are deleted from storage too. This can&apos;t be undone.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-error text-error rounded font-label text-label-md hover:bg-error hover:text-on-error transition-colors"
        >
          <span className="material-symbols-outlined text-base">delete_forever</span>
          Delete project
        </button>
      </section>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-venture-title"
        >
          <button
            type="button"
            aria-label="Cancel deletion"
            onClick={close}
            className="absolute inset-0 bg-black/50"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmDelete();
            }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded shadow-xl p-6"
          >
            <div className="flex items-center gap-2 text-error mb-3">
              <span className="material-symbols-outlined">warning</span>
              <h3 id="delete-venture-title" className="font-headline text-body-lg font-bold">
                Delete this project?
              </h3>
            </div>
            <p className="font-body text-body-sm text-on-surface-variant mb-4">
              This permanently deletes <strong className="text-on-surface">{name}</strong> and all
              of its data. To confirm, type the project name exactly as shown:
            </p>
            <p className="font-label text-label-md text-on-surface bg-surface-container px-3 py-2 rounded mb-2 break-words select-all">
              {name}
            </p>
            <input
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              disabled={isPending}
              placeholder="Type the project name"
              aria-label="Type the project name to confirm deletion"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full border border-outline-variant rounded px-3 py-2 font-body text-body-md focus:border-error focus:outline-none disabled:opacity-60"
            />
            {error ? <p className="font-body text-body-sm text-error mt-2">{error}</p> : null}
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={close}
                disabled={isPending}
                className="px-4 py-2 bg-surface-container text-on-surface rounded font-label text-label-md hover:bg-surface-container-high disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!matches || isPending}
                className="px-4 py-2 bg-error text-on-error rounded font-label text-label-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
