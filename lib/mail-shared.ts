// Limits and parsing shared by the email dialog (client) and the send action
// (server), so what the UI allows is exactly what the server enforces. No
// imports — safe in both.

export const MAX_RECIPIENTS = 10;

// Gmail rejects messages over 25 MB *after* base64 encoding (~+33%), so the raw
// attachment budget is lower than it looks.
export const MAX_EMAIL_ATTACHMENT_BYTES = 18 * 1024 * 1024;

export const MAX_SUBJECT = 200;
export const MAX_MESSAGE = 5000;

// Deliberately simple: one @, no spaces, a dot in the domain. Real validation
// is the mail server accepting or bouncing it.
const EMAIL_RE = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

// Split a free-text "To" field (commas, semicolons, spaces, newlines) into
// unique, lower-cased addresses, reporting any that don't look valid.
export function parseRecipients(input: string): { valid: string[]; invalid: string[] } {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const raw of input.split(/[\s,;]+/)) {
    const token = raw.trim();
    if (!token) continue;
    const addr = token.toLowerCase();
    if (!isValidEmail(addr)) {
      invalid.push(token);
    } else if (!seen.has(addr)) {
      seen.add(addr);
      valid.push(addr);
    }
  }
  return { valid, invalid };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
