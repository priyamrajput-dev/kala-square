import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { HomeController } from './home.controller.js';
import { homeConfigSchema } from './home.schema.js';
import { requireAdmin } from '../../common/middlewares.js';

export const homeRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new HomeController();

    // Public Home Page Endpoint
    fastify.get(
        '/public/home',
        {
            schema: {
                description: 'Get live published home page configuration and curated sections data',
                tags: ['Home'],
            },
        },
        controller.getPublicHome
    );

    // Admin Home Page Manager Endpoints
    fastify.get(
        '/admin/home-page',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin get full home page configuration (both draft and published)',
                tags: ['Home'],
            },
        },
        controller.getAdminHome
    );

    fastify.put(
        '/admin/home-page',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin save home page configuration as draft',
                tags: ['Home'],
                body: homeConfigSchema,
            },
        },
        controller.saveDraft
    );

    fastify.post(
        '/admin/home-page/publish',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin validate and publish home page configuration to live site',
                tags: ['Home'],
                body: homeConfigSchema,
            },
        },
        controller.publish
    );
};
