/**
 * Supabase Client Configuration
 * 
 * Environment variables are loaded from:
 * - .env.local (development)
 * - .env.production (production - set in Vercel/Netlify)
 * 
 * SECURITY NOTE:
 * - anon key is safe to expose (protected by RLS)
 * - NEVER expose service_role key in frontend
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    try {
        return !!new URL(url);
    } catch {
        return false;
    }
};

const isConfigured = supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    isValidUrl(supabaseUrl);

// Create client only if properly configured
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    })
    : null;

// Helper to check if Supabase is available
export const isSupabaseConfigured = () => !!supabase;

// Development warning and debugging
if (import.meta.env.DEV) {
    if (!isConfigured) {
        console.warn(
            '⚠️ Supabase is not configured.\n' +
            'URL: ' + (supabaseUrl ? 'Set' : 'Missing') + '\n' +
            'Key: ' + (supabaseAnonKey ? 'Set' : 'Missing') + '\n' +
            'Copy .env.example to .env.local and add your Supabase credentials.\n' +
            'Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api'
        );
    } else {
        console.log('✅ Supabase Client Initialized', {
            url: supabaseUrl?.substring(0, 20) + '...',
            configured: true
        });
    }
}

export default supabase;
