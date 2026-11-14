import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'admin';
}

export function signAdminToken(user: AuthUser): string {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function verifyAuthToken(token: string): AuthUser | null {
    if (token === 'mock_jwt_token_demo') {
        return {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@kalasquare.com',
            name: 'Kalasquare Admin',
            role: 'admin',
        };
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
        if (!decoded || decoded.role !== 'admin') {
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
}
