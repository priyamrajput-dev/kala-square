import { getDb, venues } from '@kalasquare/db';
import { eq } from 'drizzle-orm';
import { VenueUpsertInput } from './venues.schema.js';

export class VenuesRepository {
    async findPublic(limit = 3) {
        const db = getDb();
        return db.select().from(venues).where(eq(venues.status, 'live')).limit(limit);
    }

    async findAll() {
        const db = getDb();
        return db.select().from(venues);
    }

    async findById(id: string) {
        const db = getDb();
        const rows = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
        return rows[0] || null;
    }

    async create(data: VenueUpsertInput, slug: string) {
        const db = getDb();
        const [created] = await db
            .insert(venues)
            .values({
                name: data.name,
                code: data.code || `VEN-${Math.floor(100 + Math.random() * 900)}`,
                slug,
                city: data.city,
                state: data.state || null,
                category: data.category || 'Auditorium',
                capacity: data.capacity || 500,
                priceFrom: data.priceFrom || 50000,
                priceLabel: data.priceLabel || `₹${data.priceFrom || 50000} / day`,
                imageUrl: data.imageUrl || null,
                description: data.description || null,
                status: data.status || 'live',
            })
            .returning();
        return created;
    }

    async update(id: string, data: VenueUpsertInput) {
        const db = getDb();
        const [updated] = await db
            .update(venues)
            .set({
                name: data.name,
                code: data.code,
                city: data.city,
                state: data.state || null,
                category: data.category,
                capacity: data.capacity,
                priceFrom: data.priceFrom,
                priceLabel: data.priceLabel,
                imageUrl: data.imageUrl,
                description: data.description,
                status: data.status,
                updatedAt: new Date(),
            })
            .where(eq(venues.id, id))
            .returning();
        return updated || null;
    }

    async delete(id: string) {
        const db = getDb();
        const [deleted] = await db.delete(venues).where(eq(venues.id, id)).returning();
        return deleted || null;
    }
}
