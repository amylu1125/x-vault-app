/**
 * Typed environment access — placeholder.
 * supabase.ts continues to read import.meta.env directly (unchanged in Sprint 1).
 */
export interface AppEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

export function getEnv(): AppEnv {
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}
