import { getDb, homeConfigs, artists, venues, events } from '@kalasquare/db';
import { eq } from 'drizzle-orm';
import { HomeConfig } from './home.schema.js';

export const defaultHomeConfig: HomeConfig = {
    lastSaved: new Date().toISOString(),
    lastPublished: new Date().toISOString(),
    sectionOrder: [
        'hero',
        'platinum',
        'newTalent',
        'categories',
        'spotlights',
        'events',
        'rising',
        'venues',
        'faq',
        'footer',
        'enquiryCta',
    ],
    hero: {
        isVisible: true,
        eyebrow: 'KalaSquare Talent Network',
        heading: 'Discover & Book Verified Performing Artists',
        subtext: 'India’s premier platform connecting curated musicians, actors, dancers, and creators with events, brands, and premium venues.',
        primaryButtonText: 'Explore Artists',
        secondaryButtonText: 'Book a Creator',
        artistsCount: '10,000+',
        eventsCount: '500+',
        rating: '4.9/5',
        showStats: true,
    },
    platinum: {
        isVisible: true,
        title: 'Platinum Artists',
        subtitle: 'Top-tier verified celebrities and headline performers for major corporate and public events.',
        viewAllText: 'View All Platinum',
        artistIds: [],
    },
    newTalent: {
        isVisible: true,
        title: 'New on KalaSquare',
        subtitle: 'Fresh talent, breakthrough singers, dynamic dancers, and rising creators recently added to our roster.',
        viewAllText: 'Explore New',
        artistIds: [],
    },
    categories: {
        isVisible: true,
        title: 'Find Talent By Category',
        subtitle: 'Browse India’s best creators across specialized performance domains.',
        items: [
            { slug: 'singer', name: 'Singer', count: 1420, isVisible: true },
            { slug: 'actor', name: 'Actor', count: 980, isVisible: true },
            { slug: 'dancer', name: 'Dancer', count: 750, isVisible: true },
            { slug: 'musician', name: 'Musician', count: 1100, isVisible: true },
            { slug: 'comedian', name: 'Comedian', count: 420, isVisible: true },
            { slug: 'emcee', name: 'Emcee & Host', count: 610, isVisible: true },
            { slug: 'speaker', name: 'Speaker', count: 350, isVisible: true },
            { slug: 'magician', name: 'Magician', count: 180, isVisible: true },
            { slug: 'dj', name: 'DJ & Producer', count: 890, isVisible: true },
            { slug: 'band', name: 'Live Band', count: 540, isVisible: true },
            { slug: 'voiceover', name: 'Voiceover Artist', count: 320, isVisible: true },
            { slug: 'instrumentalist', name: 'Instrumentalist', count: 470, isVisible: true },
        ],
    },
    spotlights: {
        isVisible: true,
        title: 'Stage & Spotlights',
        subtitle: 'Industry stories, live performance highlights, and creator journeys from across the country.',
        featuredArticle: {
            title: 'Sahil Badal’s Electrifying Mumbai Arena Tour Sells Out in Minutes',
            description: 'A behind-the-scenes look at how Sufi-Bollywood fusion is capturing youth audiences and transforming live concert experiences.',
            imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
            link: '/top-creators/sahil-badal',
        },
        smallArticles: [
            {
                title: 'Top 10 High-Energy College Fest Performers for 2026 Season',
                tag: 'Trending',
                imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
                link: '/events',
            },
            {
                title: 'Vijay Vikram Singh: The Distinct Voice Ruling Indian Television & Web',
                tag: 'Exclusive',
                imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=400',
                link: '/top-creators/test-artist',
            },
        ],
    },
    events: {
        isVisible: true,
        title: 'Featured Events & Live Shows',
        subtitle: 'Experience breathtaking performances and concerts booked directly through KalaSquare.',
        items: [
            { id: 'ev-1', badge: 'Trending' },
            { id: 'ev-2', badge: 'Filling Fast' },
            { id: 'ev-3', badge: 'KS Original' },
            { id: 'ev-4', badge: 'New' },
        ],
    },
    rising: {
        isVisible: true,
        title: 'Rising Stars & Emerging Artists',
        subtitle: 'Discover upcoming powerhouses ready to make your college festivals and intimate weddings unforgettable.',
        viewAllText: 'Discover Rising Talent',
        artistIds: [],
    },
    venues: {
        isVisible: true,
        title: 'Partner Venues & Arenas',
        subtitle: 'Curated premium auditoriums, amphitheaters, and club spaces equipped for world-class sound and stage setups.',
        venueIds: [],
    },
    faq: {
        isVisible: true,
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about booking creators and listing talent on KalaSquare.',
        buttonText: 'Ask a Question',
        items: [
            {
                question: 'How do I book an artist on KalaSquare?',
                answer: 'Simply navigate to the artist profile, click "Send Enquiry" or "Talk to creator", specify your event date, city, and expected audience. Our dedicated talent manager coordinates contracts and technical riders directly.',
            },
            {
                question: 'Are all listed creators verified?',
                answer: 'Yes! Every artist on KalaSquare goes through phone verification, portfolio validation, and identity screening before receiving verified status or live booking eligibility.',
            },
            {
                question: 'What is the difference between Platinum and Standard artists?',
                answer: 'Platinum artists are nationally recognized headline acts with extensive broadcast/tour experience and verified audience fanbases. Standard and Rising artists are emerging talents delivering high energy at accessible budget tiers.',
            },
            {
                question: 'Can I cancel or reschedule an artist booking?',
                answer: 'Cancellations and rescheduling depend on individual artist rider terms. Our talent concierges provide full transparent cancellation policies during the initial quote confirmation.',
            },
        ],
    },
    footer: {
        isVisible: true,
        infoLinks: ['About Us', 'Press & Media', 'Careers', 'Contact Team', 'Privacy Policy', 'Terms of Service'],
        usefulLinks: ['Hire Singers', 'Book Actors', 'Wedding Dancers', 'College Fest Emcees', 'Live Bands Mumbai', 'Corporate Speakers'],
        instagramUrl: 'https://instagram.com/kalasquare',
        youtubeUrl: 'https://youtube.com/@kalasquare',
        facebookUrl: 'https://facebook.com/kalasquare',
        xUrl: 'https://x.com/kalasquare',
        copyrightText: '© 2026 KalaSquare Talent Network Pvt. Ltd. All rights reserved.',
    },
    enquiryCta: {
        isVisible: true,
        title: 'Looking for the perfect artist for your next event?',
        subtext: 'Share your event requirements and get curated artist quotes within 2 hours.',
        buttonText: 'Send Booking Enquiry',
        mobileOnly: true,
    },
};

