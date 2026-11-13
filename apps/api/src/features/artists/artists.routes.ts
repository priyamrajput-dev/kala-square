import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { ArtistsController } from './artists.controller.js';
import {
    publicArtistQuerySchema,
    adminArtistQuerySchema,
    artistBaseSchema,
    artistFormSchema,
} from './artists.schema.js';
import { requireAdmin } from '../../common/middlewares.js';

export const artistsRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new ArtistsController();

    // ==========================================
    // PUBLIC ROUTES (No Auth Required)
    // ==========================================
    fastify.get(
        '/public/artists',
        {
            schema: {
                description: 'Get paginated list of published artists with filters',
                tags: ['Artists'],
                querystring: publicArtistQuerySchema,
            },
        },
        controller.getPublicArtists
    );

    fastify.get(
        '/public/artists/:slug',
        {
            schema: {
                description: 'Get full published artist profile by slug (404 if draft/unpublished)',
                tags: ['Artists'],
                params: z.object({
                    slug: z.string().min(1),
                }),
            },
        },
        controller.getPublicArtistBySlug
    );

    // ==========================================
    // ADMIN ROUTES (Require Admin Auth)
    // ==========================================
    fastify.get(
        '/admin/artists',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin list all artists with completeness percentage',
                tags: ['Artists'],
                querystring: adminArtistQuerySchema,
            },
        },
        controller.getAdminArtists
    );

    fastify.post(
        '/admin/artists',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin create a new artist profile (draft or published)',
                tags: ['Artists'],
                body: artistFormSchema,
            },
        },
        controller.createArtist
    );

    fastify.get(
        '/admin/artists/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin get full artist details for editing',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.getArtistById
    );

    fastify.put(
        '/admin/artists/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin update full artist details',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
                body: artistFormSchema,
            },
        },
        controller.updateArtist
    );

    fastify.delete(
        '/admin/artists/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin hard delete artist and all associated media',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.deleteArtist
    );

    fastify.post(
        '/admin/artists/:id/duplicate',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin duplicate an artist profile as draft with -copy slug',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.duplicateArtist
    );

    fastify.patch(
        '/admin/artists/:id/publish',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin publish an artist profile to make it live publicly',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.publishArtist
    );

    fastify.patch(
        '/admin/artists/:id/unpublish',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin unpublish artist profile (public page returns 404)',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.unpublishArtist
    );

    fastify.get(
        '/admin/artists/:id/completeness',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin get profile completeness score and missing tips',
                tags: ['Artists'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.getCompleteness
    );
};
