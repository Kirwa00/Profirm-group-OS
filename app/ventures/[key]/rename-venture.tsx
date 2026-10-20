"use client";

import { useState, useTransition } from "react";
import { renameVenture } from "../actions";

// The venture title with an inline rename. Pencil button swaps the heading for
// an input; Enter saves, Escape cancels.
export default function RenameVenture({
  ventureKey,
  name,
}: {
  ventureKey: string;
  name: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function open() {
    setValue(name);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setError(null);
  }

  function save() {
    startTransition(async () => {
      const res = await renameVenture(ventureKey, value);
      if (res.error) setError(res.error);
      else setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="font-headline text-headline-lg text-deep-navy break-words">{name}</h1>
        <button
          type="button"
          onClick={open}
          aria-label="Rename project"
          title="Rename project"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded text-slate-gray hover:text-primary hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="min-w-0"
    >
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          maxLength={100}
          disabled={isPending}
          aria-label="Project name"
          className="min-w-0 flex-1 border border-outline-variant rounded px-3 py-2 font-headline text-headline-md text-deep-navy focus:border-deep-navy focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="shrink-0 px-3 py-2 bg-deep-navy text-white rounded font-label text-label-sm hover:bg-primary-container disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={isPending}
          className="shrink-0 px-3 py-2 bg-surface-container text-on-surface rounded font-label text-label-sm hover:bg-surface-container-high disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      {error ? <p className="font-body text-body-sm text-error mt-1">{error}</p> : null}
    </form>
  );
}
