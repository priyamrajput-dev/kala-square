import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { artists } from './artists.js';

export const artistSocial = pgTable('artist_social', {
  id: uuid('id').defaultRandom().primaryKey(),
  artistId: uuid('artist_id')
    .notNull()
    .unique()
    .references(() => artists.id, { onDelete: 'cascade' }),
  instagramUrl: text('instagram_url'),
  youtubeUrl: text('youtube_url'),
  facebookUrl: text('facebook_url'),
  xUrl: text('x_url'),
  spotifyUrl: text('spotify_url'),
  spotifyFollowersLabel: varchar('spotify_followers_label', { length: 50 }),
  youtubeSubscribersLabel: varchar('youtube_subscribers_label', { length: 50 }),
  instagramFollowersLabel: varchar('instagram_followers_label', { length: 50 }),
  facebookFollowersLabel: varchar('facebook_followers_label', { length: 50 }),
  deezerFansLabel: varchar('deezer_fans_label', { length: 50 }),
  soundcloudFollowersLabel: varchar('soundcloud_followers_label', { length: 50 }),
  tiktokFollowersLabel: varchar('tiktok_followers_label', { length: 50 }),
  seoMetaTitle: varchar('seo_meta_title', { length: 60 }),
  seoMetaDescription: varchar('seo_meta_description', { length: 160 }),
  seoFocusKeyword: varchar('seo_focus_keyword', { length: 100 }),
  seoCanonicalUrl: text('seo_canonical_url'),
  seoShareImageUrl: text('seo_share_image_url'),
  seoShowInSearch: boolean('seo_show_in_search').notNull().default(true),
  seoScore: integer('seo_score').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ArtistSocial = typeof artistSocial.$inferSelect;
export type NewArtistSocial = typeof artistSocial.$inferInsert;
