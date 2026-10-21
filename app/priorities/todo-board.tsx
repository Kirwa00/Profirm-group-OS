"use client";

import { useEffect, useState, useTransition } from "react";
import {
  addTodo,
  clearCompletedTodos,
  deleteTodo,
  toggleTodo,
  updateTodo,
} from "./actions";

type Todo = {
  id: string;
  text: string;
  isDone: boolean;
  dueDate: string | null; // ISO, stored as UTC midnight of the chosen day
};

// Due dates are plain calendar days stored at UTC midnight, so read and show
// them in UTC — otherwise they can slip a day depending on the viewer's zone.
// The locale is fixed too: this renders on the server, and a server/browser
// locale difference ("Oct 18" vs "18 Oct") causes a React hydration mismatch.
const dayOf = (iso: string) => iso.slice(0, 10);
const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const inputClass =
  "border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none disabled:opacity-60";

function TodoRow({
  todo,
  today,
  onError,
}: {
  todo: Todo;
  today: string | null;
  onError: (msg: string | null) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [due, setDue] = useState(todo.dueDate ? dayOf(todo.dueDate) : "");

  const overdue = !todo.isDone && today !== null && todo.dueDate !== null && dayOf(todo.dueDate) < today;
  const dueToday = !todo.isDone && today !== null && todo.dueDate !== null && dayOf(todo.dueDate) === today;

  function run(fn: () => Promise<{ error?: string }>, after?: () => void) {
    onError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) onError(res.error);
      else after?.();
    });
  }

  function startEdit() {
    setText(todo.text);
    setDue(todo.dueDate ? dayOf(todo.dueDate) : "");
    setEditing(true);
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => updateTodo(todo.id, { text, dueDate: due }), () => setEditing(false));
        }}
        className="flex flex-col sm:flex-row gap-2 py-1"
      >
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
          maxLength={500}
          disabled={isPending}
          aria-label="To-do text"
          className={`${inputClass} flex-1`}
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          disabled={isPending}
          aria-label="Due date"
          className={inputClass}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending || !text.trim()}
            className="px-3 py-2 bg-deep-navy text-white rounded font-label text-label-sm disabled:opacity-60"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={isPending}
            className="px-3 py-2 bg-surface-container text-on-surface rounded font-label text-label-sm disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`group flex items-start gap-3 ${isPending ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={() => run(() => toggleTodo(todo.id, todo.isDone))}
        disabled={isPending}
        aria-label={todo.isDone ? "Mark as not done" : "Mark as done"}
        className="shrink-0 mt-0.5"
      >
        <span
          className={`material-symbols-outlined text-lg ${
            todo.isDone ? "text-success-green" : "text-slate-gray hover:text-primary"
          }`}
        >
          {todo.isDone ? "check_box" : "check_box_outline_blank"}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`font-body text-body-sm break-words ${
            todo.isDone ? "line-through text-slate-gray" : "text-on-surface"
          }`}
        >
          {todo.text}
        </p>
        {todo.dueDate ? (
          <p
            className={`font-label text-label-sm mt-0.5 ${
              overdue ? "text-error" : dueToday ? "text-warning-amber" : "text-slate-gray"
            }`}
          >
            {overdue ? "Overdue · " : dueToday ? "Today · " : "Due "}
            {formatDay(todo.dueDate)}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
        {!todo.isDone ? (
          <button
            type="button"
            onClick={startEdit}
            aria-label="Edit to-do"
            title="Edit"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-gray hover:text-primary hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => run(() => deleteTodo(todo.id))}
          disabled={isPending}
          aria-label="Delete to-do"
          title="Delete"
          className="w-8 h-8 flex items-center justify-center rounded text-slate-gray hover:text-error hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
}

export default function TodoBoard({ todos }: { todos: Todo[] }) {
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, startAdding] = useTransition();
  const [isClearing, startClearing] = useTransition();
  const [showDone, setShowDone] = useState(true);
  // Set after mount so the server render and first client render agree.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayLocal()), []);

  // Open items: dated ones first (soonest on top), then undated in creation order.
  const open = todos
    .filter((t) => !t.isDone)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  const done = todos.filter((t) => t.isDone);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startAdding(async () => {
      const res = await addTodo({ text, dueDate: due });
      if (res.error) setError(res.error);
      else {
        setText("");
        setDue("");
      }
    });
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5 max-w-3xl">
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a to-do…"
          maxLength={500}
          disabled={isAdding}
          aria-label="New to-do"
          className={`${inputClass} flex-1`}
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          disabled={isAdding}
          aria-label="Due date (optional)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={isAdding || !text.trim()}
          className="px-4 py-2 bg-deep-navy text-white rounded font-label text-label-sm hover:bg-primary-container disabled:opacity-60"
        >
          {isAdding ? "Adding…" : "Add"}
        </button>
      </form>

      {error ? <p className="font-body text-body-sm text-error mb-4">{error}</p> : null}

      <div className="space-y-3">
        {open.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">
            {todos.length === 0 ? "Nothing here yet. Add your first to-do above." : "All caught up."}
          </p>
        ) : (
          open.map((t) => <TodoRow key={t.id} todo={t} today={today} onError={setError} />)
        )}
      </div>

      {done.length > 0 ? (
        <div className="mt-6 pt-4 border-t border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setShowDone((v) => !v)}
              className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide inline-flex items-center gap-1"
              aria-expanded={showDone}
            >
              <span className="material-symbols-outlined text-base">
                {showDone ? "expand_more" : "chevron_right"}
              </span>
              Done ({done.length})
            </button>
            <button
              type="button"
              disabled={isClearing}
              onClick={() => {
                if (!confirm(`Delete ${done.length} completed to-do${done.length === 1 ? "" : "s"}?`)) return;
                setError(null);
                startClearing(async () => {
                  const res = await clearCompletedTodos();
                  if (res.error) setError(res.error);
                });
              }}
              className="font-label text-label-sm text-slate-gray hover:text-error disabled:opacity-60"
            >
              Clear completed
            </button>
          </div>
          {showDone ? (
            <div className="space-y-3">
              {done.map((t) => (
                <TodoRow key={t.id} todo={t} today={today} onError={setError} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
