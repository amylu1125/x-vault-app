import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';
import type { AuthStateChangeCallback, DatabaseClient } from './DatabaseClient';

/**
 * Supabase implementation of DatabaseClient.
 * Delegates to the existing supabase client — configuration is unchanged.
 */
export class SupabaseDatabaseClient implements DatabaseClient {
  auth = {
    getSession: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session };
    },

    signInWithPassword: async (credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return data;
    },

    signUpWithPassword: async (credentials: SignUpWithPasswordCredentials) => {
      const { data, error } = await supabase.auth.signUp({
        ...credentials,
        options: {
          ...credentials.options,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      return {
        user: data.user,
        session: data.session,
        confirmed_at: data.user?.confirmed_at ?? undefined,
      };
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    resetPasswordForEmail: async (email, options) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      if (error) throw error;
    },

    onAuthStateChange: (callback: AuthStateChangeCallback) => {
      const { data } = supabase.auth.onAuthStateChange(callback);
      return data;
    },
  };
}
