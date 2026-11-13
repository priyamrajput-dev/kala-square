import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UploadsController } from './uploads.controller.js';
import { requireAdmin } from '../../common/middlewares.js';

export const uploadsRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new UploadsController();

    fastify.post(
        '/admin/uploads',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin upload image (JPG, PNG, WebP up to 5MB)',
                tags: ['Uploads'],
            },
        },
        controller.upload
    );
};
