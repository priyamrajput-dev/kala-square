import { pgTable, uuid, varchar, text, jsonb, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  bio: text('bio'),
  categories: jsonb('categories').$type<string[]>().notNull().default([]),
  specializations: jsonb('specializations').$type<string[]>().default([]),
  experienceYears: integer('experience_years'),
  projectsCount: integer('projects_count'),
  liveShowsCount: integer('live_shows_count'),
  totalFollowersLabel: varchar('total_followers_label', { length: 50 }),
  height: varchar('height', { length: 50 }),
  weightKg: integer('weight_kg'),
  waistIn: integer('waist_in'),
  chestIn: integer('chest_in'),
  hairType: varchar('hair_type', { length: 50 }),
  hairLength: varchar('hair_length', { length: 50 }),
  languages: jsonb('languages').$type<string[]>().default([]),
  artistClass: varchar('artist_class', { length: 50 }).notNull().default('standard'), // standard, platinum, rising, emerging
  budgetRange: varchar('budget_range', { length: 50 }).notNull().default('not_set'), // not_set, under_10k, 10k_50k, 50k_1l, 1l_plus
  isVerified: boolean('is_verified').notNull().default(false),
  isExclusive: boolean('is_exclusive').notNull().default(false),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, pending, live, archived
  profilePhotoUrl: text('profile_photo_url'),
  profilePhotoAltText: text('profile_photo_alt_text'),
  completenessPercent: integer('completeness_percent').notNull().default(0),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
