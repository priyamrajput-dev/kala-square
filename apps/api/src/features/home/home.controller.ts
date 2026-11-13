import type { FastifyRequest, FastifyReply } from 'fastify';
import { HomeService } from './home.service.js';
import { HomeConfig } from './home.schema.js';

export class HomeController {
    constructor(private readonly service = new HomeService()) {}

    getPublicHome = async (_request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.service.getPublicHome();
        return reply.status(200).send(result);
    };

    getAdminHome = async (_request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.service.getAdminHome();
        return reply.status(200).send(result);
    };

    saveDraft = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as HomeConfig;
            const result = await this.service.saveDraft(body);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to save draft home config' });
        }
    };

    publish = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as HomeConfig;
            const result = await this.service.publish(body);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to publish home config' });
        }
    };
}
