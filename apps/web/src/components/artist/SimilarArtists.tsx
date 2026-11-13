import React from 'react';
import { Artist, ArtistProfile } from '@/lib/types';
import ArtistCard from '@/components/ArtistCard';

interface SimilarArtistsProps {
    currentArtist: ArtistProfile;
    allArtists: Artist[];
}

export default function SimilarArtists({ currentArtist, allArtists }: SimilarArtistsProps) {
    // Find up to 4 similar artists (same category or tier, excluding current)
    const similar = allArtists
        .filter(
            (a) =>
                a.slug !== currentArtist.slug &&
                (a.cat === currentArtist.categories[0] ||
                    a.tier === currentArtist.artistClass ||
                    a.isVerified),
        )
        .slice(0, 4);

    if (similar.length === 0) return null;

    return (
        <section className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                        Similar artists
                    </h2>
                    <p className="text-sm text-[#6b6b76] mt-1">
                        Top performers in {currentArtist.categories[0] || 'similar categories'}{' '}
                        ready to book.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar.map((artist) => (
                    <ArtistCard
                        key={artist.id}
                        artist={artist}
                        badgeType={artist.tier === 'platinum' ? 'platinum' : 'rising'}
                    />
                ))}
            </div>
        </section>
    );
}
