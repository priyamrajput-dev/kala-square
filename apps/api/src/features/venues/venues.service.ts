import { VenuesRepository } from './venues.repository.js';
import { NotFoundError } from '../../common/errors.js';
import { VenueUpsertInput } from './venues.schema.js';

export class VenuesService {
    constructor(private readonly repo = new VenuesRepository()) {}

    private slugify(name: string): string {
        return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    async getPublicVenues(limit = 3) {
        return this.repo.findPublic(limit);
    }

    async getAllVenues() {
        return this.repo.findAll();
    }

    async getVenueById(id: string) {
        const venue = await this.repo.findById(id);
        if (!venue) {
            throw new NotFoundError('Venue not found');
        }
        return venue;
    }

    async createVenue(input: VenueUpsertInput) {
        let baseSlug = this.slugify(input.name);
        const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
        return this.repo.create(input, slug);
    }

    async updateVenue(id: string, input: VenueUpsertInput) {
        const updated = await this.repo.update(id, input);
        if (!updated) {
            throw new NotFoundError('Venue not found');
        }
        return updated;
    }

    async deleteVenue(id: string) {
        const deleted = await this.repo.delete(id);
        if (!deleted) {
            throw new NotFoundError('Venue not found');
        }
        return { success: true, id };
    }
}
