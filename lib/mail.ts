import nodemailer from "nodemailer";

// Server-only. Holds Gmail app passwords — never import this from a Client
// Component.

export type MailAccount = { address: string; password: string };

// MAIL_ACCOUNTS="you@gmail.com:abcdefghijklmnop,other@gmail.com:qrstuvwxyzabcdef"
// Google shows app passwords in groups ("abcd efgh ijkl mnop"); spaces are
// ignored so they can be pasted as-is.
export function getMailAccounts(): MailAccount[] {
  const raw = process.env.MAIL_ACCOUNTS ?? "";
  const accounts: MailAccount[] = [];
  for (const entry of raw.split(",")) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;
    const address = entry.slice(0, idx).trim().toLowerCase();
    const password = entry.slice(idx + 1).replace(/\s+/g, "");
    if (address && password) accounts.push({ address, password });
  }
  return accounts;
}

// Addresses only — safe to hand to the browser.
export function listMailAddresses(): string[] {
  return getMailAccounts().map((a) => a.address);
}

function transportFor(account: MailAccount) {
  // Host/port are overridable (e.g. another provider, or a local test SMTP
  // server) but default to Gmail over implicit TLS.
  const host = process.env.MAIL_SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.MAIL_SMTP_PORT || 465);
  const secure = process.env.MAIL_SMTP_SECURE
    ? process.env.MAIL_SMTP_SECURE === "true"
    : port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: account.address, pass: account.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 40_000,
    // Local test servers use a self-signed cert; real hosts never need this.
    ...(process.env.MAIL_SMTP_INSECURE_TLS === "true" ? { tls: { rejectUnauthorized: false } } : {}),
  });
}

export type OutgoingMail = {
  from: MailAccount;
  to: string[];
  subject: string;
  text: string;
  html: string;
  attachments: { filename: string; content: Buffer; contentType?: string }[];
};

export async function sendMail(mail: OutgoingMail): Promise<void> {
  await transportFor(mail.from).sendMail({
    from: mail.from.address,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: mail.attachments,
  });
}
