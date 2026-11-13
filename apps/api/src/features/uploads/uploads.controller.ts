import type { FastifyRequest, FastifyReply } from 'fastify';
import { UploadsService } from './uploads.service.js';

export class UploadsController {
    constructor(private readonly service = new UploadsService()) {}

    upload = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const data = await request.file();
            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const buffer = await data.toBuffer();
            const result = await this.service.handleUpload({
                filename: data.filename,
                mimetype: data.mimetype,
                data: buffer,
            });

            return reply.status(201).send(result);
        } catch (err: any) {
            return reply.status(err.statusCode || 400).send({ error: err.message || 'Upload failed' });
        }
    };
}
