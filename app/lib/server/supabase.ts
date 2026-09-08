// Service-role Supabase client. Port of boilerplate_app/core/supabase_client.py.
//
// Service role bypasses RLS, so this module must stay server-only.

import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { settings } from "./config";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  if (!settings.supabaseUrl || !settings.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  client = createClient(settings.supabaseUrl, settings.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
