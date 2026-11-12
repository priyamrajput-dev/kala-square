import { z } from 'zod';

export const venueCreateSchema = z.object({
  slug: z.string().trim().optional(),
  name: z.string().trim().min(1, 'Venue name is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  capacity: z.coerce.number().int().positive().optional().nullable(),
  priceLabel: z.string().trim().optional().nullable(),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')).nullable(),
  description: z.string().trim().optional().nullable(),
  status: z.enum(['draft', 'live']).optional().default('draft'),
});
export type VenueCreateInput = z.infer<typeof venueCreateSchema>;

export const venueUpdateSchema = venueCreateSchema.partial();
export type VenueUpdateInput = z.infer<typeof venueUpdateSchema>;
