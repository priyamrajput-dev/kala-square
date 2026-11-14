import { getDb, artists, artistMedia, artistWork, artistSocial } from '@kalasquare/db';
import { eq, and, or, ilike, sql, desc, asc, not } from 'drizzle-orm';

export class ArtistsRepository {
    async slugExists(slug: string, excludeId?: string): Promise<boolean> {
        const db = getDb();
        const conditions = [eq(artists.slug, slug)];
        if (excludeId) {
            conditions.push(not(eq(artists.id, excludeId)));
        }
        const existing = await db.select({ id: artists.id }).from(artists).where(and(...conditions)).limit(1);
        return existing.length > 0;
    }

    async findPublicArtists(params: {
        category?: string;
        artistClass?: string;
        city?: string;
        search?: string;
        page: number;
        limit: number;
    }) {
        const db = getDb();
        const { category, artistClass, city, search, page, limit } = params;
        const offset = (page - 1) * limit;

        const conditions = [
            or(eq(artists.status, 'published'), eq(artists.status, 'live'))!
        ];

        if (artistClass && artistClass !== 'all') {
            conditions.push(eq(artists.artistClass, artistClass.toLowerCase()));
        }
        if (city && city !== 'all') {
            conditions.push(ilike(artists.city, `%${city}%`));
        }
        if (search && search.trim()) {
            const q = `%${search.trim()}%`;
            conditions.push(or(ilike(artists.name, q), ilike(artists.tagline, q), ilike(artists.city, q))!);
        }

        const whereClause = and(...conditions);

        let query = db.select().from(artists).where(whereClause);
        const allMatching = await query;

        // In-memory category filter for JSONB array if provided
        let filtered = allMatching;
        if (category && category !== 'all') {
            const catLower = category.toLowerCase();
            filtered = allMatching.filter((a) => {
                const cats = Array.isArray(a.categories) ? a.categories : [];
                return cats.some((c) => String(c).toLowerCase().includes(catLower));
            });
        }

        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            data: paginated,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async findBySlug(slug: string) {
        const db = getDb();
        const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
        const artistRows = await db
            .select()
            .from(artists)
            .where(
                or(
                    eq(artists.slug, slug),
                    eq(artists.slug, decodedSlug),
                    ilike(artists.slug, decodedSlug),
                    eq(artists.id, slug)
                )
            )
            .limit(1);
        if (artistRows.length === 0) return null;

        const artist = artistRows[0];
        const [media, work, socialRows] = await Promise.all([
            db.select().from(artistMedia).where(eq(artistMedia.artistId, artist.id)).orderBy(asc(artistMedia.sortOrder)),
            db.select().from(artistWork).where(eq(artistWork.artistId, artist.id)).orderBy(asc(artistWork.sortOrder)),
            db.select().from(artistSocial).where(eq(artistSocial.artistId, artist.id)).limit(1),
        ]);

        return {
            ...artist,
            media,
            work,
            social: socialRows[0] || null,
        };
    }

    async findById(id: string) {
        const db = getDb();
        const artistRows = await db.select().from(artists).where(eq(artists.id, id)).limit(1);
        if (artistRows.length === 0) return null;

        const artist = artistRows[0];
        const [media, work, socialRows] = await Promise.all([
            db.select().from(artistMedia).where(eq(artistMedia.artistId, artist.id)).orderBy(asc(artistMedia.sortOrder)),
            db.select().from(artistWork).where(eq(artistWork.artistId, artist.id)).orderBy(asc(artistWork.sortOrder)),
            db.select().from(artistSocial).where(eq(artistSocial.artistId, artist.id)).limit(1),
        ]);

        return {
            ...artist,
            media,
            work,
            social: socialRows[0] || null,
        };
    }

    async findAllAdmin(params: {
        search?: string;
        category?: string;
        artistClass?: string;
        status?: string;
        sort?: string;
        page: number;
        limit: number;
    }) {
        const db = getDb();
        const { search, category, artistClass, status, sort, page, limit } = params;
        const offset = (page - 1) * limit;

        const conditions = [];

        if (artistClass && artistClass !== 'all') {
            conditions.push(eq(artists.artistClass, artistClass.toLowerCase()));
        }
        if (status && status !== 'all') {
            if (status === 'published') {
                conditions.push(or(eq(artists.status, 'published'), eq(artists.status, 'live'))!);
            } else {
                conditions.push(eq(artists.status, status.toLowerCase()));
            }
        }
        if (search && search.trim()) {
            const q = `%${search.trim()}%`;
            conditions.push(or(ilike(artists.name, q), ilike(artists.slug, q), ilike(artists.city, q))!);
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        let allMatching = await db.select().from(artists).where(whereClause);

        // Filter category if provided
        if (category && category !== 'all') {
            const catLower = category.toLowerCase();
            allMatching = allMatching.filter((a) => {
                const cats = Array.isArray(a.categories) ? a.categories : [];
                return cats.some((c) => String(c).toLowerCase().includes(catLower));
            });
        }

        // Sort
        if (sort === 'name-asc') {
            allMatching.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'price-low') {
            allMatching.sort((a, b) => (a.experienceYears || 0) - (b.experienceYears || 0));
        } else if (sort === 'price-high') {
            allMatching.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
        } else {
            // Newest first default
            allMatching.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        const total = allMatching.length;
        const paginated = allMatching.slice(offset, offset + limit);

        return {
            data: paginated,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async findSimilar(category: string, excludeId: string, limit = 4) {
        const db = getDb();
        const publishedArtists = await db.select().from(artists).where(
            and(
                or(eq(artists.status, 'published'), eq(artists.status, 'live')),
                not(eq(artists.id, excludeId))
            )
        );

        const catLower = category.toLowerCase();
        const matches = publishedArtists.filter((a) => {
            const cats = Array.isArray(a.categories) ? a.categories : [];
            return cats.some((c) => String(c).toLowerCase().includes(catLower));
        });

        return (matches.length >= limit ? matches : publishedArtists).slice(0, limit);
    }

    async createArtistWithRelations(data: {
        artist: any;
        media: any[];
        work: any[];
        social: any;
    }) {
        const db = getDb();
        const [createdArtist] = await db.insert(artists).values(data.artist).returning();

        if (data.media && data.media.length > 0) {
            const mediaValues = data.media.map((m, idx) => ({
                ...m,
                artistId: createdArtist.id,
                sortOrder: idx,
            }));
            await db.insert(artistMedia).values(mediaValues);
        }

        if (data.work && data.work.length > 0) {
            const workValues = data.work.map((w, idx) => ({
                ...w,
                artistId: createdArtist.id,
                sortOrder: idx,
            }));
            await db.insert(artistWork).values(workValues);
        }

        if (data.social) {
            await db.insert(artistSocial).values({
                ...data.social,
                artistId: createdArtist.id,
            });
        }

        return this.findById(createdArtist.id);
    }

    async updateArtistWithRelations(
        id: string,
        data: {
            artist: any;
            media: any[];
            work: any[];
            social: any;
        }
    ) {
        const db = getDb();
        await db.update(artists).set({ ...data.artist, updatedAt: new Date() }).where(eq(artists.id, id));

        // Recreate media
        await db.delete(artistMedia).where(eq(artistMedia.artistId, id));
        if (data.media && data.media.length > 0) {
            const mediaValues = data.media.map((m, idx) => ({
                ...m,
                artistId: id,
                sortOrder: idx,
            }));
            await db.insert(artistMedia).values(mediaValues);
        }

        // Recreate work
        await db.delete(artistWork).where(eq(artistWork.artistId, id));
        if (data.work && data.work.length > 0) {
            const workValues = data.work.map((w, idx) => ({
                ...w,
                artistId: id,
                sortOrder: idx,
            }));
            await db.insert(artistWork).values(workValues);
        }

        // Upsert social
        await db.delete(artistSocial).where(eq(artistSocial.artistId, id));
        if (data.social) {
            await db.insert(artistSocial).values({
                ...data.social,
                artistId: id,
            });
        }

        return this.findById(id);
    }

    async deleteArtist(id: string) {
        const db = getDb();
        await db.delete(artistMedia).where(eq(artistMedia.artistId, id));
        await db.delete(artistWork).where(eq(artistWork.artistId, id));
        await db.delete(artistSocial).where(eq(artistSocial.artistId, id));
        const deleted = await db.delete(artists).where(eq(artists.id, id)).returning();
        return deleted[0] || null;
    }

    async updateStatus(id: string, status: string, publishedAt: Date | null) {
        const db = getDb();
        const [updated] = await db.update(artists).set({ status, publishedAt, updatedAt: new Date() }).where(eq(artists.id, id)).returning();
        return updated || null;
    }
}
