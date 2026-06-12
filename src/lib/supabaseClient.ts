import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
const missingEnvMessage = 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set.';

const createFallbackSupabaseClient = () => {
  const errorResponse = async () => ({
    data: { session: null },
    error: new Error(missingEnvMessage),
  });

  return {
    auth: {
      getSession: errorResponse,
      onAuthStateChange: () => ({ data: { subscription: undefined } }),
      signOut: async () => ({ data: { user: null, session: null }, error: new Error(missingEnvMessage) }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error(missingEnvMessage) }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error(missingEnvMessage) }),
    },
  } as const;
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createFallbackSupabaseClient();
