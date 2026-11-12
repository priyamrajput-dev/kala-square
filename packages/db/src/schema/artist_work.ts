import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { artists } from './artists.js';

export const artistWork = pgTable('artist_work', {
  id: uuid('id').defaultRandom().primaryKey(),
  artistId: uuid('artist_id')
    .notNull()
    .references(() => artists.id, { onDelete: 'cascade' }),
  kind: varchar('kind', { length: 50 }).notNull(), // campaign, award, faq
  title: text('title').notNull(), // For FAQ, this is question
  category: varchar('category', { length: 100 }),
  year: varchar('year', { length: 20 }),
  description: text('description'), // For FAQ, this is answer
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ArtistWork = typeof artistWork.$inferSelect;
export type NewArtistWork = typeof artistWork.$inferInsert;
