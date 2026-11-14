import { z } from 'zod';

export const videoItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(100, 'Title too long (max 100)').optional(),
  url: z.string().optional(),
  duration: z.string().max(20).optional(),
});

export const clipItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(100, 'Title too long (max 100)').optional(),
  url: z.string().optional(),
  platform: z.string().optional(),
});

export const campaignItemFormSchema = z.object({
  id: z.string().optional(),
  brandName: z.string().max(80, 'Brand name too long (max 80)').optional(),
  category: z.string().max(60).optional(),
  year: z.string().optional(),
  description: z.string().max(300, 'Description too long (max 300)').optional(),
  imageUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export const awardItemFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(100, 'Award title too long (max 100)').optional(),
  category: z.string().max(60).optional(),
  year: z.string().optional(),
  description: z.string().max(300, 'Description too long (max 300)').optional(),
});

export const faqItemFormSchema = z.object({
  id: z.string().optional(),
  question: z.string().max(200, 'Question too long (max 200)').optional(),
  answer: z.string().max(500, 'Answer too long (max 500)').optional(),
});

export const galleryItemFormSchema = z.object({
  id: z.string().optional(),
  src: z.string().optional(),
  caption: z.string().max(80, 'Caption too long (max 80)').optional(),
});

// Full schema for "Publish"
export const artistFormSchema = z.object({
  // 1. Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(80, 'Slug cannot exceed 80 characters'),
  tagline: z.string().max(160).optional(),
  photoUrl: z.string().optional(),
  coverPhotoUrl: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  artistClass: z.enum(['platinum', 'gold', 'rising', 'new', 'emerging', 'standard']).default('standard'),
  priceNumeric: z.coerce.number().optional(),
  priceLabel: z.string().optional(),
  budgetRange: z.string().optional(),
  isVerified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  showInAboutUs: z.boolean().default(false),

  // 2. About & Physical Stats
  bio: z.string().max(2500).optional(),
  languages: z.array(z.string()).optional(),
  specializations: z.string().max(250).optional(),
  height: z.string().max(20).optional(),
  weight: z.string().max(20).optional(),
  waist: z.string().max(20).optional(),
  chest: z.string().max(20).optional(),
  hairType: z.string().optional(),
  hairLength: z.string().optional(),
  experienceYears: z.string().max(20).optional(),
  projectsCount: z.string().max(20).optional(),
  liveShowsCount: z.string().max(20).optional(),
  totalFollowersLabel: z.string().max(20).optional(),

  // 3. Categories & Pricing
  categories: z.array(z.string()).min(1, 'Select at least 1 category'),
  priceFrom: z.coerce.number().min(0).optional(),
  priceTo: z.coerce.number().min(0).optional(),
  availability: z.string().optional(),
  bookingNote: z.string().optional(),

  // 4. Social Links & Fanbase
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  facebook: z.string().optional(),
  x: z.string().optional(),
  spotify: z.string().optional(),
  website: z.string().optional(),
  imdbUrl: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialYouTube: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialX: z.string().optional(),
  socialSpotify: z.string().optional(),

  fanbaseSpotify: z.union([z.string(), z.number()]).optional(),
  fanbaseYouTube: z.union([z.string(), z.number()]).optional(),
  fanbaseInstagram: z.union([z.string(), z.number()]).optional(),
  fanbaseFacebook: z.union([z.string(), z.number()]).optional(),
  fanbaseDeezer: z.union([z.string(), z.number()]).optional(),
  fanbaseSoundCloud: z.union([z.string(), z.number()]).optional(),
  fanbaseTikTok: z.union([z.string(), z.number()]).optional(),

  // 5. Gallery
  gallery: z.array(z.union([z.string(), galleryItemFormSchema])).optional(),

  // 6. Videos & Clips
  videos: z.array(videoItemFormSchema).optional(),
  clips: z.array(clipItemFormSchema).optional(),

  // 7. Campaigns & Awards
  campaigns: z.array(campaignItemFormSchema).optional(),
  awards: z.array(awardItemFormSchema).optional(),

  // 8. FAQs (Platinum Only)
  faqs: z.array(faqItemFormSchema).optional(),

  // 9. SEO
  metaTitle: z.string().max(80).optional(),
  metaDescription: z.string().max(200).optional(),
  keywords: z.string().optional(),
  focusKeyword: z.string().optional(),
  photoAltText: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  allowSearchEngines: z.boolean().default(true),

  // 10. Publish Settings
  status: z.enum(['draft', 'published']).default('draft'),
  publishDate: z.string().optional(),
});

export type ArtistFormData = z.infer<typeof artistFormSchema>;

// Relaxed Schema for "Save as Draft"
export const artistDraftSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  categories: z.array(z.string()).optional(),
  city: z.string().optional(),
});
