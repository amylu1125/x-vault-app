import type { DatabaseClient } from '../core/database/DatabaseClient';
import { databaseClient } from '../core/database/client';

/**
 * Base class for all feature repositories.
 * Provides shared database client access and error normalization.
 */
export abstract class BaseRepository {
  protected readonly db: DatabaseClient;

  constructor(client: DatabaseClient = databaseClient) {
    this.db = client;
  }

  protected normalizeError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error('An unexpected database error occurred.');
  }
}
