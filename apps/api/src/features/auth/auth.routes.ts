import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { adminLoginSchema } from './auth.schema.js';
import { requireAdmin } from '../../common/middlewares.js';

export const authRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new AuthController();

    fastify.post(
        '/login',
        {
            schema: {
                description: 'Admin login with email and password',
                tags: ['Auth'],
                body: adminLoginSchema,
                response: {
                    200: z.object({
                        token: z.string(),
                        user: z.object({
                            id: z.string(),
                            email: z.string(),
                            name: z.string(),
                            role: z.literal('admin'),
                        }),
                    }),
                    401: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        controller.login
    );

    fastify.get(
        '/me',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Get current authenticated admin user',
                tags: ['Auth'],
                response: {
                    200: z.object({
                        user: z.object({
                            id: z.string(),
                            email: z.string(),
                            name: z.string(),
                            role: z.literal('admin'),
                        }),
                    }),
                    401: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        controller.me
    );

    fastify.post(
        '/logout',
        {
            schema: {
                description: 'Admin logout',
                tags: ['Auth'],
                response: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            },
        },
        controller.logout
    );
};
