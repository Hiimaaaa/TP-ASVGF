import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isConfigured) {
    console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Supabase features will be disabled.');
}

// Create client with placeholder values if missing to prevent crash
// operations will fail gracefully in services
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
