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
