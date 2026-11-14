'use client';

import React from 'react';
import Link from 'next/link';
import { Artist, ArtistProfile } from '@/lib/types';

interface SimilarArtistsProps {
    currentArtist: ArtistProfile;
    allArtists: Artist[];
}

export default function SimilarArtists({ currentArtist, allArtists }: SimilarArtistsProps) {
    // Find up to 8 similar artists
    const similar = allArtists
        .filter(
            (a) =>
                a.slug !== currentArtist.slug &&
                (a.cat === currentArtist.categories[0] ||
                    a.tier === currentArtist.artistClass ||
                    a.isVerified),
        )
        .slice(0, 8);

    if (similar.length === 0) return null;

    return (
        <section className="pp-sm rv in">
            <div className="wrap">
                <h2>Similar artists</h2>
                <div className="pp-sr">
                    {similar.map((x) => {
                        const ava = x.name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

                        return (
                            <Link
                                key={x.id}
                                href={`/top-creators/${x.slug}`}
                                className="pp-sa"
                            >
                                <span
                                    className={`im ${x.photoUrl ? 'has' : ''}`}
                                    style={x.photoUrl ? { backgroundImage: `url(${x.photoUrl})` } : undefined}
                                >
                                    {!x.photoUrl && ava}
                                </span>
                                <b>{x.name}</b>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
