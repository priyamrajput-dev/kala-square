import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
    serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { env } from './config/env.js';

import { authRoutes } from './features/auth/auth.routes.js';
import { artistsRoutes } from './features/artists/artists.routes.js';
import { homeRoutes } from './features/home/home.routes.js';
import { enquiriesRoutes } from './features/enquiries/enquiries.routes.js';
import { venuesRoutes } from './features/venues/venues.routes.js';
import { uploadsRoutes } from './features/uploads/uploads.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = env.UPLOAD_DIR || path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: {
            level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
        },
    }).withTypeProvider<ZodTypeProvider>();

    // Set validator and serializer compiler to Zod
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Register plugins
    await app.register(sensible);
    await app.register(cors, {
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);
            if (
                origin.includes('localhost') ||
                origin.includes('127.0.0.1') ||
                origin.includes('kalasquare.com') ||
                origin.endsWith('.vercel.app') ||
                (env.CORS_ORIGIN && env.CORS_ORIGIN !== '*' && origin === env.CORS_ORIGIN) ||
                env.CORS_ORIGIN === '*'
            ) {
                return cb(null, true);
            }
            return cb(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
    });

    // Multipart support for file uploads (max 5MB)
    await app.register(multipart, {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });

    // Serve uploaded files statically at /uploads/
    await app.register(fastifyStatic, {
        root: UPLOADS_DIR,
        prefix: '/uploads/',
        decorateReply: false,
    });

    // Register Swagger with Zod JSON Schema transform
    await app.register(swagger, {
        openapi: {
            info: {
                title: 'Kalasquare API',
                description: 'Kalasquare Artist Management & Booking Platform API Documentation',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3001',
                    description: 'Development server',
                },
            ],
            tags: [
                { name: 'System', description: 'System health & diagnostic endpoints' },
                { name: 'Auth', description: 'Authentication & admin session management' },
                { name: 'Artists', description: 'Artist profiles, discovery & administration' },
                { name: 'Home', description: 'Homepage layout and showcase configuration' },
                { name: 'Enquiries', description: 'Booking enquiries & lead management' },
                { name: 'Venues', description: 'Venue locations & event arenas' },
                { name: 'Uploads', description: 'Media upload and file management' },
            ],
        },
        transform: jsonSchemaTransform,
    });

    // Register Swagger UI at /docs
    await app.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
        staticCSP: false,
    });

    // Also alias /api/docs to /docs
    app.get('/api/docs', async (_req, reply) => {
        return reply.redirect('/docs');
    });

    // Root endpoint
    app.get(
        '/',
        {
            schema: {
                description: 'API root welcome endpoint',
                tags: ['System'],
                response: {
                    200: z.object({
                        name: z.string(),
                        status: z.string(),
                        docs: z.string(),
                    }),
                },
            },
        },
        async () => {
            return {
                name: 'Kalasquare API',
                status: 'online',
                docs: '/api/docs',
            };
        },
    );

    // Health check endpoint
    const healthResponse = async () => {
        return {
            status: 'ok' as const,
            db: 'connected' as const,
            time: new Date().toISOString(),
        };
    };

    app.get(
        '/health',
        {
            schema: {
                description: 'Health check diagnostic endpoint',
                tags: ['System'],
                response: {
                    200: z.object({
                        status: z.string(),
                        db: z.string(),
                        time: z.string(),
                    }),
                },
            },
        },
        healthResponse,
    );

    app.get(
        '/api/health',
        {
            schema: {
                description: 'API health check diagnostic endpoint',
                tags: ['System'],
                response: {
                    200: z.object({
                        status: z.string(),
                        db: z.string(),
                        time: z.string(),
                    }),
                },
            },
        },
        healthResponse,
    );

    // Register Feature Routes
    await app.register(authRoutes, { prefix: '/api/auth' });
    await app.register(artistsRoutes, { prefix: '/api' });
    await app.register(homeRoutes, { prefix: '/api' });
    await app.register(enquiriesRoutes, { prefix: '/api' });
    await app.register(venuesRoutes, { prefix: '/api' });
    await app.register(uploadsRoutes, { prefix: '/api' });

    return app;
}
