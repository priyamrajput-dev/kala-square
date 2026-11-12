// Database client accessor for Fastify API
// Note: In Prompt 1, active database connection is intentionally not established.
import { getDb } from '@kalasquare/db';

export function getDatabase() {
  // TODO: Connect and return DB instance in upcoming prompt
  return getDb();
}
