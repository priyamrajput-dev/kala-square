import { EnquiriesRepository } from './enquiries.repository.js';
import { NotFoundError, ValidationError, RateLimitError } from '../../common/errors.js';
import { EnquiryCreateInput, AdminEnquiryQuery } from './enquiries.schema.js';

// In-memory rate limiter: Map<ip, timestamp[]>
const ipRateLimitMap = new Map<string, number[]>();

export class EnquiriesService {
    constructor(private readonly repo = new EnquiriesRepository()) {}

    private checkRateLimit(ip: string) {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;
        const timestamps = (ipRateLimitMap.get(ip) || []).filter((t) => t > oneHourAgo);

        if (timestamps.length >= 5) {
            throw new RateLimitError('Rate limit reached: Maximum 5 booking enquiries permitted per hour.');
        }

        timestamps.push(now);
        ipRateLimitMap.set(ip, timestamps);
    }

    async createEnquiry(ip: string, input: EnquiryCreateInput) {
        this.checkRateLimit(ip);

        const created = await this.repo.create({
            artistId: input.artistId,
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail,
            eventDate: input.eventDate,
            eventType: input.eventType,
            budgetRange: input.budget,
            message: input.message,
        });

        return {
            success: true,
            data: created,
            message: 'Enquiry submitted successfully! A talent concierge will contact you within 2 hours.',
        };
    }

    async getAdminEnquiries(query: AdminEnquiryQuery) {
        return this.repo.findAdminEnquiries(query);
    }

    async getEnquiryById(id: string) {
        const enquiry = await this.repo.findById(id);
        if (!enquiry) {
            throw new NotFoundError('Enquiry not found');
        }

        // Build activity timeline
        const timeline = [
            {
                id: 'tl-1',
                title: 'Enquiry Received',
                time: enquiry.createdAt,
                description: `Client requested booking details via website.`,
            },
        ];

        if (enquiry.status === 'contacted' || enquiry.status === 'booked' || enquiry.status === 'closed') {
            timeline.push({
                id: 'tl-2',
                title: 'Client Contacted',
                time: enquiry.createdAt,
                description: 'Coordinator initiated call and WhatsApp communication.',
            });
        }

        if (enquiry.status === 'booked') {
            timeline.push({
                id: 'tl-3',
                title: 'Booking Confirmed',
                time: new Date().toISOString(),
                description: 'Artist agreement and advance payment recorded.',
            });
        }

        return {
            ...enquiry,
            timeline,
        };
    }

    async updateStatus(id: string, status: string) {
        const updated = await this.repo.updateStatus(id, status);
        if (!updated) {
            throw new NotFoundError('Enquiry not found');
        }
        return { success: true, data: updated };
    }

    async addNote(id: string, text: string) {
        const note = {
            id: `note-${Date.now()}`,
            text,
            createdAt: new Date().toISOString(),
        };
        const updated = await this.repo.appendNote(id, note);
        if (!updated) {
            throw new NotFoundError('Enquiry not found');
        }
        return { success: true, note, data: updated };
    }

    async deleteEnquiry(id: string) {
        const deleted = await this.repo.delete(id);
        if (!deleted) {
            throw new NotFoundError('Enquiry not found');
        }
        return { success: true, id };
    }
}
