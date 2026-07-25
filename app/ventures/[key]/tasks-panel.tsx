"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import ToggleCheckbox from "@/components/toggle-checkbox";
import { addTask, toggleTask } from "../actions";

type Task = {
  id: string;
  text: string;
  isDone: boolean;
  dueDate: string | null;
  completedAt: string | null;
};

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TasksPanel({
  ventureId,
  ventureKey,
  tasks,
}: {
  ventureId: string;
  ventureKey: string;
  tasks: Task[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const addTaskWithVenture = addTask.bind(null, ventureId, ventureKey);

  const open = tasks.filter((t) => !t.isDone);
  const done = tasks.filter((t) => t.isDone);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">Tasks</h2>

      <div className="space-y-3 mb-4">
        {open.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No open tasks.</p>
        ) : (
          open.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-2">
              <ToggleCheckbox
                checked={t.isDone}
                label={t.text}
                onToggle={() => toggleTask(t.id, ventureKey, t.isDone)}
              />
              {t.dueDate ? (
                <span className="font-label text-label-sm text-slate-gray whitespace-nowrap mt-0.5">
                  Due {formatDate(t.dueDate)}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>

      <form
        ref={formRef}
        action={async (formData) => {
          await addTaskWithVenture(formData);
          formRef.current?.reset();
        }}
        className="flex gap-2 mb-5"
      >
        <input
          name="text"
          placeholder="New task…"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <input
          name="dueDate"
          type="date"
          className="border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <AddButton />
      </form>

      {done.length > 0 ? (
        <div>
          <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
            Done ({done.length})
          </p>
          <ul className="space-y-1">
            {done.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 font-body text-body-sm text-slate-gray"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(t.id, ventureKey, t.isDone)}
                  className="line-through text-left hover:text-on-surface"
                >
                  {t.text}
                </button>
                {t.completedAt ? (
                  <span className="font-label text-label-sm whitespace-nowrap">
                    {formatDate(t.completedAt)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
