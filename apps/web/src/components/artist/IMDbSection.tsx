'use client';

import React from 'react';
import { IMDbData } from '@/lib/types';

interface IMDbSectionProps {
    categories: string[];
    imdb?: IMDbData;
}

export default function IMDbSection({ categories, imdb }: IMDbSectionProps) {
    const isActor = categories.some(
        (c) => c.toLowerCase().includes('actor') || c.toLowerCase().includes('theatre'),
    );

    if (!isActor || !imdb) return null;

    const kn = imdb.knownFor || [];
    const credits = imdb.credits || [];

    if (credits.length === 0 && kn.length === 0) return null;

    return (
        <section className="pp-s rv in" id="pp-imdb">
            <div className="pp-sh">
                <h2>
                    <span className="pp-imdb">IMDb</span>
                    Film &amp; screen
                </h2>
                <p>Credits and known-for titles.</p>
            </div>

            <div className="pp-ig">
                {credits.map((x) => {
                    const isKnown = x.isKnownFor || kn.some((k) => k.toLowerCase() === x.title.toLowerCase());
                    const sub = [x.role, x.type].filter(Boolean).join(' · ');

                    return (
                        <div key={x.id || x.title} className="pp-xc im">
                            <span className="pst">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="26"
                                    height="26"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                                    <line x1="7" y1="2" x2="7" y2="22" />
                                    <line x1="17" y1="2" x2="17" y2="22" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <line x1="2" y1="7" x2="7" y2="7" />
                                    <line x1="2" y1="17" x2="7" y2="17" />
                                    <line x1="17" y1="17" x2="22" y2="17" />
                                    <line x1="17" y1="7" x2="22" y2="7" />
                                </svg>
                                {x.year && <em>{x.year}</em>}
                            </span>
                            <b>{x.title}</b>
                            {sub && <small>{sub}</small>}
                            {isKnown && <i className="kf">Known for</i>}
                            {imdb.imdbUrl && (
                                <a
                                    className="lk"
                                    href={imdb.imdbUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open IMDb link"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
