import type { Session } from '@supabase/supabase-js';
import type { AuthStateChangeCallback } from '../../../core/database/DatabaseClient';
import { authRepository, AuthRepository } from '../repositories/AuthRepository';
import type { AuthCredentials } from '../types';

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async getSession(): Promise<Session | null> {
    return this.repository.getSession();
  }

  subscribeToAuthChanges(callback: AuthStateChangeCallback) {
    return this.repository.onAuthStateChange(callback);
  }

  async signIn(credentials: AuthCredentials): Promise<void> {
    const { session } = await this.repository.signInWithPassword(credentials);
    if (!session) {
      throw new Error('Sign in failed. Please try again.');
    }
  }

  async signUp(
    credentials: AuthCredentials
  ): Promise<{ needsEmailConfirmation: boolean }> {
    const { session, user } = await this.repository.signUpWithPassword(credentials);
    const needsEmailConfirmation = !session && !!user && !user.confirmed_at;
    return { needsEmailConfirmation };
  }

  async signOut(): Promise<void> {
    await this.repository.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    await this.repository.resetPasswordForEmail(email);
  }
}

export const authService = new AuthService();
