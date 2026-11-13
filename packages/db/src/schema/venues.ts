import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const venues = pgTable('venues', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  category: varchar('category', { length: 100 }),
  capacity: integer('capacity'),
  priceFrom: integer('price_from'),
  priceLabel: varchar('price_label', { length: 100 }),
  imageUrl: text('image_url'),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, live
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;
