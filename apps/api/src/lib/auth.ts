// Authentication and token helpers for Fastify API
// TODO: Implement authentication token signing and verification logic
export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'artist' | 'user';
}

export function verifyAuthToken(_token: string): AuthUser | null {
    // TODO: Verify JWT or session token
    return null;
}
