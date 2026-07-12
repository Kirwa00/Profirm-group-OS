"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import ToggleCheckbox from "@/components/toggle-checkbox";
import { addDecision, toggleDecision } from "../actions";

type Decision = { id: string; text: string; isOpen: boolean };

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

export default function DecisionsPanel({
  ventureId,
  ventureKey,
  decisions,
}: {
  ventureId: string;
  ventureKey: string;
  decisions: Decision[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const addDecisionWithVenture = addDecision.bind(null, ventureId, ventureKey);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">Open Decisions</h2>
      <div className="space-y-3 mb-4">
        {decisions.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No open decisions.</p>
        ) : (
          decisions.map((d) => (
            <ToggleCheckbox
              key={d.id}
              checked={!d.isOpen}
              label={d.text}
              onToggle={() => toggleDecision(d.id, ventureKey, d.isOpen)}
            />
          ))
        )}
      </div>
      <form
        ref={formRef}
        action={async (formData) => {
          await addDecisionWithVenture(formData);
          formRef.current?.reset();
        }}
        className="flex gap-2"
      >
        <input
          name="text"
          placeholder="New decision to make…"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <AddButton />
      </form>
    </div>
  );
}
