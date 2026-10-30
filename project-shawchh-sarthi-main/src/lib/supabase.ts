import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

/**
 * Environment configuration for Supabase
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Checks whether valid Supabase configuration is present.
 * Prevents runtime crashes when credentials are not yet configured.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }

  const isPlaceholderUrl = 
    supabaseUrl.includes('your-project-ref') || 
    supabaseUrl.includes('placeholder') || 
    supabaseUrl.includes('example.com') ||
    supabaseUrl.trim() === '';

  const isPlaceholderKey = 
    supabaseAnonKey.includes('your-anon-public-key') || 
    supabaseAnonKey.includes('placeholder') || 
    supabaseAnonKey.trim() === '';

  return !isPlaceholderUrl && !isPlaceholderKey;
};

/**
 * Informative status helper for UI dashboards & connection indicators
 */
export const getSupabaseConfigStatus = () => {
  const missing: string[] = [];
  if (!supabaseUrl || supabaseUrl.includes('your-project-ref')) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-public-key')) missing.push('VITE_SUPABASE_ANON_KEY');

  const configured = isSupabaseConfigured();

  return {
    configured,
    missingKeys: missing,
    supabaseUrl: configured ? supabaseUrl : undefined,
    message: configured
      ? 'Supabase backend connected'
      : missing.length > 0
        ? `Missing environment variables: ${missing.join(', ')}. Provide them in .env to connect live Supabase.`
        : 'Supabase credentials are placeholders. Update .env with your live Supabase project credentials.'
  };
};

/**
 * Safe fallback URL and Anon Key so that the client can be instantiated
 * without throwing immediately at module load time if .env is missing.
 */
const safeUrl = isSupabaseConfigured() ? supabaseUrl! : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey! : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

if (!isSupabaseConfigured() && typeof window !== 'undefined') {
  console.info(
    '%c[Swachh Seva - Supabase]%c Backend not connected yet. Application running in mock/preview mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to activate the live PostgreSQL backend.',
    'background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
    'color: inherit;'
  );
}

/**
 * Typed Supabase client instance.
 * All browser operations MUST use anon key only.
 * NEVER use service_role secret key in client code.
 */
export const supabase = createClient<Database>(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'swachh-seva-auth-token'
  }
});

export default supabase;
