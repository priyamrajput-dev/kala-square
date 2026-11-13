import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { VenuesController } from './venues.controller.js';
import { venueUpsertSchema } from './venues.schema.js';
import { requireAdmin } from '../../common/middlewares.js';

export const venuesRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new VenuesController();

    // Public Route
    fastify.get(
        '/public/venues',
        {
            schema: {
                description: 'Get published venues for showcase',
                tags: ['Venues'],
                querystring: z.object({
                    limit: z.coerce.number().min(1).max(20).default(3),
                }),
            },
        },
        controller.getPublicVenues
    );

    // Admin Routes
    fastify.get(
        '/admin/venues',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin list all venues',
                tags: ['Venues'],
            },
        },
        controller.getAllVenues
    );

    fastify.get(
        '/admin/venues/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin get venue by ID',
                tags: ['Venues'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.getVenueById
    );

    fastify.post(
        '/admin/venues',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin create venue',
                tags: ['Venues'],
                body: venueUpsertSchema,
            },
        },
        controller.createVenue
    );

    fastify.put(
        '/admin/venues/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin update venue',
                tags: ['Venues'],
                params: z.object({
                    id: z.string().min(1),
                }),
                body: venueUpsertSchema,
            },
        },
        controller.updateVenue
    );

    fastify.delete(
        '/admin/venues/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin delete venue',
                tags: ['Venues'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.deleteVenue
    );
};
