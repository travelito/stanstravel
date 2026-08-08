import { createClient } from "@supabase/supabase-js";

// Public, read-only client — used only for server-side rendering of
// public tour/excursion content. Safe to expose: the anon key only
// allows SELECT queries, per the RLS policies set on the database.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
