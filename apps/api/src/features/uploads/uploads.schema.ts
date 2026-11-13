import { z } from 'zod';

export const uploadResponseSchema = z.object({
    url: z.string(),
    filename: z.string().optional(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
