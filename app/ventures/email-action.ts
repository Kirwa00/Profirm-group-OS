"use server";

import { auth } from "@/auth";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { DOCUMENTS_BUCKET } from "@/lib/storage";
import { getMailAccounts, sendMail } from "@/lib/mail";
import {
  MAX_EMAIL_ATTACHMENT_BYTES,
  MAX_MESSAGE,
  MAX_RECIPIENTS,
  MAX_SUBJECT,
  formatBytes,
  parseRecipients,
} from "@/lib/mail-shared";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Attachment names come from user-supplied titles; strip anything that could
// confuse a mail client or a filesystem.
function attachmentName(title: string) {
  const cleaned = title.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "_").trim();
  return cleaned || "document";
}

// Email selected documents from a project out of one of the configured Gmail
// accounts. Uploaded files are attached; pasted links go in the body.
//
// Guarded because it sends real mail from the owner's mailbox: signed-in ADMIN
// only, `from` must be a configured account, recipients are validated and
// capped, and the documents must belong to the named project.
export async function emailDocuments(input: {
  ventureKey: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  documentIds: string[];
}): Promise<{ error?: string; sentTo?: string[] }> {
  if (!isDbConfigured()) return { error: "Database not connected." };

  const session = await auth();
  if (!session?.user) return { error: "You must be signed in to send email." };
  if (session.user.role !== "ADMIN") {
    return { error: "Only admins can send email from the connected mailboxes." };
  }

  const account = getMailAccounts().find((a) => a.address === input.from.trim().toLowerCase());
  if (!account) return { error: "That sender isn't set up. Check MAIL_ACCOUNTS." };

  const { valid: recipients, invalid } = parseRecipients(input.to);
  if (invalid.length > 0) {
    return { error: `These don't look like email addresses: ${invalid.join(", ")}` };
  }
  if (recipients.length === 0) return { error: "Add at least one recipient." };
  if (recipients.length > MAX_RECIPIENTS) {
    return { error: `Up to ${MAX_RECIPIENTS} recipients at a time.` };
  }

  // Header values must be single-line.
  const subject = input.subject.replace(/[\r\n]+/g, " ").trim();
  if (!subject) return { error: "Add a subject." };
  if (subject.length > MAX_SUBJECT) {
    return { error: `Subject must be under ${MAX_SUBJECT} characters.` };
  }
  const message = input.message.trim();
  if (message.length > MAX_MESSAGE) {
    return { error: `Message must be under ${MAX_MESSAGE} characters.` };
  }

  const ids = Array.from(new Set(input.documentIds));
  if (ids.length === 0) return { error: "Select at least one document." };

  const venture = await prisma.venture.findUnique({ where: { key: input.ventureKey } });
  if (!venture) return { error: "Project not found." };
  const docs = await prisma.keyDocument.findMany({
    where: { id: { in: ids }, ventureId: venture.id },
    orderBy: { createdAt: "asc" },
  });
  if (docs.length !== ids.length) {
    return { error: "Some selected documents no longer exist. Refresh and try again." };
  }

  const fileDocs = docs.filter((d) => d.type === "file" && d.pathname);
  const linkDocs = docs.filter((d) => !(d.type === "file" && d.pathname));

  const declared = fileDocs.reduce((sum, d) => sum + (d.size ?? 0), 0);
  if (declared > MAX_EMAIL_ATTACHMENT_BYTES) {
    return {
      error: `Attachments total ${formatBytes(declared)}; the limit is ${formatBytes(MAX_EMAIL_ATTACHMENT_BYTES)}. Send fewer files at once.`,
    };
  }

  const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];
  if (fileDocs.length > 0) {
    const client = supabaseAdmin();
    if (!client) return { error: "Document storage isn't configured, so files can't be attached." };
    let actual = 0;
    for (const d of fileDocs) {
      const { data, error } = await client.storage
        .from(DOCUMENTS_BUCKET)
        .download(d.pathname as string);
      if (error || !data) {
        console.error("[email] attachment download failed:", error?.message);
        return { error: `Couldn't read "${d.title}" from storage.` };
      }
      const content = Buffer.from(await data.arrayBuffer());
      actual += content.length;
      if (actual > MAX_EMAIL_ATTACHMENT_BYTES) {
        return {
          error: `Attachments exceed the ${formatBytes(MAX_EMAIL_ATTACHMENT_BYTES)} limit. Send fewer files at once.`,
        };
      }
      attachments.push({
        filename: attachmentName(d.title),
        content,
        contentType: d.contentType ?? undefined,
      });
    }
  }

  const intro = message || `Please find the documents for ${venture.name}.`;
  const textParts = [intro];
  if (attachments.length > 0) {
    textParts.push(`Attached:\n${attachments.map((a) => `- ${a.filename}`).join("\n")}`);
  }
  if (linkDocs.length > 0) {
    textParts.push(`Links:\n${linkDocs.map((d) => `- ${d.title}: ${d.url}`).join("\n")}`);
  }
  const html = [
    `<p>${escapeHtml(intro).replace(/\n/g, "<br>")}</p>`,
    attachments.length > 0
      ? `<p><strong>Attached:</strong></p><ul>${attachments
          .map((a) => `<li>${escapeHtml(a.filename)}</li>`)
          .join("")}</ul>`
      : "",
    linkDocs.length > 0
      ? `<p><strong>Links:</strong></p><ul>${linkDocs
          .map((d) => `<li>${escapeHtml(d.title)}: ${escapeHtml(d.url)}</li>`)
          .join("")}</ul>`
      : "",
  ].join("");

  try {
    await sendMail({
      from: account,
      to: recipients,
      subject,
      text: textParts.join("\n\n"),
      html,
      attachments,
    });
  } catch (err) {
    const e = err as { code?: string; responseCode?: number; message?: string };
    // Log the failure shape, never the credentials.
    console.error("[email] send failed:", e.code, e.responseCode, e.message);
    if (e.code === "EAUTH") {
      return {
        error: `${account.address} rejected the login. Check its app password in MAIL_ACCOUNTS.`,
      };
    }
    if (e.code === "ECONNECTION" || e.code === "ETIMEDOUT" || e.code === "ESOCKET") {
      return { error: "Couldn't reach the mail server. Try again in a moment." };
    }
    return { error: "The mail server refused the message. Nothing was sent." };
  }

  return { sentTo: recipients };
}
