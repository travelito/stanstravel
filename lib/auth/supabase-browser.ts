import { createBrowserClient } from "@supabase/ssr";

// Cookie-aware client for future client components in the admin panel
// (e.g. interactive edit forms, photo upload progress).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
