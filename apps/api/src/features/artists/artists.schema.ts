import { z } from 'zod';

export const videoItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Video title is required').max(100, 'Title too long (max 100)'),
  url: z
    .string()
    .url('Invalid YouTube URL')
    .refine(
      (u) => u.includes('youtube.com') || u.includes('youtu.be'),
      'Must be a valid YouTube URL (youtube.com or youtu.be)'
    ),
  duration: z.string().max(20).optional(),
});

export const clipItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Clip title is required').max(100, 'Title too long (max 100)'),
  url: z.string().url('Invalid URL'),
  platform: z.enum(['YouTube Shorts', 'Instagram Reels', 'TikTok']),
});

export const campaignItemFormSchema = z.object({
  id: z.string().optional(),
  brandName: z.string().min(1, 'Brand name is required').max(80, 'Brand name too long (max 80)'),
  category: z.string().max(60).optional(),
  year: z.string().regex(/^(199\d|20[0-2]\d)$/, 'Year must be between 1990 and 2026'),
  description: z.string().max(300, 'Description too long (max 300)').optional(),
  imageUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export const awardItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Award title is required').max(100, 'Award title too long (max 100)'),
  category: z.string().max(60).optional(),
  year: z.string().regex(/^(199\d|20[0-2]\d)$/, 'Year must be between 1990 and 2026'),
  description: z.string().max(300, 'Description too long (max 300)').optional(),
});

export const faqItemFormSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question too long (max 200)'),
  answer: z.string().min(1, 'Answer is required').max(500, 'Answer too long (max 500)'),
});

export const galleryItemFormSchema = z.object({
  id: z.string(),
  src: z.string().min(1, 'Image source is required'),
  caption: z.string().max(80, 'Caption too long (max 80)').optional(),
});

export const artistBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(80, 'Slug cannot exceed 80 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only, no spaces or special characters')
    .optional(),
  tagline: z.string().max(120, 'Tagline cannot exceed 120 characters').optional(),
  photoUrl: z.string().min(1, 'Profile photo is required').optional(),
  coverPhotoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().min(1, 'State is required').optional(),
  artistClass: z.enum(['platinum', 'gold', 'rising', 'new', 'emerging', 'standard']).default('standard'),
  isVerified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  bio: z.string().max(2000, 'Bio cannot exceed 2000 characters').optional(),
  languages: z.array(z.string()).default([]),
  specializations: z.string().max(200, 'Specializations cannot exceed 200 characters').optional(),
  height: z.string().max(20).optional(),
  weight: z.string().max(20).optional(),
  waist: z.string().max(20).optional(),
  chest: z.string().max(20).optional(),
  hairType: z.enum(['Straight', 'Wavy', 'Curly', '']).optional(),
  hairLength: z.enum(['Short', 'Medium', 'Long', '']).optional(),
  experienceYears: z.string().max(20).optional(),
  projectsCount: z.string().max(20).optional(),
  liveShowsCount: z.string().max(20).optional(),

  categories: z.array(z.string()).default([]),
  priceFrom: z.coerce.number().min(0, 'Price must be positive').optional(),
  priceTo: z.coerce.number().min(0, 'Price must be positive').optional(),
  availability: z.enum(['Available', 'Busy', 'On Tour']).default('Available'),
  bookingNote: z.string().max(300, 'Booking note cannot exceed 300 characters').optional(),

  instagram: z.string().url('Invalid Instagram URL').or(z.literal('')).optional(),
  youtube: z.string().url('Invalid YouTube URL').or(z.literal('')).optional(),
  facebook: z.string().url('Invalid Facebook URL').or(z.literal('')).optional(),
  x: z.string().url('Invalid X/Twitter URL').or(z.literal('')).optional(),
  spotify: z.string().url('Invalid Spotify URL').or(z.literal('')).optional(),
  website: z.string().url('Invalid Website URL').or(z.literal('')).optional(),
  imdbUrl: z.string().url('Invalid IMDb URL').or(z.literal('')).optional(),

  fanbaseSpotify: z.coerce.number().min(0).optional(),
  fanbaseYouTube: z.coerce.number().min(0).optional(),
  fanbaseInstagram: z.coerce.number().min(0).optional(),
  fanbaseFacebook: z.coerce.number().min(0).optional(),
  fanbaseDeezer: z.coerce.number().min(0).optional(),
  fanbaseSoundCloud: z.coerce.number().min(0).optional(),
  fanbaseTikTok: z.coerce.number().min(0).optional(),

  gallery: z.array(galleryItemFormSchema).max(12, 'Maximum 12 photos allowed in gallery').default([]),
  videos: z.array(videoItemFormSchema).max(6, 'Maximum 6 videos allowed').default([]),
  clips: z.array(clipItemFormSchema).max(8, 'Maximum 8 short clips allowed').default([]),
  campaigns: z.array(campaignItemFormSchema).max(6, 'Maximum 6 campaigns allowed').default([]),
  awards: z.array(awardItemFormSchema).max(8, 'Maximum 8 awards allowed').default([]),
  faqs: z.array(faqItemFormSchema).max(8, 'Maximum 8 FAQs allowed').default([]),

  metaTitle: z.string().max(60, 'Meta title should not exceed 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should not exceed 160 characters').optional(),
  keywords: z.string().max(200, 'Keywords should not exceed 200 characters').optional(),
  ogImageUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),

  status: z.enum(['draft', 'published', 'pending', 'archived', 'live']).default('draft'),
  publishDate: z.string().optional(),
});

// Full schema for "Publish" with price range refinement
export const artistFormSchema = artistBaseSchema.refine(
  (data) => {
    if (data.priceTo && data.priceFrom && data.priceTo > 0 && data.priceFrom > 0) {
      return data.priceTo >= data.priceFrom;
    }
    return true;
  },
  {
    message: 'Price To must be greater than or equal to Price From',
    path: ['priceTo'],
  }
);

export type ArtistFormData = z.infer<typeof artistFormSchema>;

export const publicArtistQuerySchema = z.object({
  category: z.string().optional(),
  artistClass: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});
export type PublicArtistQuery = z.infer<typeof publicArtistQuerySchema>;

export const adminArtistQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  artistClass: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
export type AdminArtistQuery = z.infer<typeof adminArtistQuerySchema>;
