import { getDb, users } from '@kalasquare/db';
import { eq } from 'drizzle-orm';
import { env } from '../../config/env.js';

export class AuthRepository {
    async findByEmail(email: string) {
        try {
            const db = getDb();
            const result = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
            if (result.length > 0) {
                return result[0];
            }
        } catch {
            // Fallback to configured admin in env
        }

        if (email.toLowerCase().trim() === env.ADMIN_EMAIL.toLowerCase().trim()) {
            return {
                id: '00000000-0000-0000-0000-000000000001',
                email: env.ADMIN_EMAIL,
                passwordHash: env.ADMIN_PASSWORD_HASH,
                name: 'Kalasquare Admin',
                role: 'admin' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        return null;
    }
}
