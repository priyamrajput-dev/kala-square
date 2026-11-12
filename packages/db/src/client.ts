import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

// TODO: Active database connection will be initialized in upcoming prompt
// DB connect is intentionally deferred in Prompt 1.
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(connectionString?: string) {
  if (!dbInstance) {
    const connStr = connectionString || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kalasquare';
    const client = postgres(connStr, { max: 10 });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}
