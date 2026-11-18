import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase credentials provided by user
const DEFAULT_SUPABASE_URL = 'https://plyhrfcsvtdulswihmia.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable__7nWBLf2Zu179PLzXvmLng_eVe1OLek';

// Get Supabase configuration from environment variables, localStorage override, or default credentials
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const savedUrl = localStorage.getItem('supabase_url');
  const savedKey = localStorage.getItem('supabase_key');

  const url = savedUrl || envUrl || DEFAULT_SUPABASE_URL;
  const key = savedKey || envKey || DEFAULT_SUPABASE_KEY;

  return { url, key };
};

const { url, key } = getSupabaseConfig();

// Check if valid URL and key are provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    !url.includes('[YOUR_SUPABASE_URL]') &&
    !key.includes('[YOUR_SUPABASE_ANON_KEY]')
  );
};

// Initialize Supabase client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(url, key)
  : null;

export const updateSupabaseCredentials = (newUrl: string, newKey: string) => {
  localStorage.setItem('supabase_url', newUrl.trim());
  localStorage.setItem('supabase_key', newKey.trim());
  window.location.reload();
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_key');
  window.location.reload();
};
