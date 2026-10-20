"use client";

import { useEffect, useState, useTransition } from "react";
import { emailDocuments } from "../email-action";
import {
  MAX_EMAIL_ATTACHMENT_BYTES,
  MAX_MESSAGE,
  MAX_RECIPIENTS,
  MAX_SUBJECT,
  formatBytes,
  parseRecipients,
} from "@/lib/mail-shared";

export type EmailDoc = { id: string; title: string; isFile: boolean; size: number | null };

const RECENTS_KEY = "profirm.recentRecipients";

function loadRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecents(addresses: string[], existing: string[]) {
  try {
    const merged = [...addresses, ...existing.filter((a) => !addresses.includes(a))].slice(0, 8);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(merged));
  } catch {
    // Private mode / blocked storage: suggestions are a convenience, skip.
  }
}

const fieldClass =
  "w-full border border-outline-variant rounded px-3 py-2 font-body text-body-sm focus:border-deep-navy focus:outline-none disabled:opacity-60";
const labelClass = "block font-label text-label-sm text-on-surface-variant uppercase tracking-wide mb-1";

// Review-and-send dialog. Shows exactly what will go out (sender, recipients,
// every attachment and link) before anything is sent.
export default function EmailDialog({
  ventureKey,
  ventureName,
  accounts,
  docs,
  onClose,
}: {
  ventureKey: string;
  ventureName: string;
  accounts: string[];
  docs: EmailDoc[];
  onClose: () => void;
}) {
  const [from, setFrom] = useState(accounts[0] ?? "");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(`${ventureName} — documents`);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string[] | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setRecents(loadRecents()), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPending, onClose]);

  const files = docs.filter((d) => d.isFile);
  const links = docs.filter((d) => !d.isFile);
  const fileBytes = files.reduce((sum, d) => sum + (d.size ?? 0), 0);
  const tooBig = fileBytes > MAX_EMAIL_ATTACHMENT_BYTES;

  const { valid, invalid } = parseRecipients(to);
  const tooMany = valid.length > MAX_RECIPIENTS;
  const configured = accounts.length > 0;
  const canSend =
    configured && !isPending && !tooBig && !tooMany && invalid.length === 0 &&
    valid.length > 0 && subject.trim().length > 0;

  function addRecipient(addr: string) {
    if (valid.includes(addr)) return;
    setTo((cur) => (cur.trim() ? `${cur.trim().replace(/[,;]+$/, "")}, ${addr}` : addr));
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setError(null);
    startTransition(async () => {
      const res = await emailDocuments({
        ventureKey,
        from,
        to,
        subject,
        message,
        documentIds: docs.map((d) => d.id),
      });
      if (res.error) {
        setError(res.error);
      } else {
        const sent = res.sentTo ?? valid;
        saveRecents(sent, recents);
        setSentTo(sent);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-docs-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !isPending && onClose()}
        className="absolute inset-0 bg-black/50"
      />
      <div className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto bg-surface-container-lowest rounded shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-deep-navy">mail</span>
          <h3 id="email-docs-title" className="font-headline text-body-lg font-bold text-on-surface">
            Email documents
          </h3>
        </div>

        {sentTo ? (
          <div>
            <p className="flex items-start gap-2 font-body text-body-md text-on-surface mb-2">
              <span className="material-symbols-outlined text-success-green">check_circle</span>
              <span>
                Sent from <strong>{from}</strong> to {sentTo.join(", ")}.
              </span>
            </p>
            <p className="font-body text-body-sm text-slate-gray mb-5">
              It will also appear in that mailbox&apos;s Sent folder.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-deep-navy text-white rounded font-label text-label-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            {!configured ? (
              <p className="font-body text-body-sm text-error bg-error-container/40 rounded p-3">
                Email isn&apos;t set up yet. Add <code>MAIL_ACCOUNTS</code> (a Gmail address and its
                app password) to the environment — see the README.
              </p>
            ) : null}

            <div>
              <label className={labelClass} htmlFor="email-from">
                From
              </label>
              {accounts.length > 1 ? (
                <select
                  id="email-from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  disabled={isPending}
                  className={`${fieldClass} bg-white`}
                >
                  {accounts.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <p id="email-from" className="font-body text-body-sm text-on-surface py-2">
                  {from || "—"}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="email-to">
                To
              </label>
              <input
                id="email-to"
                autoFocus
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={isPending}
                placeholder="name@example.com, another@example.com"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                inputMode="email"
                className={fieldClass}
              />
              {recents.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recents.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => addRecipient(r)}
                      disabled={isPending || valid.includes(r)}
                      className="font-label text-label-sm px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high disabled:opacity-40"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ) : null}
              {invalid.length > 0 ? (
                <p className="font-body text-body-sm text-error mt-1">
                  Doesn&apos;t look like an email address: {invalid.join(", ")}
                </p>
              ) : tooMany ? (
                <p className="font-body text-body-sm text-error mt-1">
                  Up to {MAX_RECIPIENTS} recipients at a time.
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="email-subject">
                Subject
              </label>
              <input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={MAX_SUBJECT}
                disabled={isPending}
                className={fieldClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="email-message">
                Message <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id="email-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE}
                rows={4}
                disabled={isPending}
                placeholder={`Please find the documents for ${ventureName}.`}
                className={`${fieldClass} resize-y`}
              />
            </div>

            <div className="bg-surface-container rounded p-3">
              <p className={labelClass}>What will be sent</p>
              <ul className="space-y-1">
                {files.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 font-body text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-base shrink-0">attach_file</span>
                    <span className="truncate flex-1">{d.title}</span>
                    {d.size ? (
                      <span className="font-label text-label-sm text-slate-gray shrink-0">
                        {formatBytes(d.size)}
                      </span>
                    ) : null}
                  </li>
                ))}
                {links.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 font-body text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-base shrink-0">link</span>
                    <span className="truncate flex-1">{d.title}</span>
                    <span className="font-label text-label-sm text-slate-gray shrink-0">as link</span>
                  </li>
                ))}
              </ul>
              {files.length > 0 ? (
                <p
                  className={`font-label text-label-sm mt-2 ${tooBig ? "text-error" : "text-slate-gray"}`}
                >
                  Attachments: {formatBytes(fileBytes)} of {formatBytes(MAX_EMAIL_ATTACHMENT_BYTES)}
                  {tooBig ? " — too large, deselect some files" : ""}
                </p>
              ) : null}
            </div>

            {error ? <p className="font-body text-body-sm text-error">{error}</p> : null}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 bg-surface-container text-on-surface rounded font-label text-label-md hover:bg-surface-container-high disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSend}
                className="px-4 py-2 bg-deep-navy text-white rounded font-label text-label-md hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "Sending…"
                  : valid.length > 0
                    ? `Send to ${valid.length} recipient${valid.length === 1 ? "" : "s"}`
                    : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
