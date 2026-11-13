import { z } from 'zod';

export const venueUpsertSchema = z.object({
    name: z.string().min(2, 'Venue name is required'),
    code: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    category: z.string().optional(),
    capacity: z.coerce.number().min(0).optional(),
    priceFrom: z.coerce.number().min(0).optional(),
    priceLabel: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').or(z.literal('')).optional(),
    description: z.string().optional(),
    status: z.enum(['draft', 'live']).default('live'),
});
export type VenueUpsertInput = z.infer<typeof venueUpsertSchema>;
