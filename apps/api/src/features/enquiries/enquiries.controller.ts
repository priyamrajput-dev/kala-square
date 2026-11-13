import type { FastifyRequest, FastifyReply } from 'fastify';
import { EnquiriesService } from './enquiries.service.js';
import { EnquiryCreateInput, AdminEnquiryQuery, EnquiryStatusUpdate, EnquiryNoteCreate } from './enquiries.schema.js';

export class EnquiriesController {
    constructor(private readonly service = new EnquiriesService()) {}

    createEnquiry = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const ip = request.ip || '127.0.0.1';
            const body = request.body as EnquiryCreateInput;
            const result = await this.service.createEnquiry(ip, body);
            return reply.status(201).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to submit enquiry' });
        }
    };

    getAdminEnquiries = async (request: FastifyRequest, reply: FastifyReply) => {
        const query = request.query as AdminEnquiryQuery;
        const result = await this.service.getAdminEnquiries(query);
        return reply.status(200).send(result);
    };

    getEnquiryById = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.getEnquiryById(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 404).send({ error: err.message || 'Enquiry not found' });
        }
    };

    updateStatus = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const { status } = request.body as EnquiryStatusUpdate;
            const result = await this.service.updateStatus(id, status);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to update status' });
        }
    };

    addNote = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const { note } = request.body as EnquiryNoteCreate;
            const result = await this.service.addNote(id, note);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to add note' });
        }
    };

    deleteEnquiry = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const result = await this.service.deleteEnquiry(id);
            return reply.status(200).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Failed to delete enquiry' });
        }
    };
}
