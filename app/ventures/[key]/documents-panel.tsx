"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addKeyDocument } from "../actions";

type Doc = { id: string; title: string; url: string };

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

export default function DocumentsPanel({
  ventureId,
  ventureKey,
  documents,
}: {
  ventureId: string;
  ventureKey: string;
  documents: Doc[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const addDocWithVenture = addKeyDocument.bind(null, ventureId, ventureKey);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">Key Documents</h2>
      <div className="space-y-2 mb-4">
        {documents.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No documents linked yet.</p>
        ) : (
          documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body text-body-sm text-primary hover:text-metallic-gold"
            >
              <span className="material-symbols-outlined text-base">description</span>
              {doc.title}
            </a>
          ))
        )}
      </div>
      <form
        ref={formRef}
        action={async (formData) => {
          await addDocWithVenture(formData);
          formRef.current?.reset();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          name="title"
          placeholder="Document title"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <input
          name="url"
          placeholder="URL or path"
          required
          className="flex-1 border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none"
        />
        <AddButton />
      </form>
    </div>
  );
}
