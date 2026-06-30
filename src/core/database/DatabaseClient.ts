import type {
  AuthChangeEvent,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  Subscription,
  User,
} from '@supabase/supabase-js';

export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

export interface AuthSessionResult {
  user: User | null;
  session: Session | null;
}

export interface AuthSignUpResult extends AuthSessionResult {
  /** Present when email confirmation is required. */
  confirmed_at?: string;
}

/**
 * Database abstraction contract.
 * Repositories depend on this interface — never on Supabase directly.
 */
export interface DatabaseClient {
  auth: {
    getSession(): Promise<{ session: Session | null }>;
    signInWithPassword(credentials: SignInWithPasswordCredentials): Promise<AuthSessionResult>;
    signUpWithPassword(credentials: SignUpWithPasswordCredentials): Promise<AuthSignUpResult>;
    signOut(): Promise<void>;
    resetPasswordForEmail(
      email: string,
      options: { redirectTo: string }
    ): Promise<void>;
    onAuthStateChange(callback: AuthStateChangeCallback): { subscription: Subscription };
  };
}
