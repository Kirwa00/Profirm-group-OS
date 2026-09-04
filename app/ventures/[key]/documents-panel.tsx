"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  addKeyDocument,
  createDocumentUploadUrl,
  deleteKeyDocument,
  saveUploadedDocument,
} from "../actions";
import { DOCUMENTS_BUCKET, MAX_DOCUMENT_BYTES } from "@/lib/storage";

type Doc = {
  id: string;
  title: string;
  url: string | null;
  type: string;
  size: number | null;
  contentType: string | null;
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

function formatSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(doc: Doc) {
  if (doc.type !== "file") return "link";
  const ct = doc.contentType ?? "";
  if (ct.startsWith("image/")) return "image";
  if (ct === "application/pdf") return "picture_as_pdf";
  if (ct.includes("sheet") || ct.includes("excel") || ct === "text/csv") return "table";
  return "description";
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
  const linkFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const addDocWithVenture = addKeyDocument.bind(null, ventureId, ventureKey);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  // Load supabase-js only when an upload actually happens — keeps ~30 KB off
  // the venture page's initial bundle.
  async function getSupabase(): Promise<SupabaseClient | null> {
    if (supabaseRef.current) return supabaseRef.current;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    const { createClient } = await import("@supabase/supabase-js");
    supabaseRef.current = createClient(url, anonKey, { auth: { persistSession: false } });
    return supabaseRef.current;
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    const supabase = await getSupabase();
    if (!supabase) {
      setError("Uploads aren't configured — set NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      for (const file of list) {
        if (file.size > MAX_DOCUMENT_BYTES) {
          setError(`"${file.name}" is larger than 12 MB and was skipped.`);
          continue;
        }
        const signed = await createDocumentUploadUrl(ventureKey, file.name);
        if ("error" in signed) {
          setError(signed.error);
          continue;
        }
        const { error: upErr } = await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .uploadToSignedUrl(signed.path, signed.token, file, {
            contentType: file.type || undefined,
          });
        if (upErr) {
          setError(`Upload of "${file.name}" failed: ${upErr.message}`);
          continue;
        }
        await saveUploadedDocument(ventureId, ventureKey, {
          title: file.name,
          path: signed.path,
          size: file.size,
          contentType: file.type || "application/octet-stream",
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-5">
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">Key Documents</h2>

      <div className="space-y-2 mb-4">
        {documents.length === 0 ? (
          <p className="font-body text-body-sm text-slate-gray">No documents yet.</p>
        ) : (
          documents.map((doc) => {
            const size = formatSize(doc.size);
            const label = (
              <>
                <span className="material-symbols-outlined text-base shrink-0">{iconFor(doc)}</span>
                <span className="truncate">{doc.title}</span>
              </>
            );
            return (
              <div key={doc.id} className="flex items-center gap-2 group">
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-body text-body-sm text-primary hover:text-metallic-gold min-w-0"
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    title="Link unavailable"
                    className="flex items-center gap-2 font-body text-body-sm text-slate-gray min-w-0"
                  >
                    {label}
                  </span>
                )}
                {size ? (
                  <span className="font-label text-label-sm text-slate-gray whitespace-nowrap">
                    {size}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove "${doc.title}"?`)) {
                      void deleteKeyDocument(doc.id, ventureKey);
                    }
                  }}
                  aria-label={`Remove ${doc.title}`}
                  className="ml-auto shrink-0 text-slate-gray hover:text-error opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-1 border border-dashed rounded px-3 py-5 mb-4 cursor-pointer transition-colors ${
          dragOver ? "border-metallic-gold bg-surface-container" : "border-outline-variant"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <span className="material-symbols-outlined text-slate-gray">
          {uploading ? "progress_activity" : "upload_file"}
        </span>
        <span className="font-body text-body-sm text-slate-gray text-center">
          {uploading ? "Uploading…" : "Drop files here or click to upload"}
        </span>
        <span className="font-label text-label-sm text-slate-gray">
          PDF, Office, images, CSV — up to 12 MB
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
          }}
          className="hidden"
        />
      </label>

      {error ? <p className="font-body text-body-sm text-error mb-4">{error}</p> : null}

      <p className="font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
        Or link an external document
      </p>
      <form
        ref={linkFormRef}
        action={async (formData) => {
          await addDocWithVenture(formData);
          linkFormRef.current?.reset();
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
