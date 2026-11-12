// Shared middlewares for Fastify (only for logic used across multiple features)
import type { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(_request: FastifyRequest, _reply: FastifyReply) {
    // TODO: Cross-cutting authentication middleware hook
}

export async function requireAdmin(_request: FastifyRequest, _reply: FastifyReply) {
    // TODO: Admin authorization check middleware hook
}
