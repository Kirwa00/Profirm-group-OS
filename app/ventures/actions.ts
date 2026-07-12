"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, isDbConfigured } from "@/lib/prisma";
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

export async function addKeyDocument(ventureId: string, key: string, formData: FormData) {
  if (!isDbConfigured()) return;
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!title || !url) return;
  await prisma.keyDocument.create({ data: { ventureId, title, url } });
  revalidatePath(`/ventures/${key}`);
}
