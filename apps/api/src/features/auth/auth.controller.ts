import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service.js';
import { AdminLoginInput } from './auth.schema.js';

export class AuthController {
    constructor(private readonly authService = new AuthService()) {}

    login = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as AdminLoginInput;
            const result = await this.authService.login(body);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 401).send({ error: err.message || 'Invalid credentials' });
        }
    };

    me = async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        return reply.status(200).send({ user: request.user });
    };

    logout = async (_request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ success: true });
    };
}
