import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const homeConfigs = pgTable('home_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  draftConfig: jsonb('draft_config').notNull(),
  publishedConfig: jsonb('published_config'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type HomeConfigRecord = typeof homeConfigs.$inferSelect;
export type NewHomeConfigRecord = typeof homeConfigs.$inferInsert;
