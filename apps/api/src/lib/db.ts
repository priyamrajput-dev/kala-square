// Database client accessor for Fastify API
// Note: In Prompt 1, active database connection is intentionally not established.
import { getDb, type DbClient } from '@kalasquare/db';

export function getDatabase(): DbClient {
    return getDb();
}
