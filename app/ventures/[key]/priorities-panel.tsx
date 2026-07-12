"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import ToggleCheckbox from "@/components/toggle-checkbox";
import { addPriority, togglePriority } from "../actions";

type Priority = { id: string; text: string; isDone: boolean };

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

export default function PrioritiesPanel({
  ventureId,
  ventureKey,
  priorities,
}: {
  ventureId: string;
  ventureKey: string;
  priorities: Priority[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const addPriorityWithVenture = addPriority.bind(null, ventureId, ventureKey);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">Next Priorities</h2>
      <div className="space-y-3 mb-4">
        {priorities.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No priorities set.</p>
        ) : (
          priorities.map((p) => (
            <ToggleCheckbox
              key={p.id}
              checked={p.isDone}
              label={p.text}
              onToggle={() => togglePriority(p.id, ventureKey, p.isDone)}
            />
          ))
        )}
      </div>
      <form
        ref={formRef}
        action={async (formData) => {
          await addPriorityWithVenture(formData);
          formRef.current?.reset();
        }}
        className="flex gap-2"
      >
        <input
          name="text"
          placeholder="New priority…"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <AddButton />
      </form>
    </div>
  );
}
