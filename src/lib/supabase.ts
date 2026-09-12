import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Uc93RF40JHItaQ4WX9Alxw_e80zXPwh';

export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = DEFAULT_PUBLISHABLE_KEY;

  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('custom_supabase_url');
    const customKey = localStorage.getItem('custom_supabase_key');
    if (customUrl) url = customUrl;
    if (customKey) key = customKey;
  }

  const isConfigured = Boolean(url && url.startsWith('http') && key);
  return { url, key, isConfigured };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.warn('Error al inicializar cliente de Supabase:', e);
    return null;
  }
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
