import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET_NAME = 'mark-photos';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const rawAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  '';

export const hasSupabaseUrl =
  Boolean(rawUrl) && !rawUrl.includes('YOUR_PROJECT_REF');
export const hasSupabaseKey =
  Boolean(rawAnonKey) && !rawAnonKey.includes('YOUR_SUPABASE_');

export const isSupabaseConfigured = hasSupabaseUrl && hasSupabaseKey;

export const supabaseConfigInfo = {
  url: rawUrl,
  anonKey: rawAnonKey,
  hasUrl: hasSupabaseUrl,
  hasKey: hasSupabaseKey,
  isConfigured: isSupabaseConfigured,
  bucketName: SUPABASE_BUCKET_NAME,
};

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
