import { z } from 'zod';

export * from './schemas/artist.schema.js';
export * from './schemas/home.schema.js';
export * from './schemas/enquiry.schema.js';
export * from './schemas/auth.schema.js';
export * from './schemas/venue.schema.js';
export * from './schemas/event.schema.js';

// Common System Schemas
export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  uptime: z.number(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
