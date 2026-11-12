import { z } from 'zod';

export const SectionKeyEnum = z.enum([
  'hero',
  'platinum',
  'category',
  'spotlight',
  'events',
  'rising',
  'venues',
]);
export type SectionKey = z.infer<typeof SectionKeyEnum>;

export const heroImageItemSchema = z.object({
  imageUrl: z.string().url('Must be a valid image URL'),
  linkUrl: z.string().optional().or(z.literal('')).nullable(),
  altText: z.string().trim().optional().nullable(),
});
export type HeroImageItem = z.infer<typeof heroImageItemSchema>;

export const homeSectionUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  orderedIds: z.array(z.string().trim()).optional(),
  heroImages: z.array(heroImageItemSchema).optional(),
  isVisible: z.boolean().optional(),
});
export type HomeSectionUpdateInput = z.infer<typeof homeSectionUpdateSchema>;

export const homeSectionSchema = z.object({
  id: z.string().uuid().optional(),
  sectionKey: SectionKeyEnum,
  title: z.string().trim().min(1),
  orderedIds: z.array(z.string()).default([]),
  heroImages: z.array(heroImageItemSchema).default([]),
  isVisible: z.boolean().default(true),
});
export type HomeSectionDTO = z.infer<typeof homeSectionSchema>;
