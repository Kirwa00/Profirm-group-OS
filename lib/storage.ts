// Shared storage constants + helpers. No imports — safe to use from both
// Server Actions and Client Components.

export const DOCUMENTS_BUCKET = "venture-documents";

// Max upload size, enforced client-side before requesting a signed URL and
// echoed in the panel's helper text. Supabase's own per-bucket limit (set in
// the dashboard) is the real ceiling.
export const MAX_DOCUMENT_BYTES = 12 * 1024 * 1024; // 12 MB

// Turn an arbitrary filename into a storage-key-safe segment: keep letters,
// digits, dot, dash, underscore; collapse everything else to "-". Supabase
// object keys choke on many punctuation/space characters otherwise.
export function sanitizeFilename(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 120);
  return cleaned || "file";
}
