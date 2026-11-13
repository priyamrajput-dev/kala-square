import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ArtistForm from '@/components/admin/ArtistForm';
import { mockArtistProfiles, getArtistProfileBySlug } from '@/lib/mock-data';
import { ArtistFormData } from '@/lib/validators/artist-form';

export const dynamic = 'force-dynamic';

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
    const { id } = await params;
    const artist =
        mockArtistProfiles.find((a) => a.id === id || a.slug === id) || getArtistProfileBySlug(id);

    return {
        title: artist
            ? `Edit ${artist.name} | KalaSquare Admin`
            : 'Artist Not Found | KalaSquare Admin',
    };
}

export default async function EditArtistPage({ params }: EditPageProps) {
    const { id } = await params;

    // Search by ID or slug in mock data
    const profile =
        mockArtistProfiles.find((a) => a.id === id || a.slug === id) || getArtistProfileBySlug(id);

    if (!profile) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-[#e6e6ea] text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-12 h-12 rounded-full bg-[#fde6ea] text-[#eb4e62] flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-[#1b1b1f]">
                    Artist Profile Not Found
                </h2>
                <p className="text-sm text-[#6b6b76]">
                    The artist profile with identifier &ldquo;{id}&rdquo; does not exist or has been
                    removed.
                </p>
                <div className="pt-2">
                    <Link
                        href="/admin/artists"
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#eb4e62] text-white font-bold text-xs shadow-sm hover:bg-[#d63a50] transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Artists</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Pre-fill initial form data from profile
    const initialData: Partial<ArtistFormData> = {
        name: profile.name,
        slug: profile.slug,
        tagline: profile.tagline || '',
        photoUrl: profile.photoUrl,
        city: profile.city,
        state: profile.state || 'Delhi-NCR',
        artistClass: profile.artistClass,
        isVerified: profile.isVerified,
        isFeatured: true,
        bio: profile.bio,
        languages: profile.physicalStats?.languages || ['Hindi', 'English'],
        specializations: profile.specializations?.join(', ') || '',
        height: profile.physicalStats?.height || '',
        weight: profile.physicalStats?.weight || '',
        waist: profile.physicalStats?.waist || '',
        chest: profile.physicalStats?.chest || '',
        hairType: (profile.physicalStats?.hairType as 'Straight' | 'Wavy' | 'Curly') || '',
        hairLength: (profile.physicalStats?.hairLength as 'Short' | 'Medium' | 'Long') || '',
        experienceYears: profile.quickStats.experienceYears || '',
        projectsCount: profile.quickStats.projectsCount || '',
        liveShowsCount: profile.quickStats.liveShowsCount || '',
        categories: profile.categories,
        priceFrom: 50000,
        priceTo: 150000,
        availability: 'Available',
        instagram: profile.social.instagram || '',
        youtube: profile.social.youtube || '',
        facebook: profile.social.facebook || '',
        x: profile.social.x || '',
        spotify: profile.social.spotify || '',
        imdbUrl: profile.imdb?.imdbUrl || '',
        fanbaseSpotify: profile.fanbase.find((f) => f.key === 'fbSp')?.numValue || 0,
        fanbaseYouTube: profile.fanbase.find((f) => f.key === 'fbYt')?.numValue || 0,
        fanbaseInstagram: profile.fanbase.find((f) => f.key === 'fbIg')?.numValue || 0,
        fanbaseFacebook: profile.fanbase.find((f) => f.key === 'fbFb')?.numValue || 0,
        fanbaseDeezer: profile.fanbase.find((f) => f.key === 'fbDz')?.numValue || 0,
        fanbaseSoundCloud: profile.fanbase.find((f) => f.key === 'fbSc')?.numValue || 0,
        fanbaseTikTok: profile.fanbase.find((f) => f.key === 'fbTt')?.numValue || 0,
        gallery: profile.gallery.map((g) => ({
            id: g.id,
            src: g.src,
            caption: g.title || '',
        })),
        videos: profile.videos.map((v) => ({
            id: v.id,
            title: v.title,
            url: v.url,
            duration: '4:15',
        })),
        clips: profile.clips.map((c) => ({
            id: c.id,
            title: c.title,
            url: c.url,
            platform: 'YouTube Shorts' as const,
        })),
        campaigns: profile.campaigns.map((cp) => ({
            id: cp.id,
            brandName: cp.brandName,
            category: cp.category,
            year: cp.year,
            description: cp.description,
        })),
        awards: profile.awards.map((aw) => ({
            id: aw.id,
            title: aw.title,
            category: aw.category,
            year: aw.year,
            description: aw.description,
        })),
        faqs:
            profile.faqs?.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
            })) || [],
        metaTitle: `${profile.name} | KalaSquare`,
        metaDescription: profile.bio.slice(0, 160),
        status: 'published',
    };

    return <ArtistForm mode="edit" initialData={initialData} artistId={profile.id} />;
}
