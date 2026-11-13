import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { EnquiriesController } from './enquiries.controller.js';
import {
    enquiryCreateInputSchema,
    enquiryStatusUpdateSchema,
    enquiryNoteCreateSchema,
    adminEnquiryQuerySchema,
} from './enquiries.schema.js';
import { requireAdmin } from '../../common/middlewares.js';

export const enquiriesRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const controller = new EnquiriesController();

    // Public Submit Enquiry
    fastify.post(
        '/public/enquiries',
        {
            schema: {
                description: 'Public visitor booking enquiry submission with rate limiting (max 5/hr/ip)',
                tags: ['Enquiries'],
                body: enquiryCreateInputSchema,
            },
        },
        controller.createEnquiry
    );

    // Admin Enquiries Management
    fastify.get(
        '/admin/enquiries',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin list enquiries with status and search filters',
                tags: ['Enquiries'],
                querystring: adminEnquiryQuerySchema,
            },
        },
        controller.getAdminEnquiries
    );

    fastify.get(
        '/admin/enquiries/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin get full enquiry details and timeline',
                tags: ['Enquiries'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.getEnquiryById
    );

    fastify.patch(
        '/admin/enquiries/:id/status',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin update enquiry workflow status',
                tags: ['Enquiries'],
                params: z.object({
                    id: z.string().min(1),
                }),
                body: enquiryStatusUpdateSchema,
            },
        },
        controller.updateStatus
    );

    fastify.post(
        '/admin/enquiries/:id/notes',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin append an internal note to an enquiry',
                tags: ['Enquiries'],
                params: z.object({
                    id: z.string().min(1),
                }),
                body: enquiryNoteCreateSchema,
            },
        },
        controller.addNote
    );

    fastify.delete(
        '/admin/enquiries/:id',
        {
            preHandler: [requireAdmin],
            schema: {
                description: 'Admin delete an enquiry',
                tags: ['Enquiries'],
                params: z.object({
                    id: z.string().min(1),
                }),
            },
        },
        controller.deleteEnquiry
    );
};
