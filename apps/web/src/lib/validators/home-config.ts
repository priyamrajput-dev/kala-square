import { z } from 'zod';

export const heroSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  eyebrow: z.string().max(80).default('KalaSquare Talent Network'),
  heading: z.string().min(1, 'Hero heading is required').max(120),
  subtext: z.string().min(1, 'Hero subtext is required').max(300),
  primaryButtonText: z.string().min(1).max(50).default('Explore Artists'),
  secondaryButtonText: z.string().min(1).max(50).default('Book a Creator'),
  artistsCount: z.string().max(20).default('10,000+'),
  eventsCount: z.string().max(20).default('500+'),
  rating: z.string().max(20).default('4.9/5'),
  showStats: z.boolean().default(true),
});

export const artistListSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Section title is required').max(80),
  subtitle: z.string().max(160).default(''),
  viewAllText: z.string().max(40).default('View All'),
  artistIds: z.array(z.string()).max(4, 'Maximum 4 artists allowed'),
});

export const categoryItemConfigSchema = z.object({
  slug: z.string(),
  name: z.string(),
  count: z.number().min(0),
  isVisible: z.boolean().default(true),
});

export const categoriesSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(80),
  subtitle: z.string().max(160).default(''),
  items: z.array(categoryItemConfigSchema).max(12),
});

export const spotlightArticleSchema = z.object({
  title: z.string().min(1, 'Article title is required'),
  description: z.string().max(300).default(''),
  imageUrl: z.string().default(''),
  link: z.string().default(''),
});

export const smallArticleSchema = z.object({
  title: z.string().min(1, 'Article title is required'),
  tag: z.string().default('Featured'),
  imageUrl: z.string().default(''),
  link: z.string().default(''),
});

export const spotlightsSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(80),
  subtitle: z.string().max(160).default(''),
  featuredArticle: spotlightArticleSchema,
  smallArticles: z.array(smallArticleSchema).max(2),
});

export const eventItemConfigSchema = z.object({
  id: z.string(),
  badge: z.enum(['Trending', 'New', 'Filling Fast', 'KS Original', 'none']).default('Trending'),
});

export const eventsSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(80),
  subtitle: z.string().max(160).default(''),
  items: z.array(eventItemConfigSchema).max(4, 'Maximum 4 events allowed'),
});

export const venuesSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(80),
  subtitle: z.string().max(160).default(''),
  venueIds: z.array(z.string()).max(3, 'Maximum 3 venues allowed'),
});

export const faqItemConfigSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200),
  answer: z.string().min(1, 'Answer is required').max(600),
});

export const faqSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(80),
  subtitle: z.string().max(160).default(''),
  buttonText: z.string().max(40).default('Ask a Question'),
  items: z.array(faqItemConfigSchema).max(4, 'Maximum 4 FAQs for Home Page'),
});

export const footerSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  infoLinks: z.array(z.string()).default([]),
  usefulLinks: z.array(z.string()).default([]),
  instagramUrl: z.string().url().or(z.literal('')).default(''),
  youtubeUrl: z.string().url().or(z.literal('')).default(''),
  facebookUrl: z.string().url().or(z.literal('')).default(''),
  xUrl: z.string().url().or(z.literal('')).default(''),
  copyrightText: z.string().max(120).default('© 2026 KalaSquare. All rights reserved.'),
});

export const enquiryCtaSectionConfigSchema = z.object({
  isVisible: z.boolean().default(true),
  title: z.string().min(1, 'Title is required').max(100),
  subtext: z.string().max(160).default(''),
  buttonText: z.string().min(1).max(50).default('Send Booking Enquiry'),
  mobileOnly: z.boolean().default(true),
});

export const homeConfigSchema = z.object({
  lastSaved: z.string().optional(),
  lastPublished: z.string().optional(),
  sectionOrder: z.array(z.string()),
  hero: heroSectionConfigSchema,
  platinum: artistListSectionConfigSchema,
  newTalent: artistListSectionConfigSchema,
  categories: categoriesSectionConfigSchema,
  spotlights: spotlightsSectionConfigSchema,
  events: eventsSectionConfigSchema,
  rising: artistListSectionConfigSchema,
  venues: venuesSectionConfigSchema,
  faq: faqSectionConfigSchema,
  footer: footerSectionConfigSchema,
  enquiryCta: enquiryCtaSectionConfigSchema,
});

export type HomeConfig = z.infer<typeof homeConfigSchema>;

