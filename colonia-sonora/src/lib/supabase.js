import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createSupabaseClient(getAccessToken) {
  if (!supabaseConfigured) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: getAccessToken,
  });
}
