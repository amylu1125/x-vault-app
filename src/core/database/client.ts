import { SupabaseDatabaseClient } from './SupabaseDatabaseClient';

/** Shared database client singleton used by all repositories. */
export const databaseClient = new SupabaseDatabaseClient();
