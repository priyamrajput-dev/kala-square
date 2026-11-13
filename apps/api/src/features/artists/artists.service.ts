import { ArtistsRepository } from './artists.repository.js';
import { NotFoundError, ConflictError } from '../../common/errors.js';
import { ArtistFormData, PublicArtistQuery, AdminArtistQuery } from './artists.schema.js';

export class ArtistsService {
    constructor(private readonly repo = new ArtistsRepository()) {}

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }

    calculateCompleteness(data: Partial<ArtistFormData>): { completeness: number; missing: string[]; tip: string } {
        let score = 0;
        const missing: string[] = [];

        // 1. Basic (20%)
        const hasBasic = Boolean(
            data.name &&
            data.name.trim().length >= 2 &&
            data.city &&
            data.artistClass &&
            (data.photoUrl || (data as any).profilePhotoUrl)
        );
        if (hasBasic) score += 20;
        else missing.push('Basic Information & Photo');

        // 2. About (15%)
        const bioLen = (data.bio || '').trim().length;
        if (bioLen >= 100) score += 15;
        else if (bioLen > 0) score += 7;
        else missing.push('Biography');

        // 3. Categories (10%)
        if ((data.categories || []).length >= 1) score += 10;
        else missing.push('Categories');

        // 4. Social (10%)
        const hasSocial = Boolean(
            data.instagram || data.youtube || data.facebook || data.spotify || data.x || data.website || data.imdbUrl
        );
        if (hasSocial) score += 10;
        else missing.push('Social Links');

        // 5. Fanbase (10%)
        const totalFanbase =
            Number(data.fanbaseSpotify || 0) +
            Number(data.fanbaseYouTube || 0) +
            Number(data.fanbaseInstagram || 0) +
            Number(data.fanbaseFacebook || 0) +
            Number(data.fanbaseDeezer || 0) +
            Number(data.fanbaseSoundCloud || 0) +
            Number(data.fanbaseTikTok || 0);
        if (totalFanbase > 0) score += 10;
        else missing.push('Fanbase Reach');

        // 6. Gallery (15%)
        const galCount = (data.gallery || []).length;
        if (galCount >= 3) score += 15;
        else if (galCount >= 1) score += 8;
        else missing.push('Photo Gallery');

        // 7. Videos (5%)
        if (data.videos && data.videos.length > 0 && data.videos.some((v) => v.url)) score += 5;
        else missing.push('Videos');

        // 8. Campaigns / Awards (5%)
        if ((data.campaigns && data.campaigns.length > 0) || (data.awards && data.awards.length > 0)) score += 5;
        else missing.push('Campaigns or Awards');

        // 9. SEO (10%)
        if (data.metaTitle && data.metaDescription) score += 10;
        else missing.push('SEO Metadata');

        const tip = missing.length > 0
            ? `Complete ${missing[0]} to raise profile completeness.`
            : 'Profile is 100% complete!';

        return { completeness: Math.min(100, score), missing, tip };
    }

    async getPublicArtists(query: PublicArtistQuery) {
        const result = await this.repo.findPublicArtists(query);
        const data = result.data.map((a) => ({
            id: a.id,
            slug: a.slug,
            name: a.name,
            tagline: a.tagline,
            city: a.city,
            state: a.state,
            artistClass: a.artistClass,
            isVerified: a.isVerified,
            isExclusive: a.isExclusive,
            categories: Array.isArray(a.categories) ? a.categories : [],
            profilePhotoUrl: a.profilePhotoUrl,
            budgetRange: a.budgetRange,
            priceLabel: a.experienceYears ? `₹${a.experienceYears}k Onwards` : 'Available on Request',
            rating: 4.9,
            reviewCount: 24,
        }));

        return {
            data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        };
    }

    async getPublicArtistBySlug(slug: string) {
        const artist = await this.repo.findBySlug(slug);
        if (!artist) {
            throw new NotFoundError('Artist not found');
        }

        // Draft / Pending artist public URL must return 404
        if (artist.status !== 'published' && artist.status !== 'live') {
            throw new NotFoundError('Artist not found');
        }

        const isPlatinum = artist.artistClass?.toLowerCase() === 'platinum';

        // Extract media
        const gallery = artist.media
            .filter((m) => m.type === 'gallery')
            .map((m) => ({ id: m.id, url: m.url, alt: m.title || artist.name }));

        const videos = artist.media
            .filter((m) => m.type === 'video')
            .map((m) => ({ id: m.id, title: m.title || 'Performance', url: m.url }));

        const clips = artist.media
            .filter((m) => m.type === 'clip')
            .map((m) => ({ id: m.id, title: m.title || 'Clip', url: m.url, platform: 'Instagram Reels' as const }));

        // Extract work
        const campaigns = artist.work
            .filter((w) => w.kind === 'campaign')
            .map((w) => ({
                id: w.id,
                brandName: w.title,
                category: w.category || '',
                year: w.year || '2024',
                description: w.description || '',
                imageUrl: w.imageUrl || undefined,
            }));

        const awards = artist.work
            .filter((w) => w.kind === 'award')
            .map((w) => ({
                id: w.id,
                title: w.title,
                category: w.category || '',
                year: w.year || '2024',
                description: w.description || '',
            }));

        // FAQs: ONLY if Platinum, else empty array
        const faqs = isPlatinum
            ? artist.work
                  .filter((w) => w.kind === 'faq')
                  .map((w) => ({ question: w.title, answer: w.description || '' }))
            : [];

        // Social & Fanbase
        const social = artist.social;
        const totalFollowers =
            (Number(social?.spotifyFollowersLabel?.replace(/[^\d]/g, '') || 0) * 1000) +
            (Number(social?.youtubeSubscribersLabel?.replace(/[^\d]/g, '') || 0) * 1000) +
            (Number(social?.instagramFollowersLabel?.replace(/[^\d]/g, '') || 0) * 1000);

        const primaryCat = Array.isArray(artist.categories) && artist.categories[0] ? artist.categories[0] : 'Artist';
        const similarRaw = await this.repo.findSimilar(primaryCat, artist.id, 4);
        const similarArtists = similarRaw.map((s) => ({
            id: s.id,
            slug: s.slug,
            name: s.name,
            tagline: s.tagline || '',
            city: s.city,
            state: s.state || '',
            artistClass: s.artistClass,
            isVerified: s.isVerified,
            isExclusive: s.isExclusive,
            categories: Array.isArray(s.categories) ? s.categories : [],
            profilePhotoUrl: s.profilePhotoUrl,
            rating: 4.9,
            reviewCount: 16,
            priceLabel: 'On Request',
        }));

        return {
            id: artist.id,
            slug: artist.slug,
            name: artist.name,
            tagline: artist.tagline || '',
            city: artist.city,
            state: artist.state || '',
            artistClass: artist.artistClass,
            isVerified: artist.isVerified,
            isExclusive: artist.isExclusive,
            categories: Array.isArray(artist.categories) ? artist.categories : [],
            specializations: Array.isArray(artist.specializations) ? artist.specializations : [],
            bio: artist.bio || '',
            profilePhotoUrl: artist.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
            rating: 4.9,
            reviewCount: 32,
            stats: {
                experience: artist.experienceYears ? `${artist.experienceYears} Years` : '5+ Years',
                projects: artist.projectsCount ? `${artist.projectsCount}+` : '50+',
                liveShows: artist.liveShowsCount ? `${artist.liveShowsCount}+` : '100+',
                followers: artist.totalFollowersLabel || (totalFollowers > 0 ? `${Math.round(totalFollowers / 1000)}K+` : '100K+'),
            },
            physicalStats: {
                height: artist.height || "5'9\"",
                weight: artist.weightKg ? `${artist.weightKg} kg` : '68 kg',
                chest: artist.chestIn ? `${artist.chestIn}"` : '38"',
                waist: artist.waistIn ? `${artist.waistIn}"` : '32"',
                hairType: artist.hairType || 'Wavy',
                hairLength: artist.hairLength || 'Medium',
                languages: Array.isArray(artist.languages) && artist.languages.length > 0 ? artist.languages : ['Hindi', 'English'],
            },
            fanbase: [
                { platform: 'Spotify' as const, count: social?.spotifyFollowersLabel || '250K', percentage: 35, color: '#1DB954' },
                { platform: 'YouTube' as const, count: social?.youtubeSubscribersLabel || '500K', percentage: 40, color: '#FF0000' },
                { platform: 'Instagram' as const, count: social?.instagramFollowersLabel || '1.2M', percentage: 25, color: '#E4405F' },
            ],
            socialLinks: {
                instagram: social?.instagramUrl || undefined,
                youtube: social?.youtubeUrl || undefined,
                facebook: social?.facebookUrl || undefined,
                spotify: social?.spotifyUrl || undefined,
                x: social?.xUrl || undefined,
            },
            gallery,
            videos,
            clips,
            campaigns,
            awards,
            faqs,
            reviews: [
                {
                    id: 'rev-1',
                    author: 'Priya Sharma',
                    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
                    rating: 5,
                    date: 'March 2026',
                    eventType: 'Corporate Annual Gala',
                    comment: 'Absolutely phenomenal performance! Mesmerized the entire audience.',
                },
            ],
            similarArtists,
            budgetRange: artist.budgetRange,
            availability: 'Available',
            priceLabel: '₹50,000 Onwards',
        };
    }

    async getAdminArtists(query: AdminArtistQuery) {
        const result = await this.repo.findAllAdmin(query);
        const data = result.data.map((a) => {
            const completeness = a.completenessPercent || 0;
            return {
                id: a.id,
                slug: a.slug,
                name: a.name,
                tagline: a.tagline,
                city: a.city,
                state: a.state,
                artistClass: a.artistClass,
                isVerified: a.isVerified,
                isExclusive: a.isExclusive,
                categories: Array.isArray(a.categories) ? a.categories : [],
                profilePhotoUrl: a.profilePhotoUrl,
                status: a.status === 'live' ? 'published' : a.status,
                completeness,
                updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : new Date().toISOString(),
                priceLabel: a.experienceYears ? `₹${a.experienceYears}k` : 'On Request',
            };
        });

        return {
            data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        };
    }

    async getArtistForEdit(id: string) {
        const artist = await this.repo.findById(id);
        if (!artist) {
            throw new NotFoundError('Artist not found');
        }

        const gallery = artist.media
            .filter((m) => m.type === 'gallery')
            .map((m) => ({ id: m.id, src: m.url, caption: m.title || '' }));

        const videos = artist.media
            .filter((m) => m.type === 'video')
            .map((m) => ({ id: m.id, title: m.title || '', url: m.url }));

        const clips = artist.media
            .filter((m) => m.type === 'clip')
            .map((m) => ({ id: m.id, title: m.title || '', url: m.url, platform: 'Instagram Reels' as const }));

        const campaigns = artist.work
            .filter((w) => w.kind === 'campaign')
            .map((w) => ({
                id: w.id,
                brandName: w.title,
                category: w.category || '',
                year: w.year || '2024',
                description: w.description || '',
                imageUrl: w.imageUrl || '',
            }));

        const awards = artist.work
            .filter((w) => w.kind === 'award')
            .map((w) => ({
                id: w.id,
                title: w.title,
                category: w.category || '',
                year: w.year || '2024',
                description: w.description || '',
            }));

        const faqs = artist.work
            .filter((w) => w.kind === 'faq')
            .map((w) => ({ question: w.title, answer: w.description || '' }));

        const social = artist.social;

        return {
            id: artist.id,
            name: artist.name,
            slug: artist.slug,
            tagline: artist.tagline || '',
            photoUrl: artist.profilePhotoUrl || '',
            coverPhotoUrl: '',
            city: artist.city,
            state: artist.state || '',
            artistClass: artist.artistClass,
            isVerified: artist.isVerified,
            isFeatured: artist.isExclusive,
            bio: artist.bio || '',
            languages: Array.isArray(artist.languages) ? artist.languages : [],
            specializations: Array.isArray(artist.specializations) ? artist.specializations.join(', ') : '',
            height: artist.height || '',
            weight: artist.weightKg ? String(artist.weightKg) : '',
            waist: artist.waistIn ? String(artist.waistIn) : '',
            chest: artist.chestIn ? String(artist.chestIn) : '',
            hairType: artist.hairType || '',
            hairLength: artist.hairLength || '',
            experienceYears: artist.experienceYears ? String(artist.experienceYears) : '',
            projectsCount: artist.projectsCount ? String(artist.projectsCount) : '',
            liveShowsCount: artist.liveShowsCount ? String(artist.liveShowsCount) : '',
            categories: Array.isArray(artist.categories) ? artist.categories : [],
            priceFrom: 0,
            priceTo: 0,
            availability: 'Available',
            bookingNote: '',
            instagram: social?.instagramUrl || '',
            youtube: social?.youtubeUrl || '',
            facebook: social?.facebookUrl || '',
            x: social?.xUrl || '',
            spotify: social?.spotifyUrl || '',
            website: '',
            imdbUrl: '',
            fanbaseSpotify: social?.spotifyFollowersLabel ? Number(social.spotifyFollowersLabel.replace(/[^\d]/g, '')) : 0,
            fanbaseYouTube: social?.youtubeSubscribersLabel ? Number(social.youtubeSubscribersLabel.replace(/[^\d]/g, '')) : 0,
            fanbaseInstagram: social?.instagramFollowersLabel ? Number(social.instagramFollowersLabel.replace(/[^\d]/g, '')) : 0,
            fanbaseFacebook: social?.facebookFollowersLabel ? Number(social.facebookFollowersLabel.replace(/[^\d]/g, '')) : 0,
            gallery,
            videos,
            clips,
            campaigns,
            awards,
            faqs,
            metaTitle: social?.seoMetaTitle || '',
            metaDescription: social?.seoMetaDescription || '',
            keywords: social?.seoFocusKeyword || '',
            ogImageUrl: social?.seoShareImageUrl || '',
            status: artist.status === 'live' ? 'published' : artist.status,
            completenessPercent: artist.completenessPercent,
        };
    }

    async createArtist(body: any) {
        // Generate slug if not provided
        const slug = body.slug ? this.slugify(body.slug) : this.slugify(body.name);
        const exists = await this.repo.slugExists(slug);
        if (exists) {
            throw new ConflictError('Slug already exists');
        }

        const { completeness } = this.calculateCompleteness(body);
        const status = body.status === 'published' ? 'published' : 'draft';
        const publishedAt = status === 'published' ? new Date() : null;

        const artistData = {
            slug,
            name: body.name,
            tagline: body.tagline || null,
            city: body.city || 'Mumbai',
            state: body.state || null,
            bio: body.bio || null,
            categories: body.categories || [],
            specializations: body.specializations ? [body.specializations] : [],
            experienceYears: body.experienceYears ? parseInt(body.experienceYears, 10) : null,
            projectsCount: body.projectsCount ? parseInt(body.projectsCount, 10) : null,
            liveShowsCount: body.liveShowsCount ? parseInt(body.liveShowsCount, 10) : null,
            totalFollowersLabel: body.totalFollowersLabel || null,
            height: body.height || null,
            weightKg: body.weight ? parseInt(body.weight, 10) : null,
            waistIn: body.waist ? parseInt(body.waist, 10) : null,
            chestIn: body.chest ? parseInt(body.chest, 10) : null,
            hairType: body.hairType || null,
            hairLength: body.hairLength || null,
            languages: body.languages || [],
            artistClass: body.artistClass || 'standard',
            budgetRange: body.budgetRange || 'not_set',
            isVerified: Boolean(body.isVerified),
            isExclusive: Boolean(body.isFeatured),
            status,
            profilePhotoUrl: body.photoUrl || body.profilePhotoUrl || null,
            completenessPercent: completeness,
            publishedAt,
        };

        const media = [
            ...(body.gallery || []).map((g: any) => ({ type: 'gallery', url: g.src || g.url, title: g.caption || null })),
            ...(body.videos || []).map((v: any) => ({ type: 'video', url: v.url, title: v.title || null })),
            ...(body.clips || []).map((c: any) => ({ type: 'clip', url: c.url, title: c.title || null })),
        ];

        const work = [
            ...(body.campaigns || []).map((c: any) => ({
                kind: 'campaign',
                title: c.brandName || c.title,
                category: c.category || null,
                year: c.year || null,
                description: c.description || null,
                imageUrl: c.imageUrl || null,
            })),
            ...(body.awards || []).map((a: any) => ({
                kind: 'award',
                title: a.title,
                category: a.category || null,
                year: a.year || null,
                description: a.description || null,
            })),
            ...(body.faqs || []).map((f: any) => ({
                kind: 'faq',
                title: f.question,
                description: f.answer,
            })),
        ];

        const social = {
            instagramUrl: body.instagram || null,
            youtubeUrl: body.youtube || null,
            facebookUrl: body.facebook || null,
            xUrl: body.x || null,
            spotifyUrl: body.spotify || null,
            spotifyFollowersLabel: body.fanbaseSpotify ? `${body.fanbaseSpotify} Followers` : null,
            youtubeSubscribersLabel: body.fanbaseYouTube ? `${body.fanbaseYouTube} Subscribers` : null,
            instagramFollowersLabel: body.fanbaseInstagram ? `${body.fanbaseInstagram} Followers` : null,
            facebookFollowersLabel: body.fanbaseFacebook ? `${body.fanbaseFacebook} Followers` : null,
            seoMetaTitle: body.metaTitle || null,
            seoMetaDescription: body.metaDescription || null,
            seoFocusKeyword: body.keywords || null,
            seoShareImageUrl: body.ogImageUrl || null,
        };

        const created = await this.repo.createArtistWithRelations({
            artist: artistData,
            media,
            work,
            social,
        });

        const response: any = { data: created };
        if (status === 'published' && completeness < 70) {
            response.warning = `Profile is only ${completeness}% complete`;
        }

        return response;
    }

    async updateArtist(id: string, body: any) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError('Artist not found');
        }

        const slug = body.slug ? this.slugify(body.slug) : existing.slug;
        if (slug !== existing.slug) {
            const exists = await this.repo.slugExists(slug, id);
            if (exists) {
                throw new ConflictError('Slug already exists');
            }
        }

        const { completeness } = this.calculateCompleteness(body);
        const status = body.status === 'published' ? 'published' : 'draft';
        const publishedAt = status === 'published' ? (existing.publishedAt || new Date()) : null;

        const artistData = {
            slug,
            name: body.name,
            tagline: body.tagline || null,
            city: body.city || existing.city,
            state: body.state || null,
            bio: body.bio || null,
            categories: body.categories || [],
            specializations: body.specializations ? [body.specializations] : [],
            experienceYears: body.experienceYears ? parseInt(body.experienceYears, 10) : null,
            projectsCount: body.projectsCount ? parseInt(body.projectsCount, 10) : null,
            liveShowsCount: body.liveShowsCount ? parseInt(body.liveShowsCount, 10) : null,
            totalFollowersLabel: body.totalFollowersLabel || null,
            height: body.height || null,
            weightKg: body.weight ? parseInt(body.weight, 10) : null,
            waistIn: body.waist ? parseInt(body.waist, 10) : null,
            chestIn: body.chest ? parseInt(body.chest, 10) : null,
            hairType: body.hairType || null,
            hairLength: body.hairLength || null,
            languages: body.languages || [],
            artistClass: body.artistClass || existing.artistClass,
            budgetRange: body.budgetRange || existing.budgetRange,
            isVerified: Boolean(body.isVerified),
            isExclusive: Boolean(body.isFeatured),
            status,
            profilePhotoUrl: body.photoUrl || body.profilePhotoUrl || existing.profilePhotoUrl,
            completenessPercent: completeness,
            publishedAt,
        };

        const media = [
            ...(body.gallery || []).map((g: any) => ({ type: 'gallery', url: g.src || g.url, title: g.caption || null })),
            ...(body.videos || []).map((v: any) => ({ type: 'video', url: v.url, title: v.title || null })),
            ...(body.clips || []).map((c: any) => ({ type: 'clip', url: c.url, title: c.title || null })),
        ];

        const work = [
            ...(body.campaigns || []).map((c: any) => ({
                kind: 'campaign',
                title: c.brandName || c.title,
                category: c.category || null,
                year: c.year || null,
                description: c.description || null,
                imageUrl: c.imageUrl || null,
            })),
            ...(body.awards || []).map((a: any) => ({
                kind: 'award',
                title: a.title,
                category: a.category || null,
                year: a.year || null,
                description: a.description || null,
            })),
            ...(body.faqs || []).map((f: any) => ({
                kind: 'faq',
                title: f.question,
                description: f.answer,
            })),
        ];

        const social = {
            instagramUrl: body.instagram || null,
            youtubeUrl: body.youtube || null,
            facebookUrl: body.facebook || null,
            xUrl: body.x || null,
            spotifyUrl: body.spotify || null,
            spotifyFollowersLabel: body.fanbaseSpotify ? `${body.fanbaseSpotify} Followers` : null,
            youtubeSubscribersLabel: body.fanbaseYouTube ? `${body.fanbaseYouTube} Subscribers` : null,
            instagramFollowersLabel: body.fanbaseInstagram ? `${body.fanbaseInstagram} Followers` : null,
            facebookFollowersLabel: body.fanbaseFacebook ? `${body.fanbaseFacebook} Followers` : null,
            seoMetaTitle: body.metaTitle || null,
            seoMetaDescription: body.metaDescription || null,
            seoFocusKeyword: body.keywords || null,
            seoShareImageUrl: body.ogImageUrl || null,
        };

        const updated = await this.repo.updateArtistWithRelations(id, {
            artist: artistData,
            media,
            work,
            social,
        });

        const response: any = { data: updated };
        if (status === 'published' && completeness < 70) {
            response.warning = `Profile is only ${completeness}% complete`;
        }

        return response;
    }

    async deleteArtist(id: string) {
        const deleted = await this.repo.deleteArtist(id);
        if (!deleted) {
            throw new NotFoundError('Artist not found');
        }
        return { success: true, id };
    }

    async duplicateArtist(id: string) {
        const original = await this.repo.findById(id);
        if (!original) {
            throw new NotFoundError('Artist not found');
        }

        let newSlug = `${original.slug}-copy`;
        let counter = 1;
        while (await this.repo.slugExists(newSlug)) {
            counter++;
            newSlug = `${original.slug}-copy-${counter}`;
        }

        const duplicatedArtist = {
            ...original,
            id: undefined,
            slug: newSlug,
            name: `${original.name} (Copy)`,
            status: 'draft',
            publishedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const media = (original.media || []).map((m) => ({
            type: m.type,
            title: m.title,
            url: m.url,
            sortOrder: m.sortOrder,
        }));

        const work = (original.work || []).map((w) => ({
            kind: w.kind,
            title: w.title,
            category: w.category,
            year: w.year,
            description: w.description,
            imageUrl: w.imageUrl,
            sortOrder: w.sortOrder,
        }));

        const social = original.social
            ? {
                  ...original.social,
                  id: undefined,
                  artistId: undefined,
              }
            : null;

        return this.repo.createArtistWithRelations({
            artist: duplicatedArtist,
            media,
            work,
            social,
        });
    }

    async publishArtist(id: string) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError('Artist not found');
        }
        const updated = await this.repo.updateStatus(id, 'published', new Date());
        return { success: true, data: updated };
    }

    async unpublishArtist(id: string) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError('Artist not found');
        }
        const updated = await this.repo.updateStatus(id, 'draft', null);
        return { success: true, data: updated };
    }

    async getArtistCompleteness(id: string) {
        const artist = await this.repo.findById(id);
        if (!artist) {
            throw new NotFoundError('Artist not found');
        }
        return this.calculateCompleteness(artist as any);
    }
}
