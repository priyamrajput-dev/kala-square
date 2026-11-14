'use client';

import React from 'react';
import { SongItem } from '@/lib/types';

interface TopSongsProps {
    categories: string[];
    songs?: SongItem[];
}

export default function TopSongs({ categories, songs }: TopSongsProps) {
    const isSinger = categories.some(
        (c) => c.toLowerCase().includes('singer') || c.toLowerCase().includes('vocal'),
    );

    if (!isSinger || !songs || songs.length === 0) return null;

    return (
        <section className="pp-s rv in" id="pp-music">
            <div className="pp-sh">
                <h2>
                    <span className="pp-spot">Spotify</span>
                    Top songs
                </h2>
                <p>Popular tracks.</p>
            </div>

            <div className="pp-ig">
                {songs.map((x, i) => (
                    <div key={x.id || i} className="pp-xc sp">
                        <span className="pst">
                            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.963-.335.077-.67-.133-.747-.468-.077-.334.133-.67.468-.747 3.808-.871 7.076-.496 9.714 1.115.295.18.387.563.207.856zm1.223-2.724c-.227.37-.714.487-1.084.26-2.688-1.652-6.785-2.131-9.965-1.166-.416.127-.859-.107-.986-.523-.127-.416.107-.859.523-.986 3.633-1.102 8.147-.568 11.252 1.331.37.227.487.714.26 1.084zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.02-.13-1.17-.624-.15-.494.13-1.02.624-1.17 3.532-1.072 9.404-.866 13.115 1.338.445.264.59.838.326 1.282-.264.444-.838.59-1.282.326z" />
                            </svg>
                        </span>
                        <b>{x.title}</b>
                        <small>{x.plays ? `${x.plays} plays` : 'Single'}</small>
                        {x.url && (
                            <a
                                className="lk"
                                href={x.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open track"
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
