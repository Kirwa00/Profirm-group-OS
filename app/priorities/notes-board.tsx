"use client";

import { useEffect, useState, useTransition } from "react";
import { createNote, deleteNote, toggleNotePinned, updateNote } from "./actions";

type Note = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  updatedAt: string;
};

const inputClass =
  "w-full border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none disabled:opacity-60";

// Create and edit share one editor: pass `note` to edit, omit it to compose.
function NoteEditor({
  note,
  onDone,
}: {
  note?: Note;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = note
        ? await updateNote(note.id, { title, body })
        : await createNote({ title, body });
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form
      onSubmit={save}
      onKeyDown={(e) => e.key === "Escape" && !isPending && onDone()}
      className="space-y-2"
    >
      <input
        autoFocus={!note}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        maxLength={200}
        disabled={isPending}
        aria-label="Note title"
        className={`${inputClass} font-headline font-semibold`}
      />
      <textarea
        autoFocus={!!note}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your note…"
        rows={Math.min(14, Math.max(5, body.split("\n").length + 1))}
        maxLength={20000}
        disabled={isPending}
        aria-label="Note body"
        className={`${inputClass} resize-y leading-relaxed`}
      />
      {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || (!title.trim() && !body.trim())}
          className="px-3 py-2 bg-deep-navy text-white rounded font-label text-label-sm hover:bg-primary-container disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="px-3 py-2 bg-surface-container text-on-surface rounded font-label text-label-sm hover:bg-surface-container-high disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  // "Last edited" is shown in the viewer's own time zone and locale, which the
  // server can't know — fill it in after mount so server and client HTML match.
  const [updated, setUpdated] = useState("");
  useEffect(() => {
    setUpdated(
      new Date(note.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    );
  }, [note.updatedAt]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(fn: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
    });
  }

  if (editing) {
    return (
      <div className="bg-surface-container-lowest border border-deep-navy p-4 rounded">
        <NoteEditor note={note} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <article
      className={`group bg-surface-container-lowest border p-4 rounded flex flex-col ${
        note.pinned ? "border-metallic-gold" : "border-outline-variant"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <h3 className="flex-1 min-w-0 font-headline text-body-md font-semibold text-on-surface break-words">
          {note.title || <span className="text-slate-gray font-normal italic">Untitled</span>}
        </h3>
        <button
          type="button"
          onClick={() => run(() => toggleNotePinned(note.id, note.pinned))}
          disabled={isPending}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          title={note.pinned ? "Unpin" : "Pin to top"}
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container ${
            note.pinned ? "text-metallic-gold" : "text-slate-gray hover:text-primary"
          }`}
        >
          <span
            className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: `'FILL' ${note.pinned ? 1 : 0}` }}
          >
            push_pin
          </span>
        </button>
      </div>

      {note.body ? (
        <p className="font-body text-body-sm text-on-surface-variant whitespace-pre-wrap break-words line-clamp-[10] flex-1">
          {note.body}
        </p>
      ) : null}

      {error ? <p className="font-body text-body-sm text-error mt-2">{error}</p> : null}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant">
        <span className="font-label text-label-sm text-slate-gray">{updated}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit note"
            title="Edit"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-gray hover:text-primary hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete ${note.title ? `"${note.title}"` : "this note"}?`)) {
                run(() => deleteNote(note.id));
              }
            }}
            disabled={isPending}
            aria-label="Delete note"
            title="Delete"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-gray hover:text-error hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function NotesBoard({ notes }: { notes: Note[] }) {
  const [composing, setComposing] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? notes.filter((n) => `${n.title}\n${n.body}`.toLowerCase().includes(q))
    : notes;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="flex-1 flex items-center bg-surface-container-lowest border border-outline-variant rounded px-3">
          <span className="material-symbols-outlined text-slate-gray text-lg">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes"
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-2 font-body text-body-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setComposing(true)}
          disabled={composing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-deep-navy text-white rounded font-label text-label-sm hover:bg-primary-container disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New note
        </button>
      </div>

      {composing ? (
        <div className="bg-surface-container-lowest border border-deep-navy p-4 rounded mb-4 max-w-3xl">
          <NoteEditor onDone={() => setComposing(false)} />
        </div>
      ) : null}

      {notes.length === 0 && !composing ? (
        <p className="font-body text-body-sm text-slate-gray">
          No notes yet. Hit <strong>New note</strong> to jot something down.
        </p>
      ) : visible.length === 0 && !composing ? (
        <p className="font-body text-body-sm text-slate-gray">No notes match “{query}”.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {visible.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
