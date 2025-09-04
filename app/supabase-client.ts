import { SupabaseClient } from "@supabase/supabase-js";

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default supabase;