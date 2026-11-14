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
        const soc = Boolean(
            data.instagram ||
            data.youtube ||
            data.facebook ||
            data.spotify ||
            data.x ||
            data.website ||
            data.imdbUrl ||
            (data as any).socialInstagram ||
            (data as any).socialYouTube ||
            (data as any).socialFacebook ||
            (data as any).socialX ||
            (data as any).socialSpotify
        );

        const chk = [
            Boolean(data.name && data.name.trim().length > 0),
            Boolean(data.photoUrl || (data as any).profilePhotoUrl),
            Boolean(data.categories && data.categories.length > 0),
            Boolean(data.city && data.city.trim().length > 0),
            Boolean(data.tagline && data.tagline.trim().length > 0),
            Boolean(data.bio && data.bio.trim().length > 0),
            Boolean(data.experienceYears && String(data.experienceYears).trim().length > 0),
            Boolean(data.projectsCount && String(data.projectsCount).trim().length > 0),
            Boolean(data.liveShowsCount && String(data.liveShowsCount).trim().length > 0),
            Boolean((data as any).totalFollowersLabel && String((data as any).totalFollowersLabel).trim().length > 0),
            Boolean(
                (Array.isArray(data.specializations) && data.specializations.length > 0) ||
                (typeof data.specializations === 'string' && data.specializations.trim().length > 0)
            ),
            Boolean(data.gallery && data.gallery.length >= 3),
            Boolean(data.videos && data.videos.some((v: any) => v.url && v.url.trim().length > 0)),
            Boolean(data.clips && data.clips.some((c: any) => c.url && c.url.trim().length > 0)),
            Boolean((data as any).songs && (data as any).songs.some((s: any) => s.url && s.url.trim().length > 0)),
            Boolean(data.campaigns && data.campaigns.length > 0),
            Boolean(data.awards && data.awards.length > 0),
            soc,
            Boolean((data as any).phone && String((data as any).phone).trim().length > 0),
        ];

        const score = Math.round((chk.filter(Boolean).length / chk.length) * 100);
        return {
            completeness: score,
            missing: [],
            tip: score === 100 ? 'Profile complete' : `Profile is ${score}% complete`,
        };
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

        // Only draft artists return 404; pending and live/published artists can be viewed via direct slug URL
        if (artist.status === 'draft') {
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

        const isSinger = (Array.isArray(artist.categories) ? artist.categories : []).some(
            (c: string) => c.toLowerCase().includes('singer')
        );
        const isActor = (Array.isArray(artist.categories) ? artist.categories : []).some(
            (c: string) => c.toLowerCase().includes('actor') || c.toLowerCase().includes('theatre')
        );

        const songs = isSinger
            ? artist.work
                  .filter((w) => w.kind === 'song')
                  .map((w) => ({ title: w.title, duration: w.category || '', plays: w.year || '', url: w.description || '' }))
            : [];

        const film = isActor
            ? artist.work
                  .filter((w) => w.kind === 'film')
                  .map((w) => ({ title: w.title, role: w.category || '', year: w.year || '', description: w.description || '' }))
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
            rating: 0,
            reviewCount: 0,
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
            photoUrl: artist.profilePhotoUrl || '',
            profilePhotoUrl: artist.profilePhotoUrl || '',
            rating: 0,
            reviewCount: 0,
            stats: (artist.experienceYears || artist.projectsCount || artist.liveShowsCount || artist.totalFollowersLabel)
                ? {
                    experience: artist.experienceYears ? `${artist.experienceYears} Years` : undefined,
                    projects: artist.projectsCount ? `${artist.projectsCount}+` : undefined,
                    liveShows: artist.liveShowsCount ? `${artist.liveShowsCount}+` : undefined,
                    followers: artist.totalFollowersLabel || (totalFollowers > 0 ? `${Math.round(totalFollowers / 1000)}K+` : undefined),
                }
                : undefined,
            physicalStats: (artist.height || artist.weightKg || artist.chestIn || artist.waistIn || artist.hairType || artist.hairLength || (Array.isArray(artist.languages) && artist.languages.length > 0))
                ? {
                    height: artist.height || undefined,
                    weight: artist.weightKg ? `${artist.weightKg} kg` : undefined,
                    chest: artist.chestIn ? `${artist.chestIn}"` : undefined,
                    waist: artist.waistIn ? `${artist.waistIn}"` : undefined,
                    hairType: artist.hairType || undefined,
                    hairLength: artist.hairLength || undefined,
                    languages: Array.isArray(artist.languages) && artist.languages.length > 0 ? artist.languages : undefined,
                }
                : undefined,
            fanbase: [
                social?.spotifyFollowersLabel ? { platform: 'Spotify' as const, count: social.spotifyFollowersLabel, percentage: 35, color: '#1DB954' } : null,
                social?.youtubeSubscribersLabel ? { platform: 'YouTube' as const, count: social.youtubeSubscribersLabel, percentage: 40, color: '#FF0000' } : null,
                social?.instagramFollowersLabel ? { platform: 'Instagram' as const, count: social.instagramFollowersLabel, percentage: 25, color: '#E4405F' } : null,
            ].filter(Boolean) as any[],
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
            songs,
            campaigns,
            awards,
            faqs,
            imdb: isActor
                ? {
                      imdbUrl: undefined,
                      credits: film,
                      knownFor: [],
                  }
                : undefined,
            reviews: [],
            similarArtists,
            budgetRange: artist.budgetRange && artist.budgetRange !== 'not_set' ? artist.budgetRange : undefined,
            availability: 'Available',
            priceLabel: artist.budgetRange && artist.budgetRange !== 'not_set' ? artist.budgetRange : undefined,
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

        const songs = artist.work
            .filter((w) => w.kind === 'song')
            .map((w) => ({ id: w.id, title: w.title, duration: w.category || '', plays: w.year || '', url: w.description || '' }));

        const film = artist.work
            .filter((w) => w.kind === 'film')
            .map((w) => ({ id: w.id, title: w.title, category: w.category || '', year: w.year || '', description: w.description || '' }));

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
            totalFollowersLabel: artist.totalFollowersLabel || '',
            budgetRange: artist.budgetRange || '',
            phone: (artist as any).phone || '',
            email: (artist as any).email || '',
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
            socialInstagram: social?.instagramUrl || '',
            socialYouTube: social?.youtubeUrl || '',
            socialFacebook: social?.facebookUrl || '',
            socialX: social?.xUrl || '',
            socialSpotify: social?.spotifyUrl || '',
            website: '',
            imdbUrl: '',
            fanbaseSpotify: social?.spotifyFollowersLabel ? Number(social.spotifyFollowersLabel.replace(/[^\d]/g, '')) : '',
            fanbaseYouTube: social?.youtubeSubscribersLabel ? Number(social.youtubeSubscribersLabel.replace(/[^\d]/g, '')) : '',
            fanbaseInstagram: social?.instagramFollowersLabel ? Number(social.instagramFollowersLabel.replace(/[^\d]/g, '')) : '',
            fanbaseFacebook: social?.facebookFollowersLabel ? Number(social.facebookFollowersLabel.replace(/[^\d]/g, '')) : '',
            gallery,
            videos,
            clips,
            songs,
            film,
            campaigns,
            awards,
            faqs,
            metaTitle: social?.seoMetaTitle || '',
            metaDescription: social?.seoMetaDescription || '',
            keywords: social?.seoFocusKeyword || '',
            focusKeyword: social?.seoFocusKeyword || '',
            photoAltText: artist.name || '',
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
        const isPublishRequested = body.status === 'published' || body.status === 'live';
        const isVerified = Boolean(body.isVerified);
        const status = isPublishRequested ? (isVerified ? 'live' : 'pending') : 'draft';
        const publishedAt = status === 'live' ? new Date() : null;

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
            ...(body.gallery || [])
                .map((g: any) => ({
                    type: 'gallery',
                    url: typeof g === 'string' ? g : (g.src || g.url),
                    title: typeof g === 'object' ? (g.caption || null) : null,
                }))
                .filter((m: any) => Boolean(m.url)),
            ...(body.videos || [])
                .filter((v: any) => Boolean(v.url))
                .map((v: any) => ({ type: 'video', url: v.url, title: v.title || null })),
            ...(body.clips || [])
                .filter((c: any) => Boolean(c.url))
                .map((c: any) => ({ type: 'clip', url: c.url, title: c.title || null })),
        ];

        const work = [
            ...(body.campaigns || [])
                .filter((c: any) => Boolean(c.brandName || c.title))
                .map((c: any) => ({
                    kind: 'campaign',
                    title: c.brandName || c.title,
                    category: c.category || null,
                    year: c.year || null,
                    description: c.description || null,
                    imageUrl: c.imageUrl || null,
                })),
            ...(body.awards || [])
                .filter((a: any) => Boolean(a.title))
                .map((a: any) => ({
                    kind: 'award',
                    title: a.title,
                    category: a.category || null,
                    year: a.year || null,
                    description: a.description || null,
                })),
            ...(body.faqs || [])
                .filter((f: any) => Boolean(f.question && f.answer))
                .map((f: any) => ({
                    kind: 'faq',
                    title: f.question,
                    description: f.answer,
                })),
            ...(body.songs || [])
                .filter((s: any) => Boolean(s.title || s.t))
                .map((s: any) => ({
                    kind: 'song',
                    title: s.title || s.t,
                    category: s.duration || s.dur || null,
                    year: s.plays || null,
                    description: s.url || s.u || null,
                })),
            ...(body.film || [])
                .filter((f: any) => Boolean(f.title || f.t))
                .map((f: any) => ({
                    kind: 'film',
                    title: f.title || f.t,
                    category: f.category || f.cat || null,
                    year: f.year || null,
                    description: f.description || f.d || null,
                })),
        ];

        const social = {
            instagramUrl: body.socialInstagram || body.instagram || null,
            youtubeUrl: body.socialYouTube || body.youtube || null,
            facebookUrl: body.socialFacebook || body.facebook || null,
            xUrl: body.socialX || body.x || null,
            spotifyUrl: body.socialSpotify || body.spotify || null,
            spotifyFollowersLabel: body.fanbaseSpotify ? `${body.fanbaseSpotify} Followers` : null,
            youtubeSubscribersLabel: body.fanbaseYouTube ? `${body.fanbaseYouTube} Subscribers` : null,
            instagramFollowersLabel: body.fanbaseInstagram ? `${body.fanbaseInstagram} Followers` : null,
            facebookFollowersLabel: body.fanbaseFacebook ? `${body.fanbaseFacebook} Followers` : null,
            seoMetaTitle: body.metaTitle || null,
            seoMetaDescription: body.metaDescription || null,
            seoFocusKeyword: body.focusKeyword || body.keywords || null,
            seoShareImageUrl: body.ogImageUrl || null,
        };

        const created = await this.repo.createArtistWithRelations({
            artist: artistData,
            media,
            work,
            social,
        });

        const response: any = { data: created };
        if ((status === 'live' || (status as string) === 'published') && completeness < 70) {
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
        const isPublishRequested = body.status === 'published' || body.status === 'live';
        const isVerified = body.isVerified !== undefined ? Boolean(body.isVerified) : existing.isVerified;
        const status = isPublishRequested ? (isVerified ? 'live' : 'pending') : 'draft';
        const publishedAt = status === 'live' ? (existing.publishedAt || new Date()) : null;

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
            ...(body.gallery || [])
                .map((g: any) => ({
                    type: 'gallery',
                    url: typeof g === 'string' ? g : (g.src || g.url),
                    title: typeof g === 'object' ? (g.caption || null) : null,
                }))
                .filter((m: any) => Boolean(m.url)),
            ...(body.videos || [])
                .filter((v: any) => Boolean(v.url))
                .map((v: any) => ({ type: 'video', url: v.url, title: v.title || null })),
            ...(body.clips || [])
                .filter((c: any) => Boolean(c.url))
                .map((c: any) => ({ type: 'clip', url: c.url, title: c.title || null })),
        ];

        const work = [
            ...(body.campaigns || [])
                .filter((c: any) => Boolean(c.brandName || c.title))
                .map((c: any) => ({
                    kind: 'campaign',
                    title: c.brandName || c.title,
                    category: c.category || null,
                    year: c.year || null,
                    description: c.description || null,
                    imageUrl: c.imageUrl || null,
                })),
            ...(body.awards || [])
                .filter((a: any) => Boolean(a.title))
                .map((a: any) => ({
                    kind: 'award',
                    title: a.title,
                    category: a.category || null,
                    year: a.year || null,
                    description: a.description || null,
                })),
            ...(body.faqs || [])
                .filter((f: any) => Boolean(f.question && f.answer))
                .map((f: any) => ({
                    kind: 'faq',
                    title: f.question,
                    description: f.answer,
                })),
            ...(body.songs || [])
                .filter((s: any) => Boolean(s.title || s.t))
                .map((s: any) => ({
                    kind: 'song',
                    title: s.title || s.t,
                    category: s.duration || s.dur || null,
                    year: s.plays || null,
                    description: s.url || s.u || null,
                })),
            ...(body.film || [])
                .filter((f: any) => Boolean(f.title || f.t))
                .map((f: any) => ({
                    kind: 'film',
                    title: f.title || f.t,
                    category: f.category || f.cat || null,
                    year: f.year || null,
                    description: f.description || f.d || null,
                })),
        ];

        const social = {
            instagramUrl: body.socialInstagram || body.instagram || null,
            youtubeUrl: body.socialYouTube || body.youtube || null,
            facebookUrl: body.socialFacebook || body.facebook || null,
            xUrl: body.socialX || body.x || null,
            spotifyUrl: body.socialSpotify || body.spotify || null,
            spotifyFollowersLabel: body.fanbaseSpotify ? `${body.fanbaseSpotify} Followers` : null,
            youtubeSubscribersLabel: body.fanbaseYouTube ? `${body.fanbaseYouTube} Subscribers` : null,
            instagramFollowersLabel: body.fanbaseInstagram ? `${body.fanbaseInstagram} Followers` : null,
            facebookFollowersLabel: body.fanbaseFacebook ? `${body.fanbaseFacebook} Followers` : null,
            seoMetaTitle: body.metaTitle || null,
            seoMetaDescription: body.metaDescription || null,
            seoFocusKeyword: body.focusKeyword || body.keywords || null,
            seoShareImageUrl: body.ogImageUrl || null,
        };

        const updated = await this.repo.updateArtistWithRelations(id, {
            artist: artistData,
            media,
            work,
            social,
        });

        const response: any = { data: updated };
        if ((status === 'live' || (status as string) === 'published') && completeness < 70) {
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
