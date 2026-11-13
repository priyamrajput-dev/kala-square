import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAuthToken, AuthUser } from '../lib/auth.js';

declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
    }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized: Admin authentication token required' });
    }

    const token = authHeader.substring(7).trim();
    const user = verifyAuthToken(token);

    if (!user) {
        return reply.status(401).send({ error: 'Unauthorized: Invalid or expired token' });
    }

    request.user = user;
}
