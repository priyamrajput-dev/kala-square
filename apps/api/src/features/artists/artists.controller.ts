import type { FastifyRequest, FastifyReply } from 'fastify';
import { ArtistsService } from './artists.service.js';
import { PublicArtistQuery, AdminArtistQuery } from './artists.schema.js';

export class ArtistsController {
    constructor(private readonly service = new ArtistsService()) {}

    getPublicArtists = async (request: FastifyRequest, reply: FastifyReply) => {
        const query = request.query as PublicArtistQuery;
        const result = await this.service.getPublicArtists(query);
        return reply.status(200).send(result);
    };

    getPublicArtistBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { slug } = request.params as { slug: string };
            const result = await this.service.getPublicArtistBySlug(slug);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 404).send({ error: err.message || 'Artist not found' });
        }
    };

    getAdminArtists = async (request: FastifyRequest, reply: FastifyReply) => {
        const query = request.query as AdminArtistQuery;
        const result = await this.service.getAdminArtists(query);
        return reply.status(200).send(result);
    };

    getArtistById = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.getArtistForEdit(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 404).send({ error: err.message || 'Artist not found' });
        }
    };

    createArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const result = await this.service.createArtist(request.body);
            return reply.status(201).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to create artist' });
        }
    };

    updateArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.updateArtist(id, request.body);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to update artist' });
        }
    };

    deleteArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.deleteArtist(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to delete artist' });
        }
    };

    duplicateArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.duplicateArtist(id);
            return reply.status(201).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to duplicate artist' });
        }
    };

    publishArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.publishArtist(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to publish artist' });
        }
    };

    unpublishArtist = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.unpublishArtist(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to unpublish artist' });
        }
    };

    getCompleteness = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.getArtistCompleteness(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 404).send({ error: err.message || 'Artist not found' });
        }
    };
}
