import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Vite
// We fallback to your public key if not configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8urEDXfFLhRZy5u1tw22aA_KaG9Wcq7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
