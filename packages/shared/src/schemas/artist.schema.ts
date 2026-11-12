import { z } from 'zod';

export const ArtistClassEnum = z.enum(['standard', 'platinum', 'rising', 'emerging']);
export type ArtistClass = z.infer<typeof ArtistClassEnum>;

export const BudgetRangeEnum = z.enum(['not_set', 'under_10k', '10k_50k', '50k_1l', '1l_plus']);
export type BudgetRange = z.infer<typeof BudgetRangeEnum>;

export const ArtistStatusEnum = z.enum(['draft', 'pending', 'live', 'archived']);
export type ArtistStatus = z.infer<typeof ArtistStatusEnum>;

export const MediaTypeEnum = z.enum(['gallery', 'video', 'clip']);
export type MediaType = z.infer<typeof MediaTypeEnum>;

export const WorkKindEnum = z.enum(['campaign', 'award', 'faq']);
export type WorkKind = z.infer<typeof WorkKindEnum>;

// Helper for optional URL strings
const optionalUrl = z
  .string()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''))
  .nullable();

export const artistCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  city: z.string().trim().min(1, 'City is required'),
  categories: z.array(z.string().trim()).min(1, 'Select at least one category'),
  // Slug is auto-generated on backend from name; not required from frontend
  slug: z.string().trim().optional(),
  tagline: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
  bio: z.string().trim().optional().nullable(),
  specializations: z.array(z.string().trim()).optional().default([]),
  experienceYears: z.coerce.number().int().nonnegative().optional().nullable(),
  projectsCount: z.coerce.number().int().nonnegative().optional().nullable(),
  liveShowsCount: z.coerce.number().int().nonnegative().optional().nullable(),
  totalFollowersLabel: z.string().trim().optional().nullable(),
  height: z.string().trim().optional().nullable(),
  weightKg: z.coerce.number().int().positive().optional().nullable(),
  waistIn: z.coerce.number().int().positive().optional().nullable(),
  chestIn: z.coerce.number().int().positive().optional().nullable(),
  hairType: z.string().trim().optional().nullable(),
  hairLength: z.string().trim().optional().nullable(),
  languages: z.array(z.string().trim()).optional().default([]),
  artistClass: ArtistClassEnum.optional().default('standard'),
  budgetRange: BudgetRangeEnum.optional().default('not_set'),
  isVerified: z.boolean().optional().default(false),
  isExclusive: z.boolean().optional().default(false),
  status: ArtistStatusEnum.optional().default('draft'),
  profilePhotoUrl: optionalUrl,
  profilePhotoAltText: z.string().trim().optional().nullable(),
  completenessPercent: z.coerce.number().int().min(0).max(100).optional().default(0),
});
export type ArtistCreateInput = z.infer<typeof artistCreateSchema>;

export const artistUpdateSchema = artistCreateSchema.partial();
export type ArtistUpdateInput = z.infer<typeof artistUpdateSchema>;

export const artistPublishSchema = z.object({
  status: z.literal('live'),
  isVerified: z.boolean().optional().default(true),
});
export type ArtistPublishInput = z.infer<typeof artistPublishSchema>;

export const artistMediaSchema = z.object({
  id: z.string().uuid().optional(),
  artistId: z.string().uuid().optional(),
  type: MediaTypeEnum,
  title: z.string().trim().optional().nullable(),
  url: z.string().url('Must be a valid URL'),
  sortOrder: z.coerce.number().int().default(0),
});
export type ArtistMediaInput = z.infer<typeof artistMediaSchema>;

export const artistWorkSchema = z.object({
  id: z.string().uuid().optional(),
  artistId: z.string().uuid().optional(),
  kind: WorkKindEnum,
  title: z.string().trim().min(1, 'Title or question is required'),
  category: z.string().trim().optional().nullable(),
  year: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(), // Answer for FAQ
  imageUrl: optionalUrl,
  sortOrder: z.coerce.number().int().default(0),
});
export type ArtistWorkInput = z.infer<typeof artistWorkSchema>;

export const artistSocialSchema = z.object({
  id: z.string().uuid().optional(),
  artistId: z.string().uuid().optional(),
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  facebookUrl: optionalUrl,
  xUrl: optionalUrl,
  spotifyUrl: optionalUrl,
  spotifyFollowersLabel: z.string().trim().optional().nullable(),
  youtubeSubscribersLabel: z.string().trim().optional().nullable(),
  instagramFollowersLabel: z.string().trim().optional().nullable(),
  facebookFollowersLabel: z.string().trim().optional().nullable(),
  deezerFansLabel: z.string().trim().optional().nullable(),
  soundcloudFollowersLabel: z.string().trim().optional().nullable(),
  tiktokFollowersLabel: z.string().trim().optional().nullable(),
  seoMetaTitle: z.string().trim().max(60, 'SEO title cannot exceed 60 characters').optional().nullable(),
  seoMetaDescription: z.string().trim().max(160, 'SEO description cannot exceed 160 characters').optional().nullable(),
  seoFocusKeyword: z.string().trim().optional().nullable(),
  seoCanonicalUrl: optionalUrl,
  seoShareImageUrl: optionalUrl,
  seoShowInSearch: z.boolean().optional().default(true),
  seoScore: z.coerce.number().int().min(0).max(100).optional().default(0),
});
export type ArtistSocialInput = z.infer<typeof artistSocialSchema>;
