import { z } from 'zod';

export const enquiryCreateInputSchema = z.object({
    artistId: z.string().optional(),
    customerName: z.string().min(2, 'Name is required'),
    customerPhone: z.string().min(10, 'Valid phone number is required'),
    customerEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
    eventDate: z.string().optional(),
    eventType: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().min(5, 'Message must be at least 5 characters'),
});
export type EnquiryCreateInput = z.infer<typeof enquiryCreateInputSchema>;

export const enquiryStatusUpdateSchema = z.object({
    status: z.enum(['new', 'contacted', 'booked', 'closed']),
});
export type EnquiryStatusUpdate = z.infer<typeof enquiryStatusUpdateSchema>;

export const enquiryNoteCreateSchema = z.object({
    note: z.string().min(1, 'Note text is required'),
});
export type EnquiryNoteCreate = z.infer<typeof enquiryNoteCreateSchema>;

export const adminEnquiryQuerySchema = z.object({
    status: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});
export type AdminEnquiryQuery = z.infer<typeof adminEnquiryQuerySchema>;
