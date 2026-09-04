import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DOCUMENTS_BUCKET } from "./storage";

// Server-only Supabase client, keyed with the service-role secret. Never import
// this into a Client Component — it would leak SUPABASE_SERVICE_ROLE_KEY into
// the browser bundle. Client-side uploads use a short-lived signed URL instead.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isStorageConfigured = () => Boolean(url && serviceKey);

let _client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  if (!isStorageConfigured()) return null;
  if (!_client) {
    _client = createClient(url as string, serviceKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

let _bucketEnsured = false;

// Create the documents bucket if it isn't there yet (private). Safe to call on
// every upload — the "already exists" case is swallowed and cached so it's a
// no-op after the first hit.
export async function ensureDocumentsBucket(client: SupabaseClient): Promise<void> {
  if (_bucketEnsured) return;
  const { error } = await client.storage.createBucket(DOCUMENTS_BUCKET, {
    public: false,
    fileSizeLimit: "12MB",
  });
  if (error && !/exist/i.test(error.message)) {
    throw error;
  }
  _bucketEnsured = true;
}
