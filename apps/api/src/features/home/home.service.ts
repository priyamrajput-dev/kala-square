import { HomeRepository, defaultHomeConfig } from './home.repository.js';
import { HomeConfig } from './home.schema.js';
import { ValidationError } from '../../common/errors.js';

export class HomeService {
    constructor(private readonly repo = new HomeRepository()) {}

    async getPublicHome() {
        const record = await this.repo.getConfig();
        const config: HomeConfig = (record?.publishedConfig as HomeConfig) || (record?.draftConfig as HomeConfig) || defaultHomeConfig;

        // Fetch section records
        const [platinumRaw, newTalentRaw, risingRaw, venuesRaw, eventsRaw] = await Promise.all([
            this.repo.getPublishedArtists(config.platinum.artistIds, 'platinum', 4),
            this.repo.getPublishedArtists(config.newTalent.artistIds, undefined, 4),
            this.repo.getPublishedArtists(config.rising.artistIds, 'rising', 4),
            this.repo.getPublishedVenues(3),
            this.repo.getPublishedEvents(4),
        ]);

        const formatArtist = (a: any) => ({
            id: a.id,
            slug: a.slug,
            name: a.name,
            tagline: a.tagline || '',
            city: a.city,
            state: a.state || '',
            artistClass: a.artistClass,
            isVerified: a.isVerified,
            isExclusive: a.isExclusive,
            categories: Array.isArray(a.categories) ? a.categories : [],
            profilePhotoUrl: a.profilePhotoUrl,
            rating: 4.9,
            reviewCount: 20,
            priceLabel: a.experienceYears ? `₹${a.experienceYears}k Onwards` : 'Available on Request',
        });

        const formatVenue = (v: any) => ({
            id: v.id,
            slug: v.slug,
            name: v.name,
            city: v.city,
            capacity: v.capacity || 500,
            category: v.category || 'Auditorium',
            priceLabel: v.priceLabel || '₹50,000 / day',
            imageUrl: v.imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
        });

        const formatEvent = (e: any) => ({
            id: e.id,
            slug: e.slug,
            title: e.title,
            date: e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
            city: e.city,
            venue: e.venueName || 'Main Stage',
            category: e.category || 'Concert',
            badge: e.badge || 'Trending',
            imageUrl: e.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
        });

        return {
            config,
            hero: config.hero,
            platinumArtists: platinumRaw.map(formatArtist),
            newArtists: newTalentRaw.map(formatArtist),
            categories: config.categories.items,
            spotlights: config.spotlights,
            events: eventsRaw.map(formatEvent),
            risingArtists: risingRaw.map(formatArtist),
            venues: venuesRaw.map(formatVenue),
            faqs: config.faq.items,
            footer: config.footer,
        };
    }

    async getAdminHome() {
        const record = await this.repo.getConfig();
        const draft = (record?.draftConfig as HomeConfig) || defaultHomeConfig;
        const published = (record?.publishedConfig as HomeConfig) || defaultHomeConfig;

        return {
            draft,
            published,
            lastSaved: record?.updatedAt ? new Date(record.updatedAt).toISOString() : new Date().toISOString(),
            lastPublished: record?.publishedAt ? new Date(record.publishedAt).toISOString() : null,
        };
    }

    async saveDraft(config: HomeConfig) {
        config.lastSaved = new Date().toISOString();
        const updated = await this.repo.saveDraft(config);
        return {
            success: true,
            data: updated,
            lastSaved: config.lastSaved,
        };
    }

    async publish(config: HomeConfig) {
        // Validation: Ensure visible sections have necessary data
        const errors: string[] = [];

        if (config.hero.isVisible && !config.hero.heading) {
            errors.push('Hero heading is required');
        }

        if (errors.length > 0) {
            throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
        }

        config.lastPublished = new Date().toISOString();
        const updated = await this.repo.publish(config);

        return {
            success: true,
            data: updated,
            lastPublished: config.lastPublished,
        };
    }
}
