import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.literal('admin'),
  }),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
