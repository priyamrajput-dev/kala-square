import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { artists } from './artists.js';

export const artistMedia = pgTable('artist_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  artistId: uuid('artist_id')
    .notNull()
    .references(() => artists.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // gallery, video, clip
  title: text('title'),
  url: text('url').notNull(), // image URL or YouTube URL or Shorts/Reels URL
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ArtistMedia = typeof artistMedia.$inferSelect;
export type NewArtistMedia = typeof artistMedia.$inferInsert;
