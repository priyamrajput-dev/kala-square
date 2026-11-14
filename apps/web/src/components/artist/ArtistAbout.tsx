'use client';

import React, { useState } from 'react';
import { ArtistProfile } from '@/lib/types';

interface ArtistAboutProps {
    artist: ArtistProfile;
}

export default function ArtistAbout({ artist }: ArtistAboutProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const firstName = artist.name.replace(/^Dr\.\s*/, '').split(' ')[0];
    const p = artist.physicalStats;

    const physItems = [
        ['Height', p?.height],
        ['Weight', p?.weight],
        ['Waist', p?.waist],
        ['Chest', p?.chest],
        ['Hair type', p?.hairType],
        ['Hair length', p?.hairLength],
        ['Languages', p?.languages?.join(', ')],
    ].filter((item) => Boolean(item[1])) as [string, string][];

    const hasPhysicalStats = physItems.length > 0;
    const isBioLong = (artist.bio?.length || 0) > 280;

    return (
        <section className="pp-s rv in" id="pp-about">
            <div className="pp-sh">
                <h2>About {firstName}</h2>
            </div>

            {artist.bio ? (
                <>
                    <div className={`pp-bio ${isExpanded ? 'open' : ''}`} id="ppBio">
                        <p>{artist.bio}</p>
                    </div>

                    {isBioLong && (
                        <button
                            type="button"
                            className="pp-more"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </>
            ) : (
                <p className="pp-mu">No biography added yet.</p>
            )}

            {/* Physical Stats Box */}
            {hasPhysicalStats && (
                <div className="pp-ph2">
                    <h3>
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'var(--coral)' }}
                        >
                            <path d="M21.3 8.7l-6-6a1 1 0 0 0-1.4 0l-11.2 11.2a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0l11.2-11.2a1 1 0 0 0 0-1.4z" />
                            <path d="M7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2" />
                        </svg>
                        Physical stats
                    </h3>
                    <div className="pp-pg">
                        {physItems.map(([label, val]) => (
                            <div key={label}>
                                <small>{label}</small>
                                <b>{val}</b>
                            </div>
                        ))}
                    </div>
                    <p className="pp-mu">All measurements are current and professionally verified.</p>
                </div>
            )}
        </section>
    );
}
