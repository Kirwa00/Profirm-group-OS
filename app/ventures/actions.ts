"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { isStorageConfigured, supabaseAdmin, ensureDocumentsBucket } from "@/lib/supabase";
import { DOCUMENTS_BUCKET, sanitizeFilename } from "@/lib/storage";
import type { VentureCategory, VentureStatus } from "@prisma/client";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createVenture(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  if (!isDbConfigured()) return { error: "Database not connected." };

  const name = String(formData.get("name") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "📁").trim() || "📁";
  const category = String(formData.get("category") ?? "") as VentureCategory;
  const status = String(formData.get("status") ?? "IDEA") as VentureStatus;
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !category) return { error: "Name and category are required." };

  const key = slugify(name);
  const existing = await prisma.venture.findUnique({ where: { key } });
  if (existing) return { error: "A venture with a similar name already exists." };

  await prisma.venture.create({
    data: { key, name, emoji, category, status, description },
  });

  revalidatePath("/");
  redirect(`/ventures/${key}`);
}

export async function updateVentureStatus(key: string, status: VentureStatus) {
  if (!isDbConfigured()) return;
  await prisma.venture.update({ where: { key }, data: { status } });
  revalidatePath("/");
  revalidatePath(`/ventures/${key}`);
}

export async function updateVentureDescription(key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const description = String(formData.get("description") ?? "").trim();
  await prisma.venture.update({ where: { key }, data: { description } });
  revalidatePath(`/ventures/${key}`);
}

export async function addDecision(ventureId: string, key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  await prisma.decision.create({ data: { ventureId, text } });
  revalidatePath(`/ventures/${key}`);
}

export async function toggleDecision(id: string, key: string, isOpen: boolean) {
  if (!isDbConfigured()) return;
  await prisma.decision.update({
    where: { id },
    data: { isOpen: !isOpen, resolvedAt: !isOpen ? null : new Date() },
  });
  revalidatePath(`/ventures/${key}`);
}

export async function addPriority(ventureId: string, key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const count = await prisma.priority.count({ where: { ventureId, isDone: false } });
  await prisma.priority.create({ data: { ventureId, text, rank: count } });
  revalidatePath(`/ventures/${key}`);
}

export async function togglePriority(id: string, key: string, isDone: boolean) {
  if (!isDbConfigured()) return;
  await prisma.priority.update({ where: { id }, data: { isDone: !isDone } });
  revalidatePath(`/ventures/${key}`);
}

export async function addTask(ventureId: string, key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  await prisma.task.create({
    data: { ventureId, text, dueDate: dueDateRaw ? new Date(dueDateRaw) : null },
  });
  revalidatePath(`/ventures/${key}`);
  revalidatePath("/calendar");
}

export async function toggleTask(id: string, key: string, isDone: boolean) {
  if (!isDbConfigured()) return;
  await prisma.task.update({
    where: { id },
    data: { isDone: !isDone, completedAt: !isDone ? new Date() : null },
  });
  revalidatePath(`/ventures/${key}`);
  revalidatePath("/calendar");
}

export async function addKeyDocument(ventureId: string, key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!title || !url) return;
  await prisma.keyDocument.create({ data: { ventureId, title, url, type: "link" } });
  revalidatePath(`/ventures/${key}`);
}

// Step 1 of a file upload: mint a one-shot signed URL the browser PUTs the file
// straight to (bypasses Vercel's 4.5 MB Server Action body limit). Returns the
// storage path + token, or an { error } the panel can surface.
export async function createDocumentUploadUrl(
  ventureKey: string,
  filename: string,
): Promise<{ path: string; token: string } | { error: string }> {
  if (!isStorageConfigured()) {
    return { error: "Document storage isn't configured (Supabase env vars missing)." };
  }
  const client = supabaseAdmin();
  if (!client) return { error: "Document storage isn't configured." };

  try {
    await ensureDocumentsBucket(client);
  } catch (err) {
    console.error("[storage] ensure bucket failed:", err instanceof Error ? err.message : err);
    return { error: "Could not access the storage bucket." };
  }

  const safeName = sanitizeFilename(filename);
  const path = `ventures/${ventureKey}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await client.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[storage] signed upload url failed:", error?.message);
    return { error: "Could not start the upload." };
  }
  return { path: data.path, token: data.token };
}

// Step 2: record the KeyDocument row once the browser upload has finished.
export async function saveUploadedDocument(
  ventureId: string,
  key: string,
  data: { title: string; path: string; size: number; contentType: string },
) {
  if (!isDbConfigured()) return;
  const title = data.title.trim();
  if (!title || !data.path) return;
  await prisma.keyDocument.create({
    data: {
      ventureId,
      title,
      // For files, `url` mirrors the storage path; the venture page swaps in a
      // fresh signed download URL at render time.
      url: data.path,
      type: "file",
      pathname: data.path,
      size: Number.isFinite(data.size) ? Math.trunc(data.size) : null,
      contentType: data.contentType || null,
    },
  });
  revalidatePath(`/ventures/${key}`);
}

export async function deleteKeyDocument(id: string, key: string) {
  if (!isDbConfigured()) return;
  const doc = await prisma.keyDocument.findUnique({ where: { id } });
  if (!doc) return;
  // Remove the stored object first; a failure here shouldn't block the row
  // delete (the object may already be gone), so just log and continue.
  if (doc.type === "file" && doc.pathname) {
    const client = supabaseAdmin();
    if (client) {
      const { error } = await client.storage.from(DOCUMENTS_BUCKET).remove([doc.pathname]);
      if (error) {
        console.error("[storage] delete failed:", error.message);
      }
    }
  }
  await prisma.keyDocument.delete({ where: { id } });
  revalidatePath(`/ventures/${key}`);
}
