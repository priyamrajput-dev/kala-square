import { getDb, enquiries, artists } from '@kalasquare/db';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { EnquiryNote } from '@kalasquare/db';

export class EnquiriesRepository {
    async create(data: {
        artistId?: string | null;
        name: string;
        phone: string;
        email?: string | null;
        city?: string | null;
        eventDate?: string | null;
        eventType?: string | null;
        budgetRange?: string | null;
        message: string;
    }) {
        const db = getDb();
        const [created] = await db
            .insert(enquiries)
            .values({
                artistId: data.artistId || null,
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                city: data.city || null,
                eventDate: data.eventDate || null,
                eventType: data.eventType || null,
                budgetRange: data.budgetRange || null,
                message: data.message,
                status: 'new',
                notes: [],
            })
            .returning();
        return created;
    }

    async findAdminEnquiries(params: {
        status?: string;
        search?: string;
        page: number;
        limit: number;
    }) {
        const db = getDb();
        const { status, search, page, limit } = params;
        const offset = (page - 1) * limit;

        const conditions = [];
        if (status && status !== 'all') {
            conditions.push(eq(enquiries.status, status.toLowerCase()));
        }
        if (search && search.trim()) {
            const q = `%${search.trim()}%`;
            conditions.push(or(ilike(enquiries.name, q), ilike(enquiries.phone, q), ilike(enquiries.city, q))!);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Query enquiries with left join on artists
        const rows = await db
            .select({
                enquiry: enquiries,
                artist: {
                    id: artists.id,
                    name: artists.name,
                    slug: artists.slug,
                    profilePhotoUrl: artists.profilePhotoUrl,
                },
            })
            .from(enquiries)
            .leftJoin(artists, eq(enquiries.artistId, artists.id))
            .where(whereClause)
            .orderBy(desc(enquiries.createdAt));

        const total = rows.length;
        const paginated = rows.slice(offset, offset + limit);

        const data = paginated.map((r) => ({
            id: r.enquiry.id,
            name: r.enquiry.name,
            phone: r.enquiry.phone,
            email: r.enquiry.email,
            city: r.enquiry.city,
            eventDate: r.enquiry.eventDate,
            eventType: r.enquiry.eventType,
            budget: r.enquiry.budgetRange,
            message: r.enquiry.message,
            status: r.enquiry.status as 'new' | 'contacted' | 'booked' | 'closed',
            notes: r.enquiry.notes || [],
            createdAt: r.enquiry.createdAt ? new Date(r.enquiry.createdAt).toISOString() : new Date().toISOString(),
            artist: r.artist?.id ? r.artist : null,
        }));

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async findById(id: string) {
        const db = getDb();
        const rows = await db
            .select({
                enquiry: enquiries,
                artist: {
                    id: artists.id,
                    name: artists.name,
                    slug: artists.slug,
                    profilePhotoUrl: artists.profilePhotoUrl,
                },
            })
            .from(enquiries)
            .leftJoin(artists, eq(enquiries.artistId, artists.id))
            .where(eq(enquiries.id, id))
            .limit(1);

        if (rows.length === 0) return null;
        const r = rows[0];

        return {
            id: r.enquiry.id,
            name: r.enquiry.name,
            phone: r.enquiry.phone,
            email: r.enquiry.email,
            city: r.enquiry.city,
            eventDate: r.enquiry.eventDate,
            eventType: r.enquiry.eventType,
            budget: r.enquiry.budgetRange,
            message: r.enquiry.message,
            status: r.enquiry.status as 'new' | 'contacted' | 'booked' | 'closed',
            notes: r.enquiry.notes || [],
            createdAt: r.enquiry.createdAt ? new Date(r.enquiry.createdAt).toISOString() : new Date().toISOString(),
            artist: r.artist?.id ? r.artist : null,
        };
    }

    async updateStatus(id: string, status: string) {
        const db = getDb();
        const [updated] = await db
            .update(enquiries)
            .set({ status, updatedAt: new Date() })
            .where(eq(enquiries.id, id))
            .returning();
        return updated || null;
    }

    async appendNote(id: string, note: EnquiryNote) {
        const db = getDb();
        const existing = await this.findById(id);
        if (!existing) return null;

        const currentNotes = existing.notes || [];
        const newNotes = [...currentNotes, note];

        const [updated] = await db
            .update(enquiries)
            .set({ notes: newNotes, updatedAt: new Date() })
            .where(eq(enquiries.id, id))
            .returning();
        return updated || null;
    }

    async delete(id: string) {
        const db = getDb();
        const [deleted] = await db.delete(enquiries).where(eq(enquiries.id, id)).returning();
        return deleted || null;
    }
}
