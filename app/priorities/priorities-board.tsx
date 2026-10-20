"use client";

import { useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import ToggleCheckbox from "@/components/toggle-checkbox";
import {
  addCrossVenturePriority,
  deleteCrossVenturePriority,
  toggleCrossVenturePriority,
} from "./actions";

type Item = { id: string; text: string; isDone: boolean };

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
      type="button"
      onClick={() => startTransition(() => deleteCrossVenturePriority(id))}
      disabled={isPending}
      aria-label="Remove priority"
      title="Remove"
      className="shrink-0 material-symbols-outlined text-base text-slate-gray hover:text-error disabled:opacity-60"
    >
      close
    </button>
  );
}

export default function PrioritiesBoard({ items }: { items: Item[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">
        Cross-Venture Priorities This Week
      </h2>
      <div className="space-y-3 mb-4">
        {items.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">Nothing on the board yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <ToggleCheckbox
                checked={item.isDone}
                label={item.text}
                onToggle={() => toggleCrossVenturePriority(item.id, item.isDone)}
              />
              <RemoveButton id={item.id} />
            </div>
          ))
        )}
      </div>
      <form
        ref={formRef}
        action={async (formData) => {
          await addCrossVenturePriority(formData);
          formRef.current?.reset();
        }}
        className="flex gap-2"
      >
        <input
          name="text"
          placeholder="Add a cross-venture priority…"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <AddButton />
      </form>
    </div>
  );
}
