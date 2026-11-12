import { z } from 'zod';

export const UploadFileResponseSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  size: z.number(),
  mimeType: z.string(),
});
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;
