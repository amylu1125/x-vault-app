import type { Session } from '@supabase/supabase-js';
import type { AuthStateChangeCallback } from '../../../core/database/DatabaseClient';
import { BaseRepository } from '../../../repositories/BaseRepository';
import type { AuthCredentials } from '../types';

export class AuthRepository extends BaseRepository {
  async getSession(): Promise<Session | null> {
    const { session } = await this.db.auth.getSession();
    return session;
  }

  async signInWithPassword(credentials: AuthCredentials) {
    return this.db.auth.signInWithPassword(credentials);
  }

  async signUpWithPassword(credentials: AuthCredentials) {
    return this.db.auth.signUpWithPassword(credentials);
  }

  async signOut(): Promise<void> {
    await this.db.auth.signOut();
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    await this.db.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
  }

  onAuthStateChange(callback: AuthStateChangeCallback) {
    return this.db.auth.onAuthStateChange(callback);
  }
}

export const authRepository = new AuthRepository();
