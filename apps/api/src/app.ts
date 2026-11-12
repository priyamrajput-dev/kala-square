import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { HealthResponseSchema } from '@kalasquare/shared';

import { authRoutes } from './features/auth/auth.routes.js';
import { artistsRoutes } from './features/artists/artists.routes.js';
import { homeRoutes } from './features/home/home.routes.js';
import { enquiriesRoutes } from './features/enquiries/enquiries.routes.js';
import { venuesRoutes } from './features/venues/venues.routes.js';
import { uploadsRoutes } from './features/uploads/uploads.routes.js';

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
    origin: true,
    credentials: true,
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
        { name: 'Auth', description: 'Authentication & session management' },
        { name: 'Artists', description: 'Artist profiles & directory' },
        { name: 'Home', description: 'Homepage layout and showcase configuration' },
        { name: 'Enquiries', description: 'Artist booking enquiries' },
        { name: 'Venues', description: 'Venue locations & listings' },
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
    staticCSP: true,
  });

  // Root & Health check routes
  app.get('/', {
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
  }, async () => {
    return {
      name: 'Kalasquare API',
      status: 'online',
      docs: '/docs',
    };
  });

  app.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['System'],
      response: {
        200: HealthResponseSchema,
      },
    },
  }, async () => {
    return {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Register Feature Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(artistsRoutes, { prefix: '/api/v1/artists' });
  await app.register(homeRoutes, { prefix: '/api/v1/home' });
  await app.register(enquiriesRoutes, { prefix: '/api/v1/enquiries' });
  await app.register(venuesRoutes, { prefix: '/api/v1/venues' });
  await app.register(uploadsRoutes, { prefix: '/api/v1/uploads' });

  return app;
}
