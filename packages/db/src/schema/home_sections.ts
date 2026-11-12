import { pgTable, uuid, varchar, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export interface HeroImageItem {
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
}

export const homeSections = pgTable('home_sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectionKey: varchar('section_key', { length: 50 }).notNull().unique(), // hero, platinum, category, spotlight, events, rising, venues
  title: varchar('title', { length: 255 }).notNull(),
  orderedIds: jsonb('ordered_ids').$type<string[]>().notNull().default([]),
  heroImages: jsonb('hero_images').$type<HeroImageItem[]>().notNull().default([]),
  isVisible: boolean('is_visible').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type HomeSection = typeof homeSections.$inferSelect;
export type NewHomeSection = typeof homeSections.$inferInsert;
