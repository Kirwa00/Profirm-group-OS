"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createVenture } from "../actions";
import { CATEGORY_META, STATUS_META } from "@/lib/constants";
import type { VentureCategory, VentureStatus } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-primary text-on-primary rounded font-label text-label-md hover:bg-deep-navy transition-colors disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create Venture"}
    </button>
  );
}

export default function NewVentureForm() {
  const [state, formAction] = useFormState(createVenture, {});

  return (
    <form action={formAction} className="space-y-5 bg-surface-container-lowest border border-outline-variant p-6">
      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div>
          <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
            Emoji
          </label>
          <input
            name="emoji"
            defaultValue="🚀"
            className="w-full border border-outline-variant rounded px-3 py-2 text-center text-xl"
          />
        </div>
        <div>
          <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
            Venture Name
          </label>
          <input
            name="name"
            required
            placeholder="e.g. Migingo Gold Project"
            className="w-full border border-outline-variant rounded px-3 py-2 font-body text-body-md focus:border-deep-navy focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full border border-outline-variant rounded px-3 py-2 font-body text-body-md focus:border-deep-navy focus:outline-none bg-white"
          >
            <option value="" disabled>
              Select category
            </option>
            {(Object.entries(CATEGORY_META) as [VentureCategory, { label: string }][]).map(
              ([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
            Status
          </label>
          <select
            name="status"
            defaultValue="IDEA"
            className="w-full border border-outline-variant rounded px-3 py-2 font-body text-body-md focus:border-deep-navy focus:outline-none bg-white"
          >
            {(Object.entries(STATUS_META) as [VentureStatus, { label: string }][]).map(
              ([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide block mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="One or two sentences on what this venture is."
          className="w-full border border-outline-variant rounded px-3 py-2 font-body text-body-md focus:border-deep-navy focus:outline-none"
        />
      </div>

      {state?.error ? <p className="text-error text-body-sm font-body">{state.error}</p> : null}

      <SubmitButton />
    </form>
  );
}
