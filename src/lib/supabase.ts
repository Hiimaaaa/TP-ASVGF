import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;


export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => ({ 
           order: () => ({ limit: () => ({ data: [], error: { message: "Supabase not configured" } }) }),
           single: () => ({ data: null, error: { message: "Supabase not configured" } })
        }),
        insert: () => ({ 
          select: () => ({ single: () => ({ data: null, error: { message: "Supabase not configured" } }) }) 
        })
      })
    } as any;