export class HomeRepository {
    async getConfig() {
        try {
            const db = getDb();
            const rows = await db.select().from(homeConfigs).limit(1);
            if (rows.length > 0) {
                return rows[0];
            }
        } catch {
            // Fallback
        }
        return null;
    }

    async saveDraft(config: HomeConfig) {
        const db = getDb();
        const existing = await this.getConfig();
        const now = new Date();

        if (existing) {
            const [updated] = await db
                .update(homeConfigs)
                .set({
                    draftConfig: config,
                    updatedAt: now,
                })
                .where(eq(homeConfigs.id, existing.id))
                .returning();
            return updated;
        } else {
            const [created] = await db
                .insert(homeConfigs)
                .values({
                    draftConfig: config,
                    publishedConfig: config,
                    publishedAt: now,
                })
                .returning();
            return created;
        }
    }

    async publish(config: HomeConfig) {
        const db = getDb();
        const existing = await this.getConfig();
        const now = new Date();

        if (existing) {
            const [updated] = await db
                .update(homeConfigs)
                .set({
                    draftConfig: config,
                    publishedConfig: config,
                    publishedAt: now,
                    updatedAt: now,
                })
                .where(eq(homeConfigs.id, existing.id))
                .returning();
            return updated;
        } else {
            const [created] = await db
                .insert(homeConfigs)
                .values({
                    draftConfig: config,
                    publishedConfig: config,
                    publishedAt: now,
                })
                .returning();
            return created;
        }
    }

    async getPublishedArtists(ids?: string[], artistClass?: string, limit = 4) {
        const db = getDb();
        try {
            let all = await db.select().from(artists);
            let published = all.filter((a) => a.status === 'published' || a.status === 'live');

            if (ids && ids.length > 0) {
                const matched = published.filter((a) => ids.includes(a.id) || ids.includes(a.slug));
                if (matched.length > 0) return matched;
            }

            if (artistClass) {
                const classMatched = published.filter(
                    (a) => a.artistClass.toLowerCase() === artistClass.toLowerCase()
                );
                if (classMatched.length > 0) return classMatched.slice(0, limit);
            }

            return published.slice(0, limit);
        } catch {
            return [];
        }
    }

    async getPublishedVenues(limit = 3) {
        const db = getDb();
        try {
            return await db.select().from(venues).limit(limit);
        } catch {
            return [];
        }
    }

    async getPublishedEvents(limit = 4) {
        const db = getDb();
        try {
            return await db.select().from(events).limit(limit);
        } catch {
            return [];
        }
    }
}
