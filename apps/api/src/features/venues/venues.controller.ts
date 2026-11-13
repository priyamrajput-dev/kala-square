import type { FastifyRequest, FastifyReply } from 'fastify';
import { VenuesService } from './venues.service.js';
import { VenueUpsertInput } from './venues.schema.js';

export class VenuesController {
    constructor(private readonly service = new VenuesService()) {}

    getPublicVenues = async (request: FastifyRequest, reply: FastifyReply) => {
        const { limit } = (request.query as { limit?: number }) || {};
        const result = await this.service.getPublicVenues(Number(limit) || 3);
        return reply.status(200).send({ data: result });
    };

    getAllVenues = async (_request: FastifyRequest, reply: FastifyReply) => {
        const result = await this.service.getAllVenues();
        return reply.status(200).send({ data: result });
    };

    getVenueById = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.getVenueById(id);
            return reply.status(200).send({ data: result });
        } catch (err: any) {
            return reply.status(err.statusCode || 404).send({ error: err.message || 'Venue not found' });
        }
    };

    createVenue = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as VenueUpsertInput;
            const result = await this.service.createVenue(body);
            return reply.status(201).send({ data: result });
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to create venue' });
        }
    };

    updateVenue = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const body = request.body as VenueUpsertInput;
            const result = await this.service.updateVenue(id, body);
            return reply.status(200).send({ data: result });
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to update venue' });
        }
    };

    deleteVenue = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.deleteVenue(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to delete venue' });
        }
    };
}
