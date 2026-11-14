'use client';

import React from 'react';
import { ClipItem } from '@/lib/types';

interface ClipGridProps {
    clips?: ClipItem[];
}

export default function ClipGrid({ clips }: ClipGridProps) {
    if (!clips || clips.length === 0) return null;

    return (
        <section className="pp-s rv in" id="pp-reels">
            <div className="pp-sh">
                <h2>Reels &amp; short clips</h2>
                <p>Quick moments from shows, shoots and experiments.</p>
            </div>

            <div className="pp-rl">
                {clips.map((v, i) => {
                    const hue = (i * 37) % 40 + 340;

                    return (
                        <a
                            key={v.id || i}
                            className="pp-r"
                            href={v.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ['--h' as any]: hue }}
                        >
                            <span className="pp-pl">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </span>
                            <b>{v.title || `Clip ${i + 1}`}</b>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
