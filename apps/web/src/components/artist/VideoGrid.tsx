'use client';

import React, { useState } from 'react';
import { VideoItem } from '@/lib/types';

interface VideoGridProps {
    videos?: VideoItem[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

    if (!videos || videos.length === 0) return null;

    const getYouTubeId = (url: string) => {
        const m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url);
        return m ? m[1] : null;
    };

    const handleVideoClick = (v: VideoItem) => {
        const id = v.youtubeId || (v.url ? getYouTubeId(v.url) : null);
        if (id) {
            setActiveVideoUrl(`https://www.youtube.com/embed/${id}?autoplay=1`);
        } else if (v.url) {
            window.open(v.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section className="pp-s rv in" id="pp-videos">
            <div className="pp-sh">
                <h2>Latest videos</h2>
                <p>Interviews, performances and talks.</p>
            </div>

            <div className="pp-vg">
                {videos.map((v, i) => {
                    const id = v.youtubeId || (v.url ? getYouTubeId(v.url) : null);
                    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;

                    return (
                        <button
                            key={v.id || i}
                            type="button"
                            className="pp-v"
                            onClick={() => handleVideoClick(v)}
                        >
                            <span className="pp-vt">
                                {thumb && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img alt="" loading="lazy" src={thumb} />
                                )}
                                <span className="pp-pl">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                </span>
                            </span>
                            <b>{v.title || 'Untitled video'}</b>
                            <small>{v.url ? 'Watch now' : 'Link coming soon'}</small>
                        </button>
                    );
                })}
            </div>

            {/* Video Player Modal */}
            {activeVideoUrl && (
                <div
                    className="pp-lb"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Video player"
                    onClick={() => setActiveVideoUrl(null)}
                >
                    <button
                        type="button"
                        className="x"
                        onClick={() => setActiveVideoUrl(null)}
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="vb" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={activeVideoUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Video player"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
