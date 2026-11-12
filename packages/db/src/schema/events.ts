import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  date: timestamp('date'),
  city: varchar('city', { length: 100 }).notNull(),
  venueName: varchar('venue_name', { length: 255 }),
  category: varchar('category', { length: 100 }),
  badge: varchar('badge', { length: 50 }).notNull().default('none'), // trending, new, filling_fast, ks_original, none
  imageUrl: text('image_url'),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, live
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
