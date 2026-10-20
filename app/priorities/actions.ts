"use server";

import { revalidatePath } from "next/cache";
import { prisma, isDbConfigured } from "@/lib/prisma";
import type { WatchlistSeverity } from "@prisma/client";

export async function addCrossVenturePriority(formData: FormData) {
  if (!isDbConfigured()) return;
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const count = await prisma.crossVenturePriority.count({ where: { isDone: false } });
  await prisma.crossVenturePriority.create({ data: { text, rank: count } });
  revalidatePath("/priorities");
}

export async function toggleCrossVenturePriority(id: string, isDone: boolean) {
  if (!isDbConfigured()) return;
  await prisma.crossVenturePriority.update({ where: { id }, data: { isDone: !isDone } });
  revalidatePath("/priorities");
}

export async function addWatchlistItem(formData: FormData) {
  if (!isDbConfigured()) return;
  const text = String(formData.get("text") ?? "").trim();
  const severity = String(formData.get("severity") ?? "MEDIUM") as WatchlistSeverity;
  const note = String(formData.get("note") ?? "").trim();
  if (!text) return;
  await prisma.watchlistItem.create({ data: { text, severity, note } });
  revalidatePath("/priorities");
}

export async function removeWatchlistItem(id: string) {
  if (!isDbConfigured()) return;
  await prisma.watchlistItem.delete({ where: { id } });
  revalidatePath("/priorities");
}

export async function deleteCrossVenturePriority(id: string) {
  if (!isDbConfigured()) return;
  await prisma.crossVenturePriority.delete({ where: { id } });
  revalidatePath("/priorities");
}

// ---------------------------------------------------------------------------
// General to-dos and notes (not tied to any venture).
//
// These return { error } instead of throwing: the Todo/Note tables are added by
// a manual SQL step (prisma/sql/), so "table doesn't exist yet" is a realistic
// failure that deserves a readable message rather than a crashed page.
// ---------------------------------------------------------------------------

type Result = { error?: string };

const TABLES_HINT =
  "Couldn't save. If this is a new deployment, run prisma/sql/2026-10-notes-todos.sql in the Supabase SQL Editor first.";

async function run(fn: () => Promise<void>): Promise<Result> {
  if (!isDbConfigured()) return { error: "Database not connected." };
  try {
    await fn();
    revalidatePath("/priorities");
    return {};
  } catch (err) {
    console.error("[priorities] action failed:", err instanceof Error ? err.message : err);
    return { error: TABLES_HINT };
  }
}

const MAX_TODO = 500;
const MAX_NOTE_TITLE = 200;
const MAX_NOTE_BODY = 20000;

function parseDueDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00.000Z`) : null;
}

export async function addTodo(input: { text: string; dueDate?: string }): Promise<Result> {
  const text = input.text.trim();
  if (!text) return { error: "Write something to do first." };
  if (text.length > MAX_TODO) return { error: `Keep it under ${MAX_TODO} characters.` };
  return run(async () => {
    await prisma.todo.create({ data: { text, dueDate: parseDueDate(input.dueDate) } });
  });
}

export async function toggleTodo(id: string, isDone: boolean): Promise<Result> {
  return run(async () => {
    await prisma.todo.update({
      where: { id },
      data: { isDone: !isDone, completedAt: !isDone ? new Date() : null },
    });
  });
}

export async function updateTodo(
  id: string,
  input: { text: string; dueDate?: string },
): Promise<Result> {
  const text = input.text.trim();
  if (!text) return { error: "A to-do can't be empty." };
  if (text.length > MAX_TODO) return { error: `Keep it under ${MAX_TODO} characters.` };
  return run(async () => {
    await prisma.todo.update({
      where: { id },
      data: { text, dueDate: parseDueDate(input.dueDate) },
    });
  });
}

export async function deleteTodo(id: string): Promise<Result> {
  return run(async () => {
    await prisma.todo.delete({ where: { id } });
  });
}

export async function clearCompletedTodos(): Promise<Result> {
  return run(async () => {
    await prisma.todo.deleteMany({ where: { isDone: true } });
  });
}

function validateNote(input: { title: string; body: string }): string | null {
  if (!input.title.trim() && !input.body.trim()) return "An empty note isn't worth saving.";
  if (input.title.length > MAX_NOTE_TITLE) return `Title must be under ${MAX_NOTE_TITLE} characters.`;
  if (input.body.length > MAX_NOTE_BODY) return `Note must be under ${MAX_NOTE_BODY} characters.`;
  return null;
}

export async function createNote(input: { title: string; body: string }): Promise<Result> {
  const problem = validateNote(input);
  if (problem) return { error: problem };
  return run(async () => {
    await prisma.note.create({
      data: { title: input.title.trim(), body: input.body.replace(/\s+$/, "") },
    });
  });
}

export async function updateNote(
  id: string,
  input: { title: string; body: string },
): Promise<Result> {
  const problem = validateNote(input);
  if (problem) return { error: problem };
  return run(async () => {
    await prisma.note.update({
      where: { id },
      data: { title: input.title.trim(), body: input.body.replace(/\s+$/, "") },
    });
  });
}

export async function toggleNotePinned(id: string, pinned: boolean): Promise<Result> {
  return run(async () => {
    await prisma.note.update({ where: { id }, data: { pinned: !pinned } });
  });
}

export async function deleteNote(id: string): Promise<Result> {
  return run(async () => {
    await prisma.note.delete({ where: { id } });
  });
}
