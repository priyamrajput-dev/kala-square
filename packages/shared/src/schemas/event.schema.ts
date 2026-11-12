import { z } from 'zod';

export const EventBadgeEnum = z.enum(['trending', 'new', 'filling_fast', 'ks_original', 'none']);
export type EventBadge = z.infer<typeof EventBadgeEnum>;

export const eventCreateSchema = z.object({
  slug: z.string().trim().optional(),
  title: z.string().trim().min(1, 'Event title is required'),
  date: z.coerce.date().optional().nullable(),
  city: z.string().trim().min(1, 'City is required'),
  venueName: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  badge: EventBadgeEnum.optional().default('none'),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')).nullable(),
  description: z.string().trim().optional().nullable(),
  status: z.enum(['draft', 'live']).optional().default('draft'),
});
export type EventCreateInput = z.infer<typeof eventCreateSchema>;

export const eventUpdateSchema = eventCreateSchema.partial();
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
