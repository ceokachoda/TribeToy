import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// This client does NOT use cookies, so it can be used in force-static Server Components
// without opting them into dynamic rendering.
export const createStaticClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
