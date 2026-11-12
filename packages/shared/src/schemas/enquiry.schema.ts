import { z } from 'zod';

export const EnquiryStatusEnum = z.enum(['new', 'contacted', 'closed']);
export type EnquiryStatus = z.infer<typeof EnquiryStatusEnum>;

export const enquiryCreateSchema = z.object({
  artistId: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
  city: z.string().trim().optional().nullable(),
  eventDate: z.string().trim().optional().nullable(),
  budgetRange: z.string().trim().optional().nullable(),
  message: z.string().trim().min(1, 'Message is required'),
});
export type EnquiryCreateInput = z.infer<typeof enquiryCreateSchema>;

export const enquiryUpdateStatusSchema = z.object({
  status: EnquiryStatusEnum,
});
export type EnquiryUpdateStatusInput = z.infer<typeof enquiryUpdateStatusSchema>;

export const enquirySchema = enquiryCreateSchema.extend({
  id: z.string().uuid(),
  status: EnquiryStatusEnum.default('new'),
  createdAt: z.date().or(z.string()),
});
export type EnquiryDTO = z.infer<typeof enquirySchema>;
